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

interface Announcement {
  _id: ObjectId;
  title: string;
  content: string;
  date: Date;
  type: 'info' | 'warning' | 'alert';
}

export async function GET() {
  let db: Db | undefined;
  try {
    db = await connectToDatabase();
    
    const announcements = await db.collection('Announcement')
      .find<Announcement>({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
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
    const { title, content, type } = await req.json();

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    db = await connectToDatabase();
    
    const announcement = {
      _id: new ObjectId(),
      title,
      content,
      type,
      date: new Date()
    };

    await db.collection('Announcement').insertOne(announcement);

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
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
    const { id, title, content, type } = await req.json();

    if (!id || !title || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    db = await connectToDatabase();
    
    const result = await db.collection('Announcement').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          type,
          date: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement' },
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
    
    const result = await db.collection('Announcement').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
