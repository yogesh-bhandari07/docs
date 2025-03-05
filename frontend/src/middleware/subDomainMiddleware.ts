import next from "next";
import { NextRequest, NextResponse } from "next/server";

export default function subDomainMiddleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const mainDomain = process.env.NEXT_PUBLIC_HOST || "localhost";
  const parts = host.split(".");

  let subdomain = "";
  if (parts.length == 2) {
    subdomain = parts[0];
  }

  console.log("subdomain", subdomain);

  const res = NextResponse.next();
  if (subdomain) {
    res.cookies.set("subdomain", subdomain, {
      httpOnly: false,
      path: "/",
    });
  }

  console.log(
    "req.nextUrl.pathname",
    req.nextUrl.host,
    subdomain,
    req.nextUrl.pathname
  );
  if (!["", "/"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(`http://${subdomain}.${req.nextUrl.host}`, req.url)
    );
  }

  return res;
}
