// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, churchId } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'Name, email and password are required' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters' 
      }, { status: 400 });
    }

    // Get default church if churchId not provided
    let finalChurchId = churchId;
    if (!finalChurchId) {
      const defaultChurch = await prisma.church.findFirst({
        orderBy: { createdAt: 'asc' }
      });
      
      if (!defaultChurch) {
        return NextResponse.json({ 
          error: 'No church found. Please create a church first.' 
        }, { status: 400 });
      }
      
      finalChurchId = defaultChurch.id;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'ADMIN',           // First user is Admin
        churchId: finalChurchId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json({
      message: 'Account created successfully!',
      user
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Something went wrong. Please try again.' 
    }, { status: 500 });
  }
}