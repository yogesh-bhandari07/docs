import { NextRequest, NextResponse } from "next/server";
import { subDomainMiddleware } from "./middleware/subDomainMiddleware";
import { AuthMiddleware } from "./middleware/AuthMiddleware";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const mainDomain: string =
    process.env.NEXT_PUBLIC_HOST_DOMAIN || "example.com";
  const parts = host.split(".");

  if (parts.length > 2 && host.endsWith(mainDomain)) {
    return subDomainMiddleware(req);
  } else {
    return AuthMiddleware(req);
  }
}

// Apply middleware to all routes
export const config = {
  matcher: "/:path*",
};
