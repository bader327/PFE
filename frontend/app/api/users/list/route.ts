import { NextResponse } from "next/server";

// Deprecated legacy route. Use /api/users (GET) instead.
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Deprecated. Use /api/users (GET)" },
    { status: 410 }
  );
}
