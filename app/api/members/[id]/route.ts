// app/api/members/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id }
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error: any) {
    console.error("GET Member Error:", error.message);
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const member = await prisma.member.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        address: data.address,
        city: data.city,
        country: data.country,
        status: data.status,
        photo: data.photo || undefined,     // ← Allow photo update
      },
    });

    return NextResponse.json({ 
      message: 'Member updated successfully', 
      member 
    });
  } catch (error: any) {
    console.error("PUT Member Error:", error.message);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}