// Relative import (depth 4) to avoid alias issue
import { NextRequest, NextResponse } from "next/server";
import { seedSuperAdmin } from "../../../../lib/seed-admin";

export async function GET(request: NextRequest) {
  try {
    // Check if request is from localhost for security
    const host = request.headers.get('host') || '';
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
      return NextResponse.json(
        { success: false, message: "This endpoint can only be called from localhost" },
        { status: 403 }
      );
    }

    // Create the superadmin user
    const superAdmin = await seedSuperAdmin();
    
    if (!superAdmin) {
      return NextResponse.json(
        { success: true, message: "SuperAdmin already exists, no action taken" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "SuperAdmin ensured/created successfully.",
      email: superAdmin.email,
      username: superAdmin.username,
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,
      role: superAdmin.role,
    });
  } catch (error) {
    console.error("Error seeding superadmin:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
