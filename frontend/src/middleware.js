import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/driver/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
//  matcher: ["/driver/dashboard"],
matcher: ["/driverdd/dashboard"],
};