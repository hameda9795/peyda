import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication (user dashboard)
const protectedRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/seo',
  '/dashboard/analytics',
]

// Routes that should redirect authenticated users
const authRoutes = [
  '/bedrijf-aanmelden',
]

const ADMIN_COOKIE = 'admin_session';
// Value is read from env at request time so it is never in source code
const ADMIN_COOKIE_VALUE = process.env.ADMIN_SESSION_VALUE ?? '';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // ── Admin auth ──────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get(ADMIN_COOKIE);
    const isAuthenticated = adminSession?.value === ADMIN_COOKIE_VALUE;

    // Allow login page and API route through without auth
    if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
      // If already logged in, redirect to admin dashboard
      if (isAuthenticated && pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      const response = NextResponse.next();
      response.headers.set('x-pathname', pathname);
      return response;
    }

    // Protect all other /admin/* routes
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Pass pathname header for layout use
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // ── User dashboard auth ─────────────────────────────────────────
  const sessionToken = request.cookies.get('session_token')

  if (!sessionToken && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/?login=true', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (sessionToken && pathname === '/bedrijf-aanmelden') {
    const message = searchParams.get('message')
    if (message === 'no-business') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/bedrijf-aanmelden',
  ],
}
