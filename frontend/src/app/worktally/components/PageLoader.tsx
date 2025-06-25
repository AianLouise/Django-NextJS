'use client';

import { FaSpinner } from 'react-icons/fa';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PageLoader({ message = 'Loading...', size = 'md' }: PageLoaderProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerClasses = {
    sm: 'min-h-64',
    md: 'min-h-96',
    lg: 'min-h-screen'
  };

  return (
    <div className={`${containerClasses[size]} flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse`}>
            <FaSpinner className="text-white text-xl animate-spin" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-20 animate-pulse -z-10"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
      </div>
    </div>
  );
}
