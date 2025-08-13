import { NextResponse } from "next/server";

// Deprecated legacy route. Use /api/users/[id] (DELETE) instead.
export async function DELETE() {
  return NextResponse.json(
    { success: false, message: "Deprecated. Use /api/users/[id] (DELETE)" },
    { status: 410 }
  );
}
