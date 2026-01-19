import { NextRequest, NextResponse } from 'next/server';

import { CLIENT_ROUTES } from './utils/client-rotes';
import { adminAuth } from './lib/firebase-admin';

const PUBLIC_ROUTES = [
  CLIENT_ROUTES.LOGIN,
  CLIENT_ROUTES.SIGNUP,
  CLIENT_ROUTES.VERIFY_EMAIL,
  CLIENT_ROUTES.EMAIL_VERIFIED,
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const session = req.cookies.get('session')?.value;

  if (!session) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(CLIENT_ROUTES.LOGIN, req.url));
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);

    if (!decoded.email_verified) {
      if (
        pathname === CLIENT_ROUTES.EMAIL_VERIFIED ||
        pathname === CLIENT_ROUTES.VERIFY_EMAIL
      ) {
        return NextResponse.next();
      }

      if (pathname !== CLIENT_ROUTES.VERIFY_EMAIL) {
        return NextResponse.redirect(
          new URL(CLIENT_ROUTES.VERIFY_EMAIL, req.url),
        );
      }
      return NextResponse.next();
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL(CLIENT_ROUTES.HOME, req.url));
    }

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL(CLIENT_ROUTES.LOGIN, req.url));
    res.cookies.delete('session');
    return res;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
