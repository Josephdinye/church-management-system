// app/api/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const memberId = searchParams.get('memberId');

    const whereClause: any = {};
    if (date) whereClause.date = new Date(date);
    if (memberId) whereClause.memberId = memberId;

    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        member: {
          select: { id: true, membershipNumber: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ attendances });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Check if record exists and is still editable (within 1 hour)
    if (data.id) {
      const existing = await prisma.attendance.findUnique({ where: { id: data.id } });
      if (existing) {
        const hoursDiff = (new Date().getTime() - existing.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 1) {
          return NextResponse.json({ error: 'Attendance record is locked (more than 1 hour old)' }, { status: 403 });
        }
      }
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        memberId_date: {
          memberId: data.memberId,
          date: new Date(data.date)
        }
      },
      update: {
        status: data.status,
        notes: data.notes || null,
      },
      create: {
        memberId: data.memberId,
        date: new Date(data.date),
        status: data.status,
        notes: data.notes || null,
      }
    });

    return NextResponse.json({
      message: 'Attendance updated successfully',
      attendance
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}