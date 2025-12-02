import createMiddleware from 'next-intl/middleware';
import {routing} from '../frontend/i18n/routing';
import { NextRequest } from 'next/server';
 
const intlMiddleware = createMiddleware(routing)
 
export async function middleware (req: NextRequest){

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if(!accessToken && !refreshToken){
      return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextReponse.next()
  
  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

// export const config = {
//     matcher: ["/dashboard"],
// }