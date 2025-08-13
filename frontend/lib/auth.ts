import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-key-change-in-prod";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  role: Role;
  ligneIds: string[];
};

export async function generateToken(userId: string): Promise<string> {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
      ligneIds: user.ligneIds
    };
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
}

export async function isAuthenticated(
  request: NextRequest
): Promise<{
  authenticated: boolean;
  user: AuthUser | null;
}> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return { authenticated: false, user: null };
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return { authenticated: false, user: null };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { authenticated: false, user: null };
    }

    return {
      authenticated: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone || undefined,
        role: user.role,
        ligneIds: user.ligneIds
      }
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { authenticated: false, user: null };
  }
}
