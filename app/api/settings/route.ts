// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const church = await prisma.church.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(church || {
      name: "The World Light Chapel",
      shortName: "WLC",
      slug: "main-church",
      pastorName: "",
      email: "",
      phone: "",
      address: ""
    });
  } catch (error) {
    console.error('Settings GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    const church = await prisma.church.upsert({
      where: { 
        slug: 'main-church'   // Using slug as stable identifier
      },
      update: {
        name: data.name?.trim(),
        shortName: data.shortName?.trim(),
        pastorName: data.pastorName?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        address: data.address?.trim(),
      },
      create: {
        name: data.name?.trim() || "The World Light Chapel",
        shortName: data.shortName?.trim() || "WLC",
        slug: 'main-church',
        pastorName: data.pastorName?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        address: data.address?.trim(),
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