import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/setupDB";

export async function GET(req: Request) {
  let db;
  try {
    const url = new URL(req.url);
    const ligneId = url.searchParams.get("ligneId") || null;
    let date = url.searchParams.get("date");
    if (!date) {
      return NextResponse.json({ status: 400, message: "Invalid date" });
    }
    date += " 00:00:00 GMT+0000";
    const inputDate = date ? new Date(date) : new Date();
    console.log(date);
    const startDate = new Date(
      Date.UTC(
        inputDate.getUTCFullYear(),
        inputDate.getUTCMonth(),
        inputDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endDate = new Date(startDate);
    endDate.setUTCHours(23, 59, 59, 999);
    console.log(startDate, endDate);
    let whereClause: any = {
      fileDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    // Filter by ligne if ligneId is provided
    whereClause.ligneId = ligneId;

    // Connect to MongoDB
    db = await connectToDatabase();

    // Fetch files with their related hourly data
    const files = await db
      .collection("File")
      .find(whereClause)
      .sort({ fileDate: -1 })
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
