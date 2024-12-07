import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Import cookies helper

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET() {
  const cookieStore = cookies(); // Get the cookies helper
  const token =  (await cookieStore).get('auth-token')?.value; // Safely retrieve 'auth-token'

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET); // Verify the token
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
