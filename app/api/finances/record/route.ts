// app/api/finances/record/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Normalize amount: accept both 20.50 and 20,50
    let amountStr = String(data.amount || '').trim();
    amountStr = amountStr.replace(',', '.');   // Convert comma to dot

    if (!amountStr || isNaN(Number(amountStr))) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const church = await prisma.church.findFirst({
      where: { slug: 'main-church' }
    });

    if (!church) {
      return NextResponse.json({ error: 'Church not configured' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: new Prisma.Decimal(amountStr),     // ← Decimal now
        date: data.date ? new Date(data.date) : new Date(),
        description: data.description || '',
        memberId: data.memberId || null,
        recordedBy: "Admin",
        churchId: church.id,
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
    console.error('Transaction error:', error);
    return NextResponse.json({ 
      error: 'Failed to record transaction',
      details: error.message 
    }, { status: 500 });
  }
}