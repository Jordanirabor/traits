'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { signIn } = useAuth();

  const handleConsentKeysSignIn = async () => {
    setLoading(true);
    setMessage('');

    try {
      await signIn('consentkeys');
    } catch (error) {
      setMessage('Error signing in with ConsentKeys. Please try again.');
      console.error('ConsentKeys sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {message}
        </div>
      )}

      {/* ConsentKeys OIDC Button */}
      <button
        onClick={handleConsentKeysSignIn}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transition-colors"
      >
        {loading ? 'Signing in...' : 'Sign in with ConsentKeys'}
      </button>

      {/* Anonymous Usage Option */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Don&apos;t want to create an account?
        </p>
        <button
          onClick={() => {
            // Set a flag in sessionStorage to allow guest access
            sessionStorage.setItem('guestMode', 'true');
            window.location.href = '/assessment';
          }}
          className="text-primary hover:text-primary/90 text-sm font-medium underline-offset-4 hover:underline"
        >
          Continue as guest
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Note: Guest data is stored locally and won&apos;t be saved permanently
        </p>
      </div>
    </div>
  );
}
