import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "default-jwt-secret-key-change-in-prod";

// Edge-safe JWT HS256 verification (no jsonwebtoken / Node 'crypto')
async function verifyJwtHS256(token: string, secret: string): Promise<{ userId?: string; exp?: number } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const b64urlToUint8 = (b64url: string) => {
      const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
      const b64 = (b64url.replace(/-/g, '+').replace(/_/g, '/')) + pad;
      const raw = atob(b64);
      const arr = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
      return arr;
    };

    const textEncoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      textEncoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, data));
    const toB64Url = (buf: Uint8Array) => {
      let str = '';
      for (let i = 0; i < buf.length; i++) str += String.fromCharCode(buf[i]);
      return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };
    const expected = toB64Url(signature);
    if (expected !== sigB64) return null;

    const payloadJson = new TextDecoder().decode(b64urlToUint8(payloadB64));
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/niveauligne',
  '/niveau1',
  '/niveau2',
  '/FPS',
  '/admin',
  '/users',
];

// Routes that require specific roles
const roleBasedRoutes = {
  '/admin': ['SUPERADMIN'],
  '/users': ['SUPERADMIN'],
  '/ligne/1': ['SUPERADMIN', 'QUALITICIEN'],
  '/ligne/2': ['SUPERADMIN', 'QUALITICIEN'],
  '/ligne/3': ['SUPERADMIN', 'QUALITICIEN'],
  '/ligne/4': ['SUPERADMIN', 'QUALITICIEN'],
  '/ligne/5': ['SUPERADMIN', 'QUALITICIEN'],
  '/ligne/6': ['SUPERADMIN', 'QUALITICIEN'],
  '/ligne/7': ['SUPERADMIN', 'QUALITICIEN'],
  '/niveauligne': ['SUPERADMIN', 'QUALITICIEN'],
  '/niveau1': ['SUPERADMIN', 'QUALITICIEN', 'CHEF_ATELIER', 'NORMAL_USER'],
  '/niveau2': ['SUPERADMIN', 'QUALITICIEN', 'CHEF_ATELIER', 'NORMAL_USER'],
  '/FPS': ['SUPERADMIN', 'QUALITICIEN', 'CHEF_ATELIER', 'NORMAL_USER'],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // DEBUG: trace auth flow
  const dbg = (msg: string, extra?: any) => {
    try { console.log('[MW]', msg, extra || ''); } catch {}
  };

  // Allow access to login and public pages
  if (pathname === '/login' || pathname === '/' || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // Get the token from the cookies
    const token = request.cookies.get('token')?.value;
    dbg('Protected route', { pathname, hasToken: !!token });

    if (!token) {
      // Redirect to login if no token is found
      dbg('No token redirect');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the token using edge-safe verifier
      const decoded: any = await verifyJwtHS256(token, JWT_SECRET);
      if (!decoded || !decoded.userId) {
        dbg('Decoded invalid');
        return NextResponse.redirect(new URL('/login', request.url));
      }
      dbg('Token verified', { userId: decoded.userId });
      
      // Add user to the request for downstream middleware and API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);

      // Check role-based access
      for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
        if (pathname === route || pathname.startsWith(`${route}/`)) {
          // For now, we don't verify roles in the middleware because we would need
          // to fetch the user from the database. Instead, we'll do it in the API routes
          // and the page components.
          break;
        }
      }

      // Continue with the request
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token
  dbg('Token invalid', (error as any)?.message);
  return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For API routes, we don't redirect but let the API handlers check authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // For all other routes, just continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
