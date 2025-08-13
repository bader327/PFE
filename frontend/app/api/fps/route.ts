import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const level = url.searchParams.get('level') || '1'; // Default to level 1
  
  try {
    if (id) {
      // Get specific FPS by ID
      if (level === '1') {
        const fps = await prisma.fps1.findUnique({
          where: { id },
          include: {
            file: true,
            fps2: {
              include: { fps3: true }
            }
          }
        });
        
        if (!fps) {
          return NextResponse.json({ error: 'FPS non trouvé' }, { status: 404 });
        }
        
        return NextResponse.json(fps);
      } else if (level === '2') {
        const fps = await prisma.fps2.findUnique({
          where: { id },
          include: {
            fps1: {
              include: { file: true }
            },
            fps3: true
          }
        });
        
        if (!fps) {
          return NextResponse.json({ error: 'FPS non trouvé' }, { status: 404 });
        }
        
        return NextResponse.json(fps);
      } else if (level === '3') {
        const fps = await prisma.fps3.findUnique({
          where: { id },
          include: {
            fps2: {
              include: {
                fps1: {
                  include: { file: true }
                }
              }
            }
          }
        });
        
        if (!fps) {
          return NextResponse.json({ error: 'FPS non trouvé' }, { status: 404 });
        }
        
        return NextResponse.json(fps);
      }
    } else {
      // Get all FPS of a specific level
      if (level === '1') {
        const fps = await prisma.fps1.findMany({
          include: {
            file: true,
            fps2: {
              include: { fps3: true }
            }
          },
          orderBy: {
            file: {
              uploadedAt: 'desc'
            }
          }
        });
        
        return NextResponse.json(fps);
      } else if (level === '2') {
        const fps = await prisma.fps2.findMany({
          include: {
            fps1: {
              include: { file: true }
            },
            fps3: true
          },
          orderBy: {
            fps1: {
              file: {
                uploadedAt: 'desc'
              }
            }
          }
        });
        
        return NextResponse.json(fps);
      } else if (level === '3') {
        const fps = await prisma.fps3.findMany({
          include: {
            fps2: {
              include: {
                fps1: {
                  include: { file: true }
                }
              }
            }
          },
          orderBy: {
            fps2: {
              fps1: {
                file: {
                  uploadedAt: 'desc'
                }
              }
            }
          }
        });
        
        return NextResponse.json(fps);
      }
    }
    
    return NextResponse.json({ error: 'Niveau FPS invalide' }, { status: 400 });
  } catch (error) {
    console.error('Erreur lors de la récupération des FPS:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des FPS' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
  const role = user.role;
  if (role !== 'CHEF_ATELIER' && role !== 'SUPERADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const { level, ...data } = body;
    
    if (level === '1') {
      const fps = await prisma.fps1.create({
        data: data,
        include: { file: true }
      });
      
      return NextResponse.json(fps);
    } else if (level === '2') {
      const fps = await prisma.fps2.create({
        data: data,
        include: {
          fps1: {
            include: { file: true }
          }
        }
      });
      
      return NextResponse.json(fps);
    } else if (level === '3') {
      const fps = await prisma.fps3.create({
        data: data,
        include: {
          fps2: {
            include: {
              fps1: {
                include: { file: true }
              }
            }
          }
        }
      });
      
      return NextResponse.json(fps);
    }
    
    return NextResponse.json({ error: 'Niveau FPS invalide' }, { status: 400 });
  } catch (error) {
    console.error('Erreur lors de la création du FPS:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du FPS' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
  const role = user.role;
  if (role !== 'CHEF_ATELIER' && role !== 'SUPERADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const { id, level, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }
    
    if (level === '1') {
      const fps = await prisma.fps1.update({
        where: { id },
        data: data,
        include: {
          file: true,
          fps2: {
            include: { fps3: true }
          }
        }
      });
      
      return NextResponse.json(fps);
    } else if (level === '2') {
      const fps = await prisma.fps2.update({
        where: { id },
        data: data,
        include: {
          fps1: {
            include: { file: true }
          },
          fps3: true
        }
      });
      
      return NextResponse.json(fps);
    } else if (level === '3') {
      const fps = await prisma.fps3.update({
        where: { id },
        data: data,
        include: {
          fps2: {
            include: {
              fps1: {
                include: { file: true }
              }
            }
          }
        }
      });
      
      return NextResponse.json(fps);
    }
    
    return NextResponse.json({ error: 'Niveau FPS invalide' }, { status: 400 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du FPS:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du FPS' }, { status: 500 });
  }
}
