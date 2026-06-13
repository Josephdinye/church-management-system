// app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        membershipNumber: true,
        fullName: true,
        email: true,
        phone: true,
        photo: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        city: true,
        country: true,
        status: true,
        joinDate: true,
        createdAt: true,
      }
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('GET Members Error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Get default church
    const church = await prisma.church.findFirst({
      where: { slug: 'main-church' }
    });

    if (!church) {
      return NextResponse.json({ error: 'Church not configured' }, { status: 400 });
    }

    // Generate Custom Membership Number (WLC000001, WLC000002, ...)
    const lastMember = await prisma.member.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { membershipNumber: true }
    });

    let nextNumber = 1;
    if (lastMember?.membershipNumber) {
      const lastNum = parseInt(lastMember.membershipNumber.replace('WLC', '')) || 0;
      nextNumber = lastNum + 1;
    }

    const membershipNumber = `WLC${nextNumber.toString().padStart(6, '0')}`;

    const member = await prisma.member.create({
      data: {
        membershipNumber,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        address: data.address,
        city: data.city,
        country: data.country || 'Ghana',
        status: data.status || 'Active',
        photo: data.photo || null,
        churchId: church.id,           // ← This was missing
      },
    });

    return NextResponse.json({ 
      message: 'Member created successfully', 
      member 
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST Member Error:', error);
    return NextResponse.json({ 
      error: error.code === 'P2002' 
        ? 'Email already exists' 
        : 'Failed to create member' 
    }, { status: 500 });
  }
}