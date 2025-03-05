import { NextRequest, NextResponse } from "next/server";
import subDomainMiddleware from "@/middleware/subDomainMiddleware";
import AuthMiddleware from "@/middleware/AuthMiddleware";
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const mainDomain: string = process.env.NEXT_PUBLIC_HOST || "example.com";
  const parts = host.split(".");
  console.log("subdomain", mainDomain, parts);
  if (parts.length == 2) {
    return subDomainMiddleware(req);
  } else {
    return AuthMiddleware(req);
  }
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!_next).*)"],
};
