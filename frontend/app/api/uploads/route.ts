import { writeFile } from 'fs/promises';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import path from 'path';
import { processExcelFile } from '../../../lib/excelParser';
import { checkFpsConditions } from '../../../lib/fpsDetection';

interface HourlyData {
  produitsConformes: number;
  produitsNonConformes: number;
  total: number;
}

interface FileDocument {
  _id: ObjectId;
  path: string;
  ligneId: ObjectId | null;
  produitsConformes: number;
  produitsNonConformes: number;
  bobinesIncompletes: number;
  ftq: number;
  tauxProduction: number;
  tauxRejets: number;
  productionCible: number;
  uploadedAt: Date;
  hourlyData?: HourlyData[];
  fps?: any[];
}

// Use connection string from .env file
const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/pfe_dashboard";
const dbName = uri.split('/').pop() || 'pfe_dashboard';

// Create a new MongoClient instance with options
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Function to handle database connection
async function connectToDatabase(): Promise<Db> {
  try {
    await client.connect();
    const db = client.db(dbName);
    // Test the connection
    await db.command({ ping: 1 });
    console.log("Successfully connected to MongoDB.");
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

export async function POST(req: Request) {
  let db: Db | undefined;
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
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, fileBuffer);
      try {
      // Process Excel file from buffer
      const { 
        produitsConformes, 
        produitsNonConformes,
        bobinesIncompletes,
        conformityRate: ftq,
        productionRate: tauxProduction,
        rejectRate: tauxRejets,
        targetProduction: productionCible,
        bobinesData,
        hourlyData,
        serialsNOK,
        serialsIncomplets
      } = await processExcelFile(fileBuffer.buffer);
      // Connect to MongoDB
      db = await connectToDatabase();

      // Insert file record with proper ObjectId handling
      const fileDoc = await db.collection('File').insertOne({
        _id: new ObjectId(),
        path: `/uploads/${filename}`,
        ligneId: ligneId ? new ObjectId(ligneId) : null,
        produitsConformes,
        produitsNonConformes,
        bobinesIncompletes,
        ftq,
        tauxProduction,
        tauxRejets,
        productionCible,
        uploadedAt: new Date(),
        serialsNOK,
        serialsIncomplets
      });

      const fileId = fileDoc.insertedId;

      // Insert hourly data if available
      if (hourlyData) {
        const hourlyRecords = Object.entries(hourlyData).map(([hour, data]) => ({
          _id: new ObjectId(),
          fileId: fileId,
          hour: parseInt(hour),
          produitsConformes: data.produitsConformes,
          produitsNonConformes: data.produitsNonConformes,
          total: data.total
        }));

        if (hourlyRecords.length > 0) {
          await db.collection('HourlyData').insertMany(hourlyRecords);
        }
      }

      // Format and check bobines
      const formattedBobines = bobinesData.map(b => ({
        numero: b.numero.toString(),
        produit: b.produit,
        conforme: b.conforme,
        nonConforme: b.nonConforme,
        incomplete: b.incomplete,
        reportType: b.reportType,
        defauts: b.defauts,
        hasDefect: b.nonConforme,
        defects: b.defauts.filter(Boolean).length,
        qualityScore: b.nonConforme ? 0.7 : 1.0,
        incompleteness: 0,
        productType: b.produit,
        defectType: b.nonConforme ? 
          b.defauts.find(defaut => defaut) : 
          undefined
      }));
      const hourlyMetricsArray = hourlyData ? 
        Object.entries(hourlyData).map(([hour, data]) => ({
          hour: parseInt(hour),
          produitsConformes: data.produitsConformes,
          produitsNonConformes: data.produitsNonConformes,
          total: data.total
        })) : [];

      const fpsConditionsMet = checkFpsConditions(formattedBobines, hourlyMetricsArray);
      let fpsId;
      
      if (fpsConditionsMet) {
        const fpsDoc = await db.collection('FPS1').insertOne({
          _id: new ObjectId(),
          fileId: fileId,
          operateur: "À remplir",
          defaut: fpsConditionsMet.defaut || "À préciser",
          produit: fpsConditionsMet.produit || "À préciser",
          numeroBobine: fpsConditionsMet.numeroBobine || "À préciser",
          cause: "À déterminer",
          actions: "À définir",
          createdAt: new Date()
        });
        fpsId = fpsDoc.insertedId;
      }

      return NextResponse.json({ 
        success: true, 
        fileId: fileId.toString(),
        fpsCreated: !!fpsConditionsMet,
        fpsId: fpsId?.toString()
      });

    } catch (error) {
      console.error("Error processing Excel file:", error);
      return NextResponse.json(
        { error: "Failed to process Excel file" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function GET(req: Request) {
  let db;
  try {
    const url = new URL(req.url);
    const ligneId = url.searchParams.get('ligneId');
    const date = url.searchParams.get('date');
    
    let whereClause: any = {};
    
    // Filter by ligne if ligneId is provided
    if (ligneId) {
      whereClause.ligneId = new ObjectId(ligneId);
    }
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause.uploadedAt = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    // Connect to MongoDB
    db = await connectToDatabase();
    
    // Fetch files with their related hourly data
    const files = await db.collection('File')
      .aggregate([
        { $match: whereClause },
        {
          $lookup: {
            from: 'HourlyData',
            localField: '_id',
            foreignField: 'fileId',
            as: 'hourlyData'
          }
        },
        {
          $lookup: {
            from: 'FPS1',
            localField: '_id',
            foreignField: 'fileId',
            as: 'fps'
          }
        },
        { $sort: { uploadedAt: -1 } }
      ]).toArray();
    
    return NextResponse.json(files);
    
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' }, 
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
