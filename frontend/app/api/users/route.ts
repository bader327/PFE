import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
// Using relative path (depth 3 -> frontend root) to avoid alias resolution issues
import { getAuthUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { generatePassword, sendWelcomeEmail } from "../../../lib/utils";

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    // Check if the current user is a SUPERADMIN
    const currentUser = await getAuthUser();
    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Only SUPERADMIN can list users" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        ligneIds: true,
        createdAt: true,
        updatedAt: true,
        lignes: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(
      { 
        success: true,
        users
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error listing users:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getAuthUser();
    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Only SUPERADMIN can create users" },
        { status: 403 }
      );
    }

    const body = await request.json();
    let { firstName, lastName, username, email, phone, role, ligneIds } = body;

    if (!firstName || !lastName || !username || !email || !role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic normalization
    email = String(email).trim().toLowerCase();
    username = String(username).trim();
    firstName = String(firstName).trim();
    lastName = String(lastName).trim();
    if (phone) phone = String(phone).trim();

    // Optional: validate ligneIds exist if provided
    if (Array.isArray(ligneIds) && ligneIds.length > 0) {
      const existingLignes = await prisma.ligne.findMany({
        where: { id: { in: ligneIds } },
        select: { id: true }
      });
      const existingIds = new Set(existingLignes.map(l => l.id));
      const invalid = ligneIds.filter((lid: string) => !existingIds.has(lid));
      if (invalid.length > 0) {
        return NextResponse.json(
          { success: false, message: `Invalid ligneIds: ${invalid.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: role as Role,
        ligneIds: Array.isArray(ligneIds) ? ligneIds : [],
      },
    });

    await sendWelcomeEmail(email, firstName, plainPassword);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ligneIds: user.ligneIds,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
