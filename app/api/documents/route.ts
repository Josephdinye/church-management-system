// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        member: {
          select: { id: true, fullName: true, membershipNumber: true }
        }
      }
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
    const title = (formData.get('title') as string) || '';
    const category = (formData.get('category') as string) || 'General';
    const memberId = formData.get('memberId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const church = await prisma.church.findFirst({
      where: { slug: 'main-church' }
    });

    if (!church) {
      return NextResponse.json({ error: 'Church not configured' }, { status: 400 });
    }

    // TODO: Add your Cloudflare R2 upload logic here
    // For now, we'll simulate the URL
    const publicUrl = `https://pub-fce821afe01d449d9f48745bf165c7b7.r2.dev/documents/${Date.now()}-${file.name}`;

    const document = await prisma.document.create({
      data: {
        title: title || file.name,
        url: publicUrl,
        type: file.type,
        fileSize: file.size,
        category,
        memberId: memberId || null,
        churchId: church.id,
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

// ✅ ADD THIS DELETE METHOD
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete Document Error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}