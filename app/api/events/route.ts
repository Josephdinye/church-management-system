// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'events');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (e) {
    // Directory already exists
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: { select: { attendances: true } }
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('GET Events Error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string || 'Worship';
    const description = formData.get('description') as string;
    const expectedAttendees = formData.get('expectedAttendees') as string;
    const imageFile = formData.get('image') as File | null;

    // Get default church
    const church = await prisma.church.findFirst({
      where: { slug: 'main-church' }
    });

    if (!church) {
      return NextResponse.json({ error: 'Church not configured' }, { status: 400 });
    }

    let imageUrl = '';

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/events/${filename}`;
    }

    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        time,
        location,
        type,
        description,
        expectedAttendance: expectedAttendees ? parseInt(expectedAttendees) : 0,
        image: imageUrl || null,        // ← Added image field
        churchId: church.id,
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