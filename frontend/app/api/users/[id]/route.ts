import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { getAuthUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if the current user is a SUPERADMIN
    const currentUser = await getAuthUser();
    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Only SUPERADMIN can view user details" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
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
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        user
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if the current user is a SUPERADMIN
    const currentUser = await getAuthUser();
    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Only SUPERADMIN can edit users" },
        { status: 403 }
      );
    }

    const body = await request.json();
  const { firstName, lastName, username, email, phone, role, ligneIds, password } = body;

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if the username or email is already taken by another user
    if (username !== existingUser.username || email !== existingUser.email) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username, id: { not: id } },
            { email, id: { not: id } }
          ]
        }
      });

      if (duplicateUser) {
        return NextResponse.json(
          { success: false, message: "Username or email already in use" },
          { status: 400 }
        );
      }
    }

    // Prepare the update data
    const updateData: any = {
      firstName,
      lastName,
      username,
      email,
      phone,
      role: role as Role,
      ligneIds: Array.isArray(ligneIds) ? ligneIds : existingUser.ligneIds || [],
    };

    // Validate ligneIds if provided
    if (Array.isArray(ligneIds) && ligneIds.length > 0) {
      const existingLignes = await prisma.ligne.findMany({
        where: { id: { in: ligneIds } },
        select: { id: true },
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

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "User updated successfully",
        user: updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Check if the current user is a SUPERADMIN
    const currentUser = await getAuthUser();
    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Only SUPERADMIN can delete users" },
        { status: 403 }
      );
    }

    // Prevent deleting the SUPERADMIN account
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToDelete) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

  if (userToDelete.role === 'SUPERADMIN' && userToDelete.email === (process.env.SUPERADMIN_EMAIL || 'admin@coficab.com')) {
      return NextResponse.json(
        { success: false, message: "Cannot delete the primary SUPERADMIN account" },
        { status: 403 }
      );
    }

    // Delete the user
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "User deleted successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
