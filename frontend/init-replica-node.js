const { MongoClient } = require("mongodb");

async function initializeReplicaSet() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const admin = client.db().admin();

    // Initialize replica set
    const config = {
      _id: "rs0",
      version: 1,
      members: [
        {
          _id: 0,
          host: "localhost:27017",
          priority: 1,
        },
      ],
    };

    try {
      const result = await admin.command({ replSetInitiate: config });
      console.log("Replica set initialized:", result);
    } catch (error) {
      if (error.message.includes("already initialized")) {
        console.log("Replica set already initialized");

        // Check status
        const status = await admin.command({ replSetGetStatus: 1 });
        console.log("Replica set status:", status);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

initializeReplicaSet();
