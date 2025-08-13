// Use relative import due depth (4 levels to project root 'frontend')
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { generatePassword, sendPasswordResetEmail } from "../../../../lib/utils";

export async function POST(request: NextRequest) {
  try {
  const currentUser = await getAuthUser();

    // Only SUPERADMIN can reset passwords
    if (!currentUser || currentUser.role !== "SUPERADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate new random password
    const newPassword = generatePassword();
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.firstName, newPassword);

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
