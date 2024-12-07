import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if no token
  }

  try {
    jwt.verify(token, JWT_SECRET); // Verify the token
    return NextResponse.next(); // Allow access if valid
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect if invalid token
  }
}

export const config = {
  matcher: ['/dashboard', '/events/:path*'], // Protect these routes
};
