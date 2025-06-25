import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define paths that are considered public (no auth required)
  const publicPaths = ['/login', '/signup', '/', '/accept-invitation'];
  const isPublicPath = publicPaths.some(publicPath => path === publicPath || path.startsWith('/api/'));

  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value;

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the path is login or signup and there's a token, redirect to dashboard
  if ((path === '/login' || path === '/signup') && token) {
    return NextResponse.redirect(new URL('/worktally/dashboard', request.url));
  }

  return NextResponse.next();
}

// Match all paths except for static files and api routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/|api/).*)'],
};