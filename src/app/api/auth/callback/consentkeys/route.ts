import { consentKeysOIDC, ConsentKeysOIDCError } from '@/lib/auth/consentkeys';
import { db } from '@/lib/db';
import { accounts, sessions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/**
 * ConsentKeys OIDC callback endpoint
 * Handles the OAuth callback, exchanges code for tokens, retrieves user info,
 * and creates/updates user profile in the database
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const storedState = request.cookies.get('oauth_state')?.value;
  const storedNonce = request.cookies.get('oauth_nonce')?.value;

  // Handle OAuth errors from ConsentKeys
  if (error) {
    console.error('ConsentKeys OAuth error:', {
      error,
      error_description: errorDescription,
      state,
      client_id: process.env.CONSENTKEYS_CLIENT_ID,
      redirect_url: process.env.CONSENTKEYS_REDIRECT_URL,
    });

    const response = NextResponse.redirect(
      new URL(
        '/login?error=oauth_error&details=' +
          encodeURIComponent(errorDescription || error),
        request.url
      )
    );
    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_nonce');

    return response;
  }

  // Verify state parameter to prevent CSRF attacks
  if (!state || !storedState || state !== storedState) {
    console.error('State verification failed:', {
      state_received: !!state,
      state_stored: !!storedState,
      states_match: state === storedState,
    });

    const response = NextResponse.redirect(
      new URL(
        '/login?error=auth_failed&details=State verification failed (CSRF protection)',
        request.url
      )
    );
    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_nonce');

    return response;
  }

  // Verify authorization code is present
  if (!code) {
    console.error('No authorization code provided');
    const response = NextResponse.redirect(
      new URL(
        '/login?error=auth_failed&details=No authorization code received',
        request.url
      )
    );
    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_nonce');

    return response;
  }

  try {
    // Exchange authorization code for tokens
    console.log('Exchanging authorization code for tokens...');
    const tokens = await consentKeysOIDC.exchangeCodeForTokens(code, state);

    // Retrieve user information from ConsentKeys
    console.log('Fetching user information...');
    const userInfo = await consentKeysOIDC.getUserInfo(tokens.access_token);

    console.log('ConsentKeys authentication successful:', {
      user_id: userInfo.sub,
      email: userInfo.email,
      email_verified: userInfo.email_verified,
      name: userInfo.name,
    });

    // Synchronize user profile with database
    const syncedUser = await syncUserProfile(userInfo, tokens);

    // Create session for the user
    const session = await createUserSession(syncedUser.id, request);

    console.log('User profile synchronized and session created:', {
      user_id: syncedUser.id,
      session_id: session.id,
    });

    // Clear OAuth cookies and set session cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;
    const response = NextResponse.redirect(
      new URL('/assessment?auth=success', baseUrl)
    );

    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_nonce');

    // Set session cookie
    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('ConsentKeys callback error:', error);

    // Clear OAuth cookies on error
    const response = NextResponse.redirect(
      new URL(
        '/login?error=auth_failed&details=' +
          encodeURIComponent(
            error instanceof ConsentKeysOIDCError
              ? error.message
              : error instanceof Error
                ? error.message
                : 'Authentication failed'
          ),
        request.url
      )
    );

    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_nonce');

    return response;
  }
}

/**
 * Synchronize user profile from ConsentKeys with local database
 * Creates new user if doesn't exist, updates existing user if found
 */
async function syncUserProfile(
  userInfo: {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
  },
  tokens: {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
    expires_in: number;
  }
) {
  const userId = `consentkeys_${userInfo.sub}`;

  try {
    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const now = new Date();
    const userName =
      userInfo.name ||
      [userInfo.given_name, userInfo.family_name].filter(Boolean).join(' ') ||
      userInfo.email ||
      'ConsentKeys User';

    if (existingUsers.length > 0) {
      // Update existing user
      console.log('Updating existing user:', userId);

      const [updatedUser] = await db
        .update(users)
        .set({
          name: userName,
          email: userInfo.email || existingUsers[0].email,
          emailVerified:
            userInfo.email_verified || existingUsers[0].emailVerified,
          image: userInfo.picture || existingUsers[0].image,
          updatedAt: now,
        })
        .where(eq(users.id, userId))
        .returning();

      // Update OAuth account tokens
      await db
        .update(accounts)
        .set({
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          refreshToken: tokens.refresh_token,
          accessTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          updatedAt: now,
        })
        .where(eq(accounts.userId, userId));

      return updatedUser;
    } else {
      // Create new user
      console.log('Creating new user:', userId);

      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          name: userName,
          email: userInfo.email || `${userInfo.sub}@consentkeys.local`,
          emailVerified: userInfo.email_verified || false,
          image: userInfo.picture,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      // Create OAuth account record
      await db.insert(accounts).values({
        id: `account_${userId}_${Date.now()}`,
        accountId: userInfo.sub,
        providerId: 'consentkeys',
        userId: newUser.id,
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: 'openid profile email',
        createdAt: now,
        updatedAt: now,
      });

      console.log('New user created successfully:', newUser.id);

      return newUser;
    }
  } catch (error) {
    console.error('Error synchronizing user profile:', error);
    throw new ConsentKeysOIDCError(
      'Failed to synchronize user profile',
      'PROFILE_SYNC_FAILED',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
}

/**
 * Create a new session for the authenticated user
 */
async function createUserSession(userId: string, request: NextRequest) {
  try {
    const sessionId = `session_${userId}_${Date.now()}`;
    const sessionToken = generateSessionToken();
    const now = new Date();
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // 7 days

    // Get client information
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const [session] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId,
        token: sessionToken,
        expiresAt,
        ipAddress,
        userAgent,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    console.log('Session created:', {
      session_id: session.id,
      user_id: userId,
      expires_at: expiresAt,
    });

    return session;
  } catch (error) {
    console.error('Error creating user session:', error);
    throw new ConsentKeysOIDCError(
      'Failed to create user session',
      'SESSION_CREATE_FAILED',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
}

/**
 * Generate a cryptographically secure session token
 */
function generateSessionToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for Node.js environments
    const nodeCrypto = require('crypto');
    nodeCrypto.randomFillSync(array);
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}
