import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/setupDB";

export async function GET(req: Request) {
  let db;
  try {
    const url = new URL(req.url);
    const ligneId = url.searchParams.get("ligneId") || null;
    let date = url.searchParams.get("date");
    if (!ligneId || !date) {
      return NextResponse.json({
        status: 400,
        message: "Missing required parameters",
      });
    }
    // assume `date` is your incoming string, e.g. the same format as above
    console.log("raw input:", date);

    let whereClause: any = {};

    // filter by ligneId if provided
    if (ligneId) whereClause.ligneId = ligneId;

    // parse the input as your end‑of‑window
    const endDate = new Date(date);
    console.log("endDate (UTC):", endDate.toISOString());

    // compute one hour earlier
    const startDate = new Date(endDate.getTime() - 60 * 60 * 1000);
    console.log("startDate (UTC):", startDate.toISOString());

    // now use those in your Mongo query
    whereClause.fileDate = {
      $gte: startDate,
      $lte: endDate,
    };

    // connect & fetch
    db = await connectToDatabase();
    const files = await db
      .collection("File")
      .find(whereClause)
      .sort({ fileDate: -1 })
      .limit(1)
      .toArray();

    console.log(files);

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
