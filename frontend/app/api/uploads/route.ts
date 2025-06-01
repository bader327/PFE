import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { processExcelFile } from '../../../lib/excelParser';
import { checkFpsConditions } from '../../../lib/fpsDetection';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const ligneId = formData.get('ligneId') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'Fichier non fourni' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await new Promise((resolve, reject) => {
      const fs = require('fs');
      fs.mkdir(uploadDir, { recursive: true }, (err: any) => {
        if (err) reject(err);
        resolve(null);
      });
    });

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    // Process Excel file
    const { 
      produitsConformes, 
      produitsNonConformes,
      bobinesIncompletes,
      conformityRate: ftq,
      productionRate: tauxProduction,
      rejectRate: tauxRejets,
      targetProduction: productionCible,      bobinesData,
      extendedInfo: { hourlyData }
    } = await processExcelFile(filepath);
      // Create file record in database with hourly data
    const fileRecord = await prisma.file.create({      data: {
        path: `/uploads/${filename}`,
        ligneId: ligneId || undefined,
        produitsConformes,
        produitsNonConformes,
        bobinesIncompletes,
        ftq,
        tauxProduction,
        tauxRejets,
        productionCible
      }
    });    // Create hourly data records
    await Promise.all(
      Object.entries(hourlyData).map(([hour, data]) => 
        prisma.file.update({
          where: { id: fileRecord.id },
          data: {
            hourlyData: {
              create: {
                hour: parseInt(hour),
                produitsConformes: data.produitsConformes,
                produitsNonConformes: data.produitsNonConformes,
                total: data.total
              }
            }
          }
        })
      )
    );

    // Get file with hourly data included
    const fileWithHourlyData = await prisma.file.findUnique({
      where: { id: fileRecord.id },
      include: { hourlyData: true }
    });
      // Format bobine data and check FPS conditions
    const formattedBobines = bobinesData.map(b => {
      const defectsCount = Object.values(b.defauts).filter(Boolean).length;
      const defectKey = Object.keys(b.defauts).find(key => b.defauts[key as keyof typeof b.defauts]);
      
      return {
        ...b,
        defects: defectsCount,
        qualityScore: b.hasDefect ? 0.7 : 1.0,
        incompleteness: 0, // Calculate based on your data
        productType: b.produit,
        defectType: b.hasDefect && defectKey ? defectKey : undefined
      };
    });

    const fpsConditionsMet = checkFpsConditions(formattedBobines, fileWithHourlyData?.hourlyData || undefined);
    
    if (fpsConditionsMet) {
      // Create an initial FPS1 record linked to the file
      await prisma.fps1.create({
        data: {
          fileId: fileRecord.id,
          operateur: "À remplir",
          defaut: fpsConditionsMet.defaut || "À préciser",
          produit: fpsConditionsMet.produit || "À préciser",
          numeroBobine: fpsConditionsMet.numeroBobine || "À préciser",
          cause: "À déterminer",
          actions: "À définir",
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      file: fileWithHourlyData, 
      fpsRequired: fpsConditionsMet !== null 
    });
  } catch (error) {
    console.error('Erreur lors du traitement du fichier:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement du fichier' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ligneId = url.searchParams.get('ligneId');
  const date = url.searchParams.get('date');
  
  try {
    let whereClause: any = {};
    
    // Filter by ligne if ligneId is provided
    if (ligneId) {
      whereClause.ligneId = ligneId;
    }
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.uploadedAt = {
        gte: startDate,
        lte: endDate
      };
    }
    
    const files = await prisma.file.findMany({
      where: whereClause,
      include: {
        ligne: true,
        fps1: {
          include: {
            fps2: {
              include: {
                fps3: true
              }
            }
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des fichiers' }, { status: 500 });
  }
}
