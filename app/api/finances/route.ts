// app/api/finances/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: {
        member: {
          select: { fullName: true, membershipNumber: true }
        }
      }
    });

    return NextResponse.json({
      transactions,
      summary: {
        totalIncome: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
        totalRecords: transactions.length,
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch finances' }, { status: 500 });
  }
}