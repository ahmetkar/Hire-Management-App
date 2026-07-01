import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/application",
];

const authRoutes = [
  "/login",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("access_token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", req.url);

    loginUrl.searchParams.set("returnUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/application", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/application/:path*",
    "/login",
  ],
};