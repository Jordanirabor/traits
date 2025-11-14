import { deleteSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Logout endpoint - destroys the user session
 */
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (sessionToken) {
      // Delete session from database
      await deleteSession(sessionToken);
    }

    // Clear session cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session_token');
    response.cookies.delete('temp_user'); // Also clear any temp user cookie

    return response;
  } catch (error) {
    console.error('Logout error:', error);

    // Even if there's an error, clear cookies and redirect
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session_token');
    response.cookies.delete('temp_user');

    return response;
  }
}

/**
 * Also support GET for simple logout links
 */
export async function GET(request: NextRequest) {
  return POST(request);
}
