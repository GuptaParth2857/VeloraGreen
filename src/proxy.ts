import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/api/auth/login', '/api/auth/register', '/api/auth/logout', '/calculator', '/api/calculations'];
const authApiPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/me', '/api/auth/logout'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('ecotrace-session')?.value;

  // Allow auth API routes and public pages
  if (authApiPaths.some(p => pathname.startsWith(p)) || publicPaths.some(p => pathname === p)) {
    return NextResponse.next();
  }

  // Protect API routes
  if (pathname.startsWith('/api/') && !sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Protect dashboard and leaderboard
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/leaderboard')) && !sessionCookie) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('login', 'required');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|data/).*)'],
};
