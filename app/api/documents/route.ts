// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadFile, generateFileKey } from '@/lib/cloudflare-r2';

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: { member: true }
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error('GET Documents Error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const category = (formData.get('category') as string) || 'General';
    const memberId = formData.get('memberId') as string | null;

    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
    }

    // Generate key and upload using the same method as member photos
    const key = generateFileKey('documents', file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadFile(key, buffer, file.type);

    // Save record to database
    const document = await prisma.document.create({
      data: {
        title,
        url: `https://pub-fce821afe01d449d9f48745bf165c7b7.r2.dev/${key}`,
        type: file.type,
        fileSize: file.size,
        category,
        memberId: memberId || undefined,
      },
    });

    return NextResponse.json({ 
      message: 'Document uploaded successfully', 
      document 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Document Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}