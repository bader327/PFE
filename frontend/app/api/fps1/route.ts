import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { operateur, defaut, produit, numeroBobine, cause, actions } = body;

    console.log("📩 Champs reçus du frontend :", {
      operateur,
      defaut,
      produit,
      numeroBobine,
      cause,
      actions,
    });

    // Validation simple
    if (
      !operateur ||
      !defaut ||
      !produit ||
      !numeroBobine ||
      !cause ||
      !actions
    ) {
      return NextResponse.json(
        { success: false, error: "Champs manquants" },
        { status: 400 }
      );
    }

    // Connect to MongoDB directly
    await client.connect();
    const db = client.db();
    const collection = db.collection("Fps1");

    // Insert the document directly
    const newFps = await collection.insertOne({
      _id: new ObjectId(),
      operateur,
      defaut,
      produit,
      numeroBobine,
      cause,
      actions: JSON.stringify(actions),
      enregistrer: true,
      fpsNiveau1: true,
      fileId: new ObjectId(), // Generate unique fileId to avoid duplicate key error
      createdAt: new Date(),
    });

    console.log("✅ Données insérées :", newFps);

    return NextResponse.json({
      success: true,
      data: {
        id: newFps.insertedId,
        operateur,
        defaut,
        produit,
        numeroBobine,
        cause,
        actions: JSON.stringify(actions),
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur API /api/fps1 :", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
