import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/seo',
  '/dashboard/analytics',
]

// Routes that should redirect to login
const authRoutes = [
  '/bedrijf-aanmelden',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for session cookie
  const sessionToken = request.cookies.get('session_token')

  // If no session and trying to access protected route, redirect to login
  if (!sessionToken && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/?login=true', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If has session and trying to access auth routes (like registration), redirect to dashboard
  if (sessionToken && pathname === '/bedrijf-aanmelden') {
    // Allow access if no query parameter (user might want to add another business)
    // But if they have a business, they should go to dashboard
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bedrijf-aanmelden',
  ],
}
