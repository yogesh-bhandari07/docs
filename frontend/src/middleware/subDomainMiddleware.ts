import { NextRequest, NextResponse } from "next/server";

export default function subDomainMiddleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const mainDomain = process.env.NEXT_PUBLIC_HOST || "localhost";
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
