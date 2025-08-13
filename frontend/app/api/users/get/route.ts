import { NextResponse } from "next/server";

// Deprecated legacy route. Use /api/users/[id] instead.
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Deprecated. Use /api/users/[id]" },
    { status: 410 }
  );
}
