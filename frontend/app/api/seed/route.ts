// app/api/seed/route.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@admin.com",
      password: hashed,
      userType: "MANAGER",
    },
  });

  return NextResponse.json({ message: "Utilisateur admin créé" });
}
