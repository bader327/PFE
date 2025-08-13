import { Db, MongoClient } from "mongodb";

const uri =
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/pfe_dashboard";

function extractDbName(connectionString: string): string {
  const afterSlash = connectionString.substring(
    connectionString.lastIndexOf("/") + 1
  );
  return afterSlash.split("?")[0] || "pfe_dashboard";
}

const dbName = extractDbName(uri);

// @ts-ignore
let globalWithMongo = global as typeof global & { _mongoClient?: MongoClient; _mongoDb?: Db };

const client: MongoClient = globalWithMongo._mongoClient || new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
if (!globalWithMongo._mongoClient) {
  globalWithMongo._mongoClient = client;
}

let db: Db | undefined = globalWithMongo._mongoDb;

export async function connectToDatabase(): Promise<Db> {
  try {
    if (!db) {
      await client.connect();
      db = client.db(dbName);
      await db.command({ ping: 1 });
      globalWithMongo._mongoDb = db;
      console.log(`MongoDB connected (db: ${dbName})`);
    }
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}
