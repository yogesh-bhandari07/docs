import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (
    !token &&
    !["/admin/login", "/admin/register"].includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard",
    "/admin/project",
    "/admin/login",
    "/admin/register",
  ],
};
