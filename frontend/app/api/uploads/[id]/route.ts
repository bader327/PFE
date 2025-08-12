import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/setupDB";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  let db;
  try {
    const { id } = params;
    if (!id || typeof id !== "string")
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    let whereClause: any = { _id: new ObjectId(id) };

    // Connect to MongoDB
    db = await connectToDatabase();

    // Fetch files with their related hourly data
    const files = await db
      .collection("File")
      .find(whereClause)
      .limit(1)
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
