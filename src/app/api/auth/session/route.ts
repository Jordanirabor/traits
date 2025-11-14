import { getSession } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

/**
 * Get current session endpoint
 * Returns session data if authenticated, null otherwise
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
