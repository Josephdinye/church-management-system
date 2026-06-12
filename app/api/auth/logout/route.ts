// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signOut } from 'next-auth/react'; // Not needed here, but for consistency

export async function POST(request: NextRequest) {
  try {
    // Clear cookies and session
    const response = NextResponse.json({ 
      message: 'Logged out successfully' 
    });

    // Clear NextAuth cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');

    return response;
  } catch (error) {
    return NextResponse.json({ 
      error: 'Logout failed' 
    }, { status: 500 });
  }
}