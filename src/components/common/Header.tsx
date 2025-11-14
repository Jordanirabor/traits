'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const { session, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Personality Insights
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {session ? (
                  <>
                    <Link
                      href="/assessment"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium min-h-touch flex items-center"
                    >
                      Assessment
                    </Link>
                    <Link
                      href="/results"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium min-h-touch flex items-center"
                    >
                      Results
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="btn-secondary text-sm"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/assessment"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium min-h-touch flex items-center"
                    >
                      Assessment
                    </Link>
                    <Link href="/login" className="btn-primary text-sm">
                      Sign In
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden btn-base p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-2">
            {!loading && (
              <>
                {session ? (
                  <>
                    <Link
                      href="/assessment"
                      className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium min-h-touch"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Assessment
                    </Link>
                    <Link
                      href="/results"
                      className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium min-h-touch"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Results
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left btn-secondary text-base"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/assessment"
                      className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium min-h-touch"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Assessment
                    </Link>
                    <Link
                      href="/login"
                      className="block btn-primary text-base text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
