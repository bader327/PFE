import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const ligneId = searchParams.get("ligneId");

    // Build filter based on ligneId
    const filter: any = {};
    if (ligneId) {
      filter.ligneId = ligneId;
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
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  const client = new MongoClient(uri);
  try {
    const { title, content, type, date } = await req.json();

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
  const client = new MongoClient(uri);
  try {
    const { id, title, content, type } = await req.json();

    if (!id || !title || !content || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db();

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
  } finally {
    await client.close();
  }
}

export async function DELETE(req: Request) {
  const client = new MongoClient(uri);
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await client.connect();
    const db = client.db();

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
  } finally {
    await client.close();
  }
}
