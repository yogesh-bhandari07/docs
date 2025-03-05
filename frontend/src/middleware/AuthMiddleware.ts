import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function AuthMiddleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Exclude Next.js static files, API routes, and other public assets
  const ignoredPaths = [
    "/_next/", // Next.js assets (CSS, JS, images)
    "/favicon.ico",
    "/public/", // Public folder assets
  ];

  // Skip authentication for ignored paths
  if (ignoredPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (
    token == undefined &&
    !["/admin/login", "/admin/register"].includes(pathname)
  ) {
    console.log(
      "Redirecting to login page",
      request.nextUrl.origin + "/admin/login"
    );
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}
