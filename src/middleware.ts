import { is } from 'date-fns/locale';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authKey } from './constant/authKey';

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forget-password',
  '/about',
  '/contact',
  '/',
  '/home'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublic = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );


  const accessToken = request.cookies.get(authKey)?.value;

  if (isPublic) {
    // Optional: Redirect to dashboard if already logged in and trying to access login
    if (accessToken && pathname.startsWith('/auth/')) {
       // We might want to decode token to know where to go, but for now let's just let them proceed 
       // or redirect to a default. Let's keep it simple and allow access or maybe redirect to home?
       // Let's just allow for now to avoid loops if token is invalid.
    }
    return NextResponse.next();
  }

  // If no token and trying to access protected route, redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    // loginUrl.searchParams.set('callbackUrl', pathname); // Optional: add callback URL
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, allow access. 
  // Fine-grained role checks are handled in the layout/components.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/assets that might be in public
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
