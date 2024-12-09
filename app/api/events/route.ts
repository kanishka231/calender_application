import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Events';
import { verifyAuthToken } from '@/utils/verifyauth'; 
import { cookies } from 'next/headers'; 

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth-token')?.value;
  console.log(token,"token")
  if (!token) {
    return NextResponse.json({ error: 'Authorization token missing' }, { status: 402 });
  }
  const userId = verifyAuthToken(token);
  console.log(userId,"user id")
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name,description, datetime, tag ,meetingLink} = await request.json();
  console.log(name,description, datetime, tag ,meetingLink,"hj")
  if (!name || !description || !datetime || !tag || !meetingLink) {
    console.log("fisrt,")
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    await dbConnect();
    const overlappingEvent = await Event.findOne({ userId, datetime: new Date(datetime) });
    console.log(overlappingEvent,"overlapping")
    if (overlappingEvent) {
      console.log("hfhg")
      return NextResponse.json({ error: 'Time slot already occupied' }, { status: 400 });
    }
    const newEvent = await Event.create({ userId, name, description,datetime: new Date(datetime), tag,meetingLink });
    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
   
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const tag = searchParams.get('tag');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const query: any = { userId };
    if (tag) query.tag = tag;

    const events = await Event.find(query).limit(limit).sort({ datetime: 1 });
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
   
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
