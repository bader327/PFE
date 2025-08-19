import { NextResponse } from "next/server";
import { generateToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
// Removed automatic seeding & password auto-sync writes to avoid requiring replica set during login

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

  // Find the user (read-only, no writes here to keep compatibility without replica set)
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

  // Compare password directly without hashing (as requested)
  const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
  const token = await generateToken(user.id);

    // Create the response
    const response = NextResponse.json(
      { 
        success: true,
        message: "Logged in successfully",
        tokenIssued: true,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

    // Set the JWT token in a cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
  console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
