import { Role } from "@prisma/client";
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
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Also return all available lignes so UI has a fallback source
    const allLignes = await prisma.ligne.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(
      { 
        success: true,
        users,
        lignes: allLignes
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

    // Skip ligneIds validation to avoid any MongoDB operations that might trigger transactions
    // We'll just store the ligneIds as provided

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
    // Store password as plain text (as requested)

    // Create user with ligneIds directly - simplified single operation
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        phone: phone || null,
        password: plainPassword,
        role: role as Role,
        ligneIds: Array.isArray(ligneIds) ? ligneIds : [],
      },
    });

    // Fetch ligne names for response (skip if no ligneIds to avoid potential issues)
    let ligneNameMap: Record<string, string> = {};
    if (user.ligneIds.length > 0) {
      try {
        const ls = await prisma.ligne.findMany({
          where: { id: { in: user.ligneIds } },
          select: { id: true, name: true },
        });
        ligneNameMap = Object.fromEntries(ls.map(l => [l.id, l.name]));
      } catch (error) {
        console.warn("Could not fetch ligne names:", error);
        // Continue without ligne names if there's an issue
      }
    }

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
        lignes: Object.entries(ligneNameMap).map(([id, name]) => ({ id, name }))
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
