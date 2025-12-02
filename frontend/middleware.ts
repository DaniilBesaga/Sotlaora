import createMiddleware from 'next-intl/middleware';
import { routing } from '../frontend/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Next-Intl instance
const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  // First let Next-Intl handle locale detection/rewrites
  const intlResponse = intlMiddleware(req);

  // If intl already returned something (redirect/rewrites), return it immediately
  if (intlResponse) return intlResponse;

  // ---- AUTH LOGIC ONLY FOR /dashboard ----
  const pathname = req.nextUrl.pathname;

  // locale-aware: /en/dashboard, /ro/dashboard etc.
  const isDashboard = /^\/(en|ro|fr)?\/?cabinet(\/|$)/.test(pathname);

  if (isDashboard) {
    const accessToken = req.cookies.get('accessToken')?.value;
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/auth`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Next-Intl requirement: include all pages except internals
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
