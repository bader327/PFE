import { Db, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import path from "path";
import { processExcelFile } from "../../../lib/excelParser";
import { connectToDatabase } from "../../../lib/setupDB";

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

// Types to represent the two possible shapes coming from processExcelFile
type LigneMetrics = {
  produitsConformes: number;
  produitsNonConformes: number;
  bobinesIncompletes: number;
  serialsNOK: number[];
  serialsIncomplets: number[];
  alertes: string[];
  ftq: number;
  tauxDeProduction: number;
  tauxderejets: number;
  productionCible: number;
  detectedFpsArr: any[];
};

type SingleLineResult = LigneMetrics & { bobinesData: any[] };
type MultiLineResult = { bobinesData: any[] } & Record<string, LigneMetrics | undefined>;

function isSingleLineResult(x: any): x is SingleLineResult {
  return x && typeof x.produitsConformes === "number" && Array.isArray(x.bobinesData);
}

function mapFileResult(fileResult: { bobinesData: any; produitsConformes: any; produitsNonConformes: any; bobinesIncompletes: any; serialsNOK: any; serialsIncomplets: any; alertes: any; ftq: any; tauxDeProduction: any; tauxderejets: any; detectedFpsArr: any; }) {
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
  } = fileResult;
  return {
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
  };
}

export async function POST(req: Request) {
  let db: Db | undefined;
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const ligneId = formData.get("ligneId") as string;
    const fileDateStr = (formData.get("fileDate") as string) ?? "";
    const fileDate = fileDateStr ? new Date(fileDateStr) : new Date();
    console.log(fileDate, fileDateStr);
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
    // Save file to disk
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    try {
      // Process Excel file from buffer
  const fileResult: unknown = await processExcelFile(fileBuffer.buffer);
      // Connect to MongoDB
      db = await connectToDatabase();
      let resultToSave: any = {
        _id: new ObjectId(),
        path: `/uploads/${filename}`,
        ligneId,
        uploadedAt: new Date(),
        fileDate,
      };
      let bobinesData: any[] = (fileResult as any).bobinesData ?? [];
      if (ligneId) {
        console.log("heere inside ligne");
        const {
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
        } = (fileResult as SingleLineResult);
        console.log(
          produitsConformes,
          produitsNonConformes,
          ftq,
          tauxDeProduction,
          tauxderejets
        );
        resultToSave = {
          ...resultToSave,
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
        };
      } else {
        for (let i = 1; i <= 6; ++i) {
          let ligneId = `ligne_${i}`;
          console.log(ligneId);
          console.log(ligneId in (fileResult as Record<string, unknown>), "heree ");
          if ((fileResult as MultiLineResult)[ligneId]) {
            const {
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
            } = (fileResult as MultiLineResult)[ligneId]!;
            resultToSave = {
              ...resultToSave,
              [ligneId]: {
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
                bobinesData: [],
                fileDate,
              },
            };
          } else {
            resultToSave = {
              ...resultToSave,
              [ligneId]: {
                produitsConformes: 0,
                produitsNonConformes: 0,
                bobinesIncompletes: 0,
                ftq: 0,
                tauxProduction: 0,
                uploadedAt: new Date(),
                serialsNOK: 0,
                serialsIncomplets: 0,
                tauxderejets: 0,
                detectedFps: [],
                bobinesData: [],
                fileDate,
              },
            };
          }
        }
      }
      // Insert file record with proper ObjectId handling
      const fileDoc = await db.collection("File").insertOne(resultToSave);
      const fileId = fileDoc.insertedId;
      // Insert hourly data if available
      if (ligneId) {
        console.log("returning ", resultToSave);
        console.log(resultToSave);
        return NextResponse.json({
          success: true,
          fileId: fileId.toString(),
          produitsConformes: resultToSave.produitsConformes,
          produitsNonConformes: resultToSave.produitsNonConformes,
          bobinesIncompletes: resultToSave.bobinesIncompletes,
          ftq: resultToSave.ftq,
          tauxProduction: resultToSave.tauxProduction,
          tauxRejets: resultToSave.tauxderejets,
          productionCible: bobinesData.length,
          detectedFps: resultToSave.detectedFps,
        });
      } else {
        let response: any = { fileId: fileId.toString(), success: true };
        console.log(resultToSave);
        console.log("response ", response);
        for (let i = 1; i <= 6; ++i) {
          const ligneId = `ligne_${i}`;

          if (ligneId in resultToSave) {
            let result = resultToSave[`${ligneId}`];
            response[`${ligneId}`] = {
              produitsConformes: result.produitsConformes,
              produitsNonConformes: result.produitsNonConformes,
              bobinesIncompletes: result.bobinesIncompletes,
              ftq: result.ftq,
              tauxProduction: result.tauxProduction,
              tauxRejets: result.tauxderejets,
              productionCible: result.bobinesData.length,
              detectedFps: result.detectedFps,
            };
          }
        }
        return NextResponse.json(response);
      }
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
  }
}

export async function GET(req: Request) {
  let db;
  try {
    const url = new URL(req.url);
    const ligneId = url.searchParams.get("ligneId") || null;
    const date = url.searchParams.get("date");

    let whereClause: any = {};

    // Filter by ligne if ligneId is provided
    whereClause.ligneId = ligneId;
    let limit = 0;
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 1);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      console.log(endDate);

      whereClause.fileDate = {
        $gte: startDate,
        $lte: endDate,
      };
    } else {
      limit = 1;
    }
    console.log(whereClause, limit, date);

    // Connect to MongoDB
    db = await connectToDatabase();

    // Fetch files with their related hourly data
    const files = await db
      .collection("File")
      .find(whereClause)
      .sort({ fileDate: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
