'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  user: User;
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

interface AuthContextType {
  session: any | null;
  loading: boolean;
  signIn: (provider: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check for ConsentKeys session token
        const sessionToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('session_token='));

        if (sessionToken) {
          // Fetch session data from API
          const response = await fetch('/api/auth/session');
          if (response.ok) {
            const sessionData = await response.json();
            setSession(sessionData);
          } else {
            setSession(null);
          }
        } else {
          // Check for temporary ConsentKeys session (legacy)
          const tempUserCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('temp_user='));

          if (tempUserCookie) {
            try {
              const tempUser = JSON.parse(
                decodeURIComponent(tempUserCookie.split('=')[1])
              );
              setSession({
                user: tempUser,
                session: {
                  id: 'temp_session',
                  userId: tempUser.id,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                  token: 'temp_token',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              });
            } catch (e) {
              console.error('Error parsing temp user cookie:', e);
              setSession(null);
            }
          } else {
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (provider: string) => {
    try {
      if (provider === 'consentkeys') {
        // Redirect to our custom ConsentKeys OAuth flow
        window.location.href = '/api/auth/consentkeys?action=login';
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Call logout API endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
