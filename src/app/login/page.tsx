'use client';

import LoginForm from '@/components/auth/LoginForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const details = searchParams.get('details');

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-semibold">Authentication Error</h3>
          {error === 'oauth_error' && details && (
            <p className="text-sm mt-1">
              ConsentKeys Error: {decodeURIComponent(details)}
            </p>
          )}
          {error === 'auth_failed' && (
            <div>
              <p className="text-sm mt-1">
                Authentication failed. Please try again.
              </p>
              {details && (
                <p className="text-xs mt-1 text-red-600">
                  Error details: {decodeURIComponent(details)}
                </p>
              )}
            </div>
          )}
          <p className="text-xs mt-2 text-red-600">
            If this error persists, please check that your ConsentKeys client is
            properly configured and active.
          </p>
        </div>
      )}
      <LoginForm />
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Personality Insights App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to save your personality data and insights
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<LoginForm />}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
