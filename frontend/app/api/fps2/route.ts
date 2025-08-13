import { normalizeRole } from "@/lib/roleUtils";
import { auth, currentUser } from "@clerk/nextjs/server";
import mongoose, { Schema, model, models } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// ─── Connexion MongoDB ──────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("⛔  MONGODB_URI manquant dans .env.local");

let mongo: typeof mongoose;
if (mongoose.connection.readyState === 0) {
  mongo = await mongoose.connect(MONGODB_URI);
} else {
  mongo = mongoose;
}

// ─── Schéma FpsRecord ──────────────────────────────────────────────────────────
const FpsRecordSchema = new Schema(
  {
    fpsId: { type: String, required: true },
    level: { type: Number, required: true },
    chefProd: String,
    chefQualite: String,
    probleme: String,
    numeroBobine: String,
    cause1Apparente: String,
    causeCause1: String,
    causeCause2: String,
    causeCause3: String,
    causeCause4: String,
    action: String,
    commentaire: String,
    respQualiteProcess: String,
    respProduction: String,
  },
  { timestamps: true }
);

const FpsRecord = models.FpsRecord || model("FpsRecord", FpsRecordSchema);

// ─── Handlers ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fpsId = searchParams.get("id");
  const level = Number(searchParams.get("level"));

  if (!fpsId || !level)
    return NextResponse.json(
      { error: "Paramètres id et level requis" },
      { status: 400 }
    );

  const records = await FpsRecord.find({ fpsId, level });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await currentUser();
  const role = normalizeRole((user?.publicMetadata as any)?.userType || (user?.unsafeMetadata as any)?.userType);
  if (role !== "SUPERADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const created = await FpsRecord.create(body);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await currentUser();
  const role = normalizeRole((user?.publicMetadata as any)?.userType || (user?.unsafeMetadata as any)?.userType);
  if (role !== "SUPERADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body._id)
    return NextResponse.json({ error: "_id manquant" }, { status: 400 });

  const updated = await FpsRecord.findByIdAndUpdate(body._id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

// (Optionnel) évite le cache de vercel
export const dynamic = "force-dynamic";
