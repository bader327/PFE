// Deprecated legacy route: delegate to /api/auth/login for backward compatibility
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Use /api/auth/login instead of /api/auth/signin" },
    { status: 410 }
  );
}
