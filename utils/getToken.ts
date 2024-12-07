
import { cookies } from 'next/headers';

// Function to retrieve token from cookies
export const getTokenFromCookies = async (): Promise<string | undefined> => {
  const cookieStore = cookies(); // Get cookies helper
  const token = (await cookieStore).get('auth-token')?.value; // Retrieve 'auth-token' from cookies
  return token;
};



