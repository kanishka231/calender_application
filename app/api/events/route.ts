// API Route (Backend)

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Events';
import { verifyAuthToken } from '@/utils/verifyauth'; // Helper to verify JWT token
import { cookies } from 'next/headers'; // Import cookies helper

// Create an Event
export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Authorization token missing' }, { status: 400 });
  }

  const userId = verifyAuthToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, datetime, tag } = await request.json();
  if (!name || !datetime || !tag) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await dbConnect();
    const overlappingEvent = await Event.findOne({ userId, datetime: new Date(datetime) });
    if (overlappingEvent) {
      return NextResponse.json({ error: 'Time slot already occupied' }, { status: 400 });
    }

    const newEvent = await Event.create({ userId, name, datetime: new Date(datetime), tag });
    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Get Events
export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Authorization token missing' }, { status: 400 });
  }

  const userId = verifyAuthToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    await dbConnect();
    const query: any = { userId };
    if (tag) query.tag = tag;

    const events = await Event.find(query).limit(limit).sort({ datetime: 1 });
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
