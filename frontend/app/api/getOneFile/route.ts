// /app/api/getOneFile/route.ts
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../uploads/route";

export async function GET(req: Request) {
  let db;

  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const ligneId = url.searchParams.get("ligneId");

    const date = dateParam ? new Date(dateParam) : new Date();
    date.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const whereClause: any = {
      fileDate: {
        $gte: date,
        $lte: endDate,
      },
    };

    if (ligneId) {
      whereClause.ligneId = new ObjectId(ligneId);
    }

    db = await connectToDatabase();

    const file = await db
      .collection("File")
      .aggregate([
        { $match: whereClause },
        // {
        //   $lookup: {
        //     from: "HourlyData",
        //     localField: "_id",
        //     foreignField: "fileId",
        //     as: "hourlyData",
        //   },
        // },
        // {
        //   $lookup: {
        //     from: "FPS1",
        //     localField: "_id",
        //     foreignField: "fileId",
        //     as: "fps",
        //   },
        // },
        { $sort: { uploadedAt: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    if (file.length === 0) {
      return NextResponse.json(
        { message: "No file found for the specified date." },
        { status: 404 }
      );
    }

    return NextResponse.json(file[0]); // Return single object
  } catch (error) {
    console.error("Error fetching single file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
