import { NextResponse } from "next/server";

// Deprecated legacy route. Use /api/users/[id] (PUT) instead.
export async function PUT() {
  return NextResponse.json(
    { success: false, message: "Deprecated. Use /api/users/[id] (PUT)" },
    { status: 410 }
  );
}
