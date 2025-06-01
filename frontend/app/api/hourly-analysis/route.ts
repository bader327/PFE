import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ligneId = url.searchParams.get('ligneId');
  const date = url.searchParams.get('date');
  
  if (!ligneId || !date) {
    return NextResponse.json({ error: 'ligneId et date requis' }, { status: 400 });
  }
  
  try {
    // Get the date range
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Get all files for the specified date and ligne
    const files = await prisma.file.findMany({
      where: {
        ligneId,
        uploadedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        uploadedAt: 'asc'
      }
    });
    
    // Group data by hour
    const hourlyData = Array(24).fill(null).map((_, hour) => {
      return {
        hour,
        produitsConformes: 0,
        produitsNonConformes: 0,
        bobinesIncompletes: 0,
        ftq: 0,
        tauxProduction: 0,
        tauxRejets: 0,
        fileCount: 0,
        hourLabel: `${hour.toString().padStart(2, '0')}:00`
      };
    });
    
    // Fill in data for each hour
    files.forEach(file => {
      const hour = new Date(file.uploadedAt).getHours();
      
      hourlyData[hour].produitsConformes += file.produitsConformes;
      hourlyData[hour].produitsNonConformes += file.produitsNonConformes;
      hourlyData[hour].bobinesIncompletes += file.bobinesIncompletes;
      hourlyData[hour].ftq += file.ftq;
      hourlyData[hour].tauxProduction += file.tauxProduction;
      hourlyData[hour].tauxRejets += file.tauxRejets;
      hourlyData[hour].fileCount += 1;
    });
    
    // Calculate averages for hours with data
    hourlyData.forEach(hourData => {
      if (hourData.fileCount > 0) {
        hourData.ftq = parseFloat((hourData.ftq / hourData.fileCount).toFixed(2));
        hourData.tauxProduction = parseFloat((hourData.tauxProduction / hourData.fileCount).toFixed(2));
        hourData.tauxRejets = parseFloat((hourData.tauxRejets / hourData.fileCount).toFixed(2));
      }
    });
    
    // Identify alert hours (where FTQ or production rate falls below thresholds)
    const alerts = hourlyData
      .filter(hourData => hourData.fileCount > 0)
      .filter(hourData => {
        return hourData.ftq < 85 || hourData.tauxProduction < 80;
      })
      .map(hourData => ({
        hour: hourData.hour,
        hourLabel: hourData.hourLabel,
        ftq: hourData.ftq,
        tauxProduction: hourData.tauxProduction,
        message: `Alert at ${hourData.hourLabel}: ${
          hourData.ftq < 85 ? `Low FTQ (${hourData.ftq}%)` : ''
        }${
          hourData.ftq < 85 && hourData.tauxProduction < 80 ? ' and ' : ''
        }${
          hourData.tauxProduction < 80 ? `Low Production Rate (${hourData.tauxProduction}%)` : ''
        }`
      }));
    
    // Calculate shift metrics (assuming 3 shifts of 8 hours: 6-14, 14-22, 22-6)
    const shifts = [
      {
        name: 'Morning Shift (6:00 - 14:00)',
        hours: [6, 7, 8, 9, 10, 11, 12, 13],
        data: { produitsConformes: 0, produitsNonConformes: 0, bobinesIncompletes: 0, ftq: 0, count: 0 }
      },
      {
        name: 'Afternoon Shift (14:00 - 22:00)',
        hours: [14, 15, 16, 17, 18, 19, 20, 21],
        data: { produitsConformes: 0, produitsNonConformes: 0, bobinesIncompletes: 0, ftq: 0, count: 0 }
      },
      {
        name: 'Night Shift (22:00 - 6:00)',
        hours: [22, 23, 0, 1, 2, 3, 4, 5],
        data: { produitsConformes: 0, produitsNonConformes: 0, bobinesIncompletes: 0, ftq: 0, count: 0 }
      }
    ];
    
    // Calculate metrics for each shift
    shifts.forEach(shift => {
      shift.hours.forEach(hour => {
        const hourData = hourlyData[hour];
        if (hourData.fileCount > 0) {
          shift.data.produitsConformes += hourData.produitsConformes;
          shift.data.produitsNonConformes += hourData.produitsNonConformes;
          shift.data.bobinesIncompletes += hourData.bobinesIncompletes;
          shift.data.ftq += hourData.ftq;
          shift.data.count += 1;
        }
      });
      
      // Calculate averages for shift FTQ
      if (shift.data.count > 0) {
        shift.data.ftq = parseFloat((shift.data.ftq / shift.data.count).toFixed(2));
      }
    });
    
    return NextResponse.json({
      hourlyData,
      alerts,
      shifts,
      dateAnalyzed: date,
      totalFiles: files.length
    });
  } catch (error) {
    console.error('Error retrieving hourly analysis:', error);
    return NextResponse.json(
      { error: 'Error retrieving hourly analysis data' }, 
      { status: 500 }
    );
  }
}
