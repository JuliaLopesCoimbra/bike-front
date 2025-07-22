import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Aplica o middleware apenas nessas rotas
export const config = {
  matcher: ['/app/pages/user/session'], // proteja rotas aqui
};
