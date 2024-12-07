import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.set('auth-token', '', { maxAge: 0 }); // Clear the cookie
  return response;
}
