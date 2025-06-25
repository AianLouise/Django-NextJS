'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new worktally dashboard
    router.replace('/worktally/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Redirecting to WorkTally...</span>
        </div>
      </div>
    </div>
  );
}
