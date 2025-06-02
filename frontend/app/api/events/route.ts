import { Db, MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Use connection string from .env file
const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/pfe_dashboard";
const dbName = uri.split('/').pop() || 'pfe_dashboard';

// Create a new MongoClient instance
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
    await db.command({ ping: 1 });
    console.log("Successfully connected to MongoDB.");
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

interface Event {
  _id: ObjectId;
  title: string;
  description: string;
  date: string;
  ligneId?: string;
}

export async function GET() {
  let db: Db | undefined;
  try {
    db = await connectToDatabase();
    
    const events = await db.collection('Event')
      .find<Event>({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function POST(req: Request) {
  let db: Db | undefined;
  try {
    const { title, description, date } = await req.json();

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    db = await connectToDatabase();
    
    const event = {
      _id: new ObjectId(),
      title,
      description,
      date,
    };

    await db.collection('Event').insertOne(event);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function PUT(req: Request) {
  let db: Db | undefined;
  try {
    const { id, title, description, date } = await req.json();

    if (!id || !title || !description || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    db = await connectToDatabase();
    
    const result = await db.collection('Event').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          date,
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function DELETE(req: Request) {
  let db: Db | undefined;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    db = await connectToDatabase();
    
    const result = await db.collection('Event').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
