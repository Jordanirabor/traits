'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Dashboard page - redirects to assessment page
 * This page is deprecated in favor of the new UI structure
 */
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to assessment page
    router.replace('/assessment');
  }, [router]);

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
