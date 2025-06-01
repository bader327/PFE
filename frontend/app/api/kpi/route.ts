import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ligneId = url.searchParams.get('ligneId');
  const date = url.searchParams.get('date');
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  
  try {
    let whereClause: any = {};
    
    // Filter by ligne if ligneId is provided
    if (ligneId) {
      whereClause.ligneId = ligneId;
    }
    
    // Filter by specific date if provided
    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      
      whereClause.uploadedAt = {
        gte: dateObj,
        lt: nextDay
      };
    }
    // Filter by date range if provided
    else if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      
      whereClause.uploadedAt = {
        gte: startDateObj,
        lte: endDateObj
      };
    }
    
    // Get all files matching the criteria
    const files = await prisma.file.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: 'asc'
      }
    });
    
    // Calculate aggregate KPIs
    const totalProduitsConformes = files.reduce((sum, file) => sum + file.produitsConformes, 0);
    const totalProduitsNonConformes = files.reduce((sum, file) => sum + file.produitsNonConformes, 0);
    const totalBobinesIncompletes = files.reduce((sum, file) => sum + file.bobinesIncompletes, 0);
    
    const totalProduits = totalProduitsConformes + totalProduitsNonConformes + totalBobinesIncompletes;
    
    // Calculate average KPIs
    const avgFtq = files.length ? files.reduce((sum, file) => sum + file.ftq, 0) / files.length : 0;
    const avgTauxProduction = files.length ? files.reduce((sum, file) => sum + file.tauxProduction, 0) / files.length : 0;
    const avgTauxRejets = files.length ? files.reduce((sum, file) => sum + file.tauxRejets, 0) / files.length : 0;
    
    // Group data by date for charts
    const dataByDate = files.reduce((acc: any, file) => {
      const dateString = file.uploadedAt.toISOString().split('T')[0];
      
      if (!acc[dateString]) {
        acc[dateString] = {
          date: dateString,
          produitsConformes: 0,
          produitsNonConformes: 0,
          bobinesIncompletes: 0,
          ftq: 0,
          tauxProduction: 0,
          tauxRejets: 0,
          count: 0
        };
      }
      
      acc[dateString].produitsConformes += file.produitsConformes;
      acc[dateString].produitsNonConformes += file.produitsNonConformes;
      acc[dateString].bobinesIncompletes += file.bobinesIncompletes;
      acc[dateString].ftq += file.ftq;
      acc[dateString].tauxProduction += file.tauxProduction;
      acc[dateString].tauxRejets += file.tauxRejets;
      acc[dateString].count += 1;
      
      return acc;
    }, {});
    
    // Calculate daily averages
    Object.keys(dataByDate).forEach(date => {
      const data = dataByDate[date];
      data.ftq = data.ftq / data.count;
      data.tauxProduction = data.tauxProduction / data.count;
      data.tauxRejets = data.tauxRejets / data.count;
    });
    
    const chartData = Object.values(dataByDate);
    
    // Prepare response
    const kpiData = {
      summary: {
        totalFiles: files.length,
        produitsConformes: totalProduitsConformes,
        produitsNonConformes: totalProduitsNonConformes,
        bobinesIncompletes: totalBobinesIncompletes,
        totalProduits,
        ftq: parseFloat(avgFtq.toFixed(2)),
        tauxProduction: parseFloat(avgTauxProduction.toFixed(2)),
        tauxRejets: parseFloat(avgTauxRejets.toFixed(2)),
      },
      chartData,
      files
    };
    
    return NextResponse.json(kpiData);
  } catch (error) {
    console.error('Erreur lors de la récupération des KPI:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des KPI' }, { status: 500 });
  }
}
