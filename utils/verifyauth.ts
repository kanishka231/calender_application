import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace with your actual secret in production

export function verifyAuthToken(token: string | undefined): string | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId; // Return the userId encoded in the token
  } catch (error) {
    console.error('Invalid token:', error);
    return null; // Token is invalid or expired
  }
}
