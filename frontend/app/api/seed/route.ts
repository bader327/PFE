// app/api/seed/route.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if SUPERADMIN already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: process.env.SUPERADMIN_EMAIL || "admin@coficab.com",
      },
    });

    if (existingAdmin) {
      return NextResponse.json({ success: true, message: "SUPERADMIN user already exists" });
    }

    // Create SUPERADMIN user
    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD || "admin123",
      10
    );

    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "COFICAB",
        username: "admin",
        email: process.env.SUPERADMIN_EMAIL || "admin@coficab.com",
        password: hashedPassword,
        role: Role.SUPERADMIN,
        ligneIds: [],
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "SUPERADMIN user created successfully",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { success: false, message: "Error seeding database" },
      { status: 500 }
    );
  }
}
