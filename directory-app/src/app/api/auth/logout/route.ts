import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    // If user is logged in, get their email and delete any OTP tokens
    if (sessionToken) {
      const user = await db.businessOwner.findUnique({
        where: { id: sessionToken.value }
      });

      if (user?.email) {
        // Delete any existing OTP tokens for this user
        await db.verificationToken.deleteMany({
          where: { identifier: user.email }
        });
      }
    }

    cookieStore.delete('session_token');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
