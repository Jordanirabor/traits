import { and, eq, gt, lt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from '../db';
import { sessions, users } from '../db/schema';

/**
 * Session management utilities for ConsentKeys OIDC authentication
 */

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
}

/**
 * Get the current session from the session token cookie
 * Returns null if no valid session exists
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Query session with user data
    const result = await db
      .select({
        session: sessions,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(
        and(
          eq(sessions.token, sessionToken),
          gt(sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const { session, user } = result[0];

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        token: session.token,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        ipAddress: session.ipAddress || undefined,
        userAgent: session.userAgent || undefined,
      },
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Validate if a session token is valid
 */
export async function validateSession(sessionToken: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(
        and(
          eq(sessions.token, sessionToken),
          gt(sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(sessionToken: string): Promise<boolean> {
  try {
    await db.delete(sessions).where(eq(sessions.token, sessionToken));
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<boolean> {
  try {
    await db.delete(sessions).where(eq(sessions.userId, userId));
    return true;
  } catch (error) {
    console.error('Error deleting user sessions:', error);
    return false;
  }
}

/**
 * Clean up expired sessions (should be run periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const now = new Date();
    // Delete sessions where expiration time is less than current time
    const result = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, now))
      .returning({ id: sessions.id });

    console.log(`Cleaned up ${result.length} expired sessions`);
    return result.length;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in server components and API routes
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
}
