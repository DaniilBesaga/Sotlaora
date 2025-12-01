import createMiddleware from 'next-intl/middleware';
import {routing} from '../frontend/i18n/routing';
import { NextRequest } from 'next/server';
 
const intlMiddleware = createMiddleware(routing)
 
export async function middleware (req: NextRequest){
  
  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};