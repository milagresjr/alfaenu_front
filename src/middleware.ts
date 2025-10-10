// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('token')?.value;

//   const isAuthPage = req.nextUrl.pathname === '/signin';
//   const isProtectedRoute = !isAuthPage;

//   if (!token && isProtectedRoute) {
//     return NextResponse.redirect(new URL('/signin', req.url));
//   }

//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/:path*'],
// };
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Páginas públicas (sem necessidade de login)
  const publicPaths = ["/signin"];
  const isPublicRoute = publicPaths.includes(pathname) || pathname.startsWith("/api");

  // Ignorar rotas estáticas (Next.js e assets)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Se não tiver token e a rota não for pública → redireciona
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/signin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Ignora APIs, arquivos estáticos e imagens
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
