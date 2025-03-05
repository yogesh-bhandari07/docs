import { NextRequest, NextResponse } from "next/server";

export function subDomainMiddleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const mainDomain = "example.com";
  const parts = host.split(".");

  let subdomain = "";
  if (parts.length > 2 && host.endsWith(mainDomain)) {
    subdomain = parts[0];
  }

  const res = NextResponse.next();
  if (subdomain) {
    res.headers.set("slugOfProject", subdomain);
  }

  return res;
}
