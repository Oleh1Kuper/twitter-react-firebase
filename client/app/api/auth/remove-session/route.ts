import { NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    await adminAuth.verifyIdToken(idToken);
    const response = NextResponse.json({ status: 'success' });

    response.cookies.set({
      name: 'session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
