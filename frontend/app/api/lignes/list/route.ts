import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const lignes = await prisma.ligne.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, lignes }, { status: 200 });
  } catch (e) {
    console.error('Error listing lignes (list route):', e);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
