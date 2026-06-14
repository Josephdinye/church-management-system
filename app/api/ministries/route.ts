// app/api/ministries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'ministries');
const DATA_FILE = path.join(process.cwd(), 'data', 'ministries.json');

// Ensure directories exist
async function ensureDirectories() {
  await mkdir(UPLOAD_DIR, { recursive: true });
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
}

// Read ministries from JSON
async function readMinistries() {
  try {
    const data = await import('fs/promises').then(fs => fs.readFile(DATA_FILE, 'utf8'));
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write ministries to JSON
async function writeMinistries(ministries: any[]) {
  await ensureDirectories();
  const fs = await import('fs/promises');
  await fs.writeFile(DATA_FILE, JSON.stringify(ministries, null, 2));
}

// GET all ministries
export async function GET() {
  const ministries = await readMinistries();
  return NextResponse.json(ministries);
}

// POST - Create new ministry with image upload
export async function POST(request: NextRequest) {
  try {
    await ensureDirectories();
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string || '🙏';
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') !== 'false';
    const imageFile = formData.get('image') as File | null;

    let imageUrl = '';

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `${Date.now()}-${imageFile.name}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/ministries/${filename}`;
    }

    const ministries = await readMinistries();

    const newMinistry = {
      id: Date.now().toString(),
      title,
      description,
      icon,
      image: imageUrl,
      order,
      isActive,
      createdAt: new Date().toISOString(),
    };

    ministries.push(newMinistry);
    await writeMinistries(ministries);

    return NextResponse.json(newMinistry, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create ministry' }, { status: 500 });
  }
}

// PUT - Update ministry
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const ministries = await readMinistries();
    const index = ministries.findIndex((m: any) => m.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Ministry not found' }, { status: 404 });
    }

    const imageFile = formData.get('image') as File | null;
    let imageUrl = ministries[index].image;

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/ministries/${filename}`;
    }

    ministries[index] = {
      ...ministries[index],
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string || '🙏',
      image: imageUrl,
      order: parseInt(formData.get('order') as string),
      isActive: formData.get('isActive') !== 'false',
      updatedAt: new Date().toISOString(),
    };

    await writeMinistries(ministries);
    return NextResponse.json(ministries[index]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update ministry' }, { status: 500 });
  }
}

// DELETE ministry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    let ministries = await readMinistries();
    ministries = ministries.filter((m: any) => m.id !== id);

    await writeMinistries(ministries);
    return NextResponse.json({ success: true, message: 'Ministry deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete ministry' }, { status: 500 });
  }
}