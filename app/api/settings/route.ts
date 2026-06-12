// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const church = await prisma.church.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(church || {});
  } catch (error) {
    console.error('Settings GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Update or create the main church
    const church = await prisma.church.upsert({
      where: { id: data.id || 'main-church' },
      update: {
        name: data.name,
        slug: data.slug || 'main-church',
        pastorName: data.pastorName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
      create: {
        name: data.name,
        slug: data.slug || 'main-church',
        pastorName: data.pastorName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });

    return NextResponse.json({ 
      message: 'Settings saved successfully', 
      church 
    });

  } catch (error: any) {
    console.error('Settings PUT Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to save settings' 
    }, { status: 500 });
  }
}