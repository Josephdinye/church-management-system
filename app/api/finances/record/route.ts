// app/api/finances/record/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: parseFloat(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        description: data.description || '',
        memberId: data.memberId || null,
        recordedBy: "Admin",
      },
      include: {
        member: true
      }
    });

    return NextResponse.json({
      message: 'Transaction recorded successfully',
      transaction
    }, { status: 201 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
  }
}