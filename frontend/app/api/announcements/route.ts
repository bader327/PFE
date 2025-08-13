import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/setupDB";

// Use connection string from .env file
const uri =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/pfe_dashboard";

interface Announcement {
  _id: ObjectId;
  title: string;
  content: string;
  date: Date;
  type: "info" | "warning" | "alert";
}

export async function GET(req: Request) {
  try {
    const db = await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const ligneId = searchParams.get("ligneId");

    // Build filter based on ligneId (only include when provided)
    const filter: any = {};
    if (ligneId) {
      filter.ligneId = ligneId;
    }
    // Debug: log filter once (dev only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Announcements][GET] filter =', filter);
    }

    const announcements = await db
      .collection("Announcement")
      .find<Announcement>(filter)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const client = new MongoClient(uri);
  try {
    const { title, content, type, date, ligneId } = await req.json();

    if (!title || !content || !type || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const formattedDate = new Date(date);

    await client.connect();
    const db = client.db();

    const announcement = {
      _id: new ObjectId(),
      title,
      content,
      type,
      date: formattedDate,
      ligneId: ligneId ?? null,
    };

    await db.collection("Announcement").insertOne(announcement);

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(req: Request) {
  try {
    const db = await connectToDatabase();
    const { id, title, content, type } = await req.json();

    if (!id || !title || !content || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.collection("Announcement").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          type,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const db = await connectToDatabase();

    const result = await db.collection("Announcement").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
