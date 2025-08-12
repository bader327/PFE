import { Db, MongoClient } from "mongodb";

// Use connection string from .env file
const uri =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/pfe_dashboard";
const dbName = uri.split("/").pop() || "pfe_dashboard";

// Create a new MongoClient instance with options
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

let db: Db;

// Function to handle database connection
export async function connectToDatabase(): Promise<Db> {
  try {
    if (!db) {
      await client.connect();
      db = client.db(dbName);
      await db.command({ ping: 1 });
      console.log("Successfully connected to MongoDB.");
    }
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}
