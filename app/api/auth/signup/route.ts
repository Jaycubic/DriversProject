import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/db/services';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    if (!userData.email || !userData.password || !userData.name || !userData.role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await AuthService.createUser(userData);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
