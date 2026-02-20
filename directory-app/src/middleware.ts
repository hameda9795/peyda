import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
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

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Check for session cookie
  const sessionToken = request.cookies.get('session_token')

  // If no session and trying to access protected route, redirect to login
  if (!sessionToken && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/?login=true', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If has session and trying to access auth routes (like registration)
  if (sessionToken && pathname === '/bedrijf-aanmelden') {
    // Check if there's a message parameter (like 'no-business')
    const message = searchParams.get('message')
    
    // Allow access if message=no-business (user needs to register)
    if (message === 'no-business') {
      return NextResponse.next()
    }
    
    // Otherwise redirect to dashboard (user already has business)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bedrijf-aanmelden',
  ],
}
