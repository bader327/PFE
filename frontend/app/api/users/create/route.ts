import { NextResponse } from "next/server";

// Deprecated legacy route. Use /api/users (POST) instead.
export async function POST() {
  return NextResponse.json(
    { success: false, message: "Deprecated. Use /api/users (POST)" },
    { status: 410 }
  );
}
