import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Events';
import { verifyAuthToken } from '@/utils/verifyauth'; 
import { cookies } from 'next/headers'; 

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authorization token missing' }, { status: 402 });
  }

  const userId = verifyAuthToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, startTime, duration, tag, meetingLink } = await request.json();

  // Validate required fields
  if (!name || !description || !startTime || !duration || !tag || !meetingLink) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await dbConnect();

    const overlappingEvent = await Event.findOne({
      userId,
      startTime: { $lte: new Date(startTime) },
      endTime: { $gte: new Date(startTime) },
    });

    if (overlappingEvent) {
      return NextResponse.json({ error: 'Time slot already occupied' }, { status: 400 });
    }

    const startDateTime = new Date(startTime);
    const computedEndTime = new Date(startDateTime.getTime() + duration * 60000);

    const newEvent = await Event.create({
      userId,
      name,
      description,
      startTime: startDateTime,
      endTime: computedEndTime,
      duration,
      tag,
      meetingLink,
    });

    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authorization token missing' }, { status: 402 });
  }
  const userId = verifyAuthToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await dbConnect();
    const query: any = { userId };
    const events = await Event.find(query).sort({ datetime: 1 });
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
   
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
