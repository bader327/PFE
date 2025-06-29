import { Db, MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import path from "path";
import { processExcelFile } from "../../../lib/excelParser";

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
  tauxderejets: number;
  productionCible: number;
  uploadedAt: Date;
  hourlyData?: HourlyData[];
  fps?: any[];
}

// Use connection string from .env file
const uri =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/pfe_dashboard";
const dbName = uri.split("/").pop() || "pfe_dashboard";

// Create a new MongoClient instance with options
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Function to handle database connection
export async function connectToDatabase(): Promise<Db> {
  try {
    await client.connect();
    const db = client.db(dbName);
    // Test the connection
    await db.command({ ping: 1 });
    console.log("Successfully connected to MongoDB.");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}

export async function POST(req: Request) {
  let db: Db | undefined;
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const ligneId = formData.get("ligneId") as string;
    const fileDateStr = (formData.get("fileDate") as string) ?? "";
    const fileDate = fileDateStr ? new Date(fileDateStr) : new Date();
    console.log(formData.get("fileDate"), fileDate);
    console.log(ligneId);
    if (!file) {
      return NextResponse.json(
        { error: "Fichier non fourni" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await new Promise((resolve, reject) => {
      const fs = require("fs");
      fs.mkdir(uploadDir, { recursive: true }, (err: any) => {
        if (err) reject(err);
        resolve(null);
      });
    });
    console.log("here before getting file buffer");
    // Save file to disk
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    console.log("after getting bufffer");
    const filepath = path.join(uploadDir, filename);
    try {
      // Process Excel file from buffer
      const {
        bobinesData,
        produitsConformes,
        produitsNonConformes,
        bobinesIncompletes,
        serialsNOK,
        serialsIncomplets,
        alertes,
        ftq,
        tauxDeProduction,
        tauxderejets,
        detectedFpsArr,
      } = await processExcelFile(fileBuffer.buffer);
      // Connect to MongoDB
      db = await connectToDatabase();
      console.log(ftq, tauxDeProduction, "hereee");
      // Insert file record with proper ObjectId handling
      const fileDoc = await db.collection("File").insertOne({
        _id: new ObjectId(),
        path: `/uploads/${filename}`,
        ligneId: ligneId,
        produitsConformes,
        produitsNonConformes,
        bobinesIncompletes,
        ftq,
        tauxProduction: tauxDeProduction,
        uploadedAt: new Date(),
        serialsNOK,
        serialsIncomplets,
        tauxderejets,
        detectedFps: detectedFpsArr,
        fileDate,
      });
      const fileId = fileDoc.insertedId;
      console.log(fileId);
      // Insert hourly data if available

      // Format and check bobines
      const formattedBobines = bobinesData.map((b) => ({
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
        defectType: b.nonConforme
          ? b.defauts.find((defaut) => defaut)
          : undefined,
      }));

      return NextResponse.json({
        success: true,
        fileId: fileId.toString(),
        produitsConformes: produitsConformes,
        produitsNonConformes: produitsNonConformes,
        bobinesIncompletes: bobinesIncompletes,
        ftq,
        tauxProduction: tauxDeProduction,
        tauxRejets: tauxderejets,
        productionCible: bobinesData.length,
        detectedFps: detectedFpsArr,
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
    const ligneId = url.searchParams.get("ligneId");
    const date = url.searchParams.get("date");

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
        $lte: endDate,
      };
    }

    // Connect to MongoDB
    db = await connectToDatabase();

    // Fetch files with their related hourly data
    const files = await db
      .collection("File")
      .aggregate([
        { $match: whereClause },
        {
          $lookup: {
            from: "HourlyData",
            localField: "_id",
            foreignField: "fileId",
            as: "hourlyData",
          },
        },
        {
          $lookup: {
            from: "FPS1",
            localField: "_id",
            foreignField: "fileId",
            as: "fps",
          },
        },
        { $sort: { uploadedAt: -1 } },
      ])
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
