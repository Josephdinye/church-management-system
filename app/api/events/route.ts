// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('GET Events Error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const event = await prisma.event.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        time: data.time,
        location: data.location,
        type: data.type || 'Worship',
        description: data.description,
        expectedAttendance: data.expectedAttendees ? parseInt(data.expectedAttendees) : 0,
      },
    });

    return NextResponse.json({ 
      message: 'Event created successfully', 
      event 
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST Event Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create event' 
    }, { status: 500 });
  }
}