import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuthToken } from '@/utils/verifyauth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth-token')?.value;
    console.log(token,"token")
    if (!token) {
      return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }
   
    const userId = verifyAuthToken(token); 
    if (!userId) { 
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
   
    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
