import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyAuthToken } from '@/utils/verifyauth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // If no query is provided, return early with an empty array
    if (!query) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // If query is present, proceed with authentication
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }
  
    const userId = verifyAuthToken(token); 
    if (!userId) { 
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();

    // Create case-insensitive regex for substring matching
    const searchRegex = new RegExp(query, 'i');

    // Search users by name or email, excluding the authenticated user
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ],
      _id: { $ne: userId } // Exclude the user with the matching ID
    }).select('name email _id'); // Select only necessary fields

    return NextResponse.json({ 
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}