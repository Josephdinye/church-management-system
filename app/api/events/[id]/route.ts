// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendances: true,
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('GET Event Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Basic validation
    if (!data.title || !data.date || !data.location) {
      return NextResponse.json({ 
        error: 'Title, date, and location are required' 
      }, { status: 400 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title.trim(),
        date: new Date(data.date),
        time: data.time?.trim() || null,
        location: data.location.trim(),
        type: data.type || 'Worship',
        description: data.description?.trim() || null,
        expectedAttendance: data.expectedAttendees ? parseInt(data.expectedAttendees) : undefined,
      },
    });

    return NextResponse.json({ 
      message: 'Event updated successfully', 
      event 
    });

  } catch (error: any) {
    console.error('PUT Event Error:', error.message);
    return NextResponse.json({ 
      error: 'Failed to update event' 
    }, { status: 500 });
  }
}