import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/setupDB";

interface Event {
  _id: ObjectId;
  title: string;
  description: string;
  date: string;
  ligneId?: string;
}

export async function GET(req: Request) {
  try {
    const db = await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const ligneId = searchParams.get("ligneId");

    // Build filter based on ligneId
  const filter: any = ligneId ? { ligneId } : {};

    const events = await db
      .collection("Event")
      .find<Event>(filter)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, date } = await req.json();

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

  const db = await connectToDatabase();

    const event = {
      _id: new ObjectId(),
      title,
      description,
      date,
    };

    await db.collection("Event").insertOne(event);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, date } = await req.json();

    if (!id || !title || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

  const db = await connectToDatabase();

    const result = await db.collection("Event").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          date,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
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

    const result = await db.collection("Event").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
