'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkTallyHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard by default
    router.replace('/worktally/dashboard');
  }, [router]);

  return (
    <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Redirecting to dashboard...</span>
      </div>
    </div>
  );
}
