import { Role } from "@prisma/client"; // Role enum only
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, username, email, password, role } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with NORMAL_USER role by default
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: role || Role.NORMAL_USER,
        ligneIds: [],
      },
    });

    // Generate JWT token
    const token = await generateToken(user.id);

    // Create the response
    const response = NextResponse.json(
      { 
        success: true,
        message: "User registered successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
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
    console.error("Sign up error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
