import { NextResponse, type NextRequest } from 'next/server';

// The HttpOnly cookie set by /api/admin-login on successful authentication.
const ADMIN_COOKIE = 'admin_token';
const ADMIN_COOKIE_VALUE = 'authenticated';

const LOGIN_PATH = '/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated =
    request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;

  // Already logged in and hitting the login page → go straight to the panel.
  if (pathname === LOGIN_PATH && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Not authenticated on any other /admin route → send them to the login page.
  if (!isAuthenticated && pathname !== LOGIN_PATH) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    // Remember where they were headed so we can send them back after login.
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated, or on the login page itself → allow through.
  return NextResponse.next();
}

// Runs only for /admin routes. The /api/admin-login endpoint is not matched,
// so it never gets redirected or blocked.
export const config = {
  matcher: ['/admin/:path*'],
};
