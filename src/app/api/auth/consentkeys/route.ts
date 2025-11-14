import { consentKeysOIDC, ConsentKeysOIDCError } from '@/lib/auth/consentkeys';
import { NextRequest, NextResponse } from 'next/server';

/**
 * ConsentKeys OIDC authentication initiation endpoint
 * Generates state/nonce, stores them in cookies, and redirects to ConsentKeys authorization
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action !== 'login') {
    return NextResponse.json(
      { error: 'Invalid action. Use ?action=login' },
      { status: 400 }
    );
  }

  try {
    // Generate secure random state and nonce
    const state = consentKeysOIDC.generateRandomString(32);
    const nonce = consentKeysOIDC.generateRandomString(32);

    console.log('Initiating ConsentKeys OIDC flow:', {
      state_length: state.length,
      nonce_length: nonce.length,
      redirect_url: process.env.CONSENTKEYS_REDIRECT_URL,
    });

    // Get authorization URL from ConsentKeys
    const authorizationUrl = await consentKeysOIDC.getAuthorizationUrl(
      state,
      nonce
    );

    // Create response with redirect
    const response = NextResponse.redirect(authorizationUrl);

    // Store state and nonce in secure HTTP-only cookies
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 10, // 10 minutes - enough time for user to complete auth
    };

    response.cookies.set('oauth_state', state, cookieOptions);
    response.cookies.set('oauth_nonce', nonce, cookieOptions);

    console.log('OAuth cookies set:', {
      state_set: true,
      nonce_set: true,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    });

    return response;
  } catch (error) {
    console.error('ConsentKeys auth initiation error:', error);

    if (error instanceof ConsentKeysOIDCError) {
      return NextResponse.redirect(
        new URL(
          `/login?error=config_error&details=${encodeURIComponent(error.message)}`,
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        '/login?error=auth_failed&details=Failed to initiate authentication',
        request.url
      )
    );
  }
}
