'use client';

import { useState } from 'react';
import { LuClock, LuMail, LuLock, LuEye, LuEyeOff } from 'react-icons/lu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email }); // Log login attempt      

      // Call Django backend login API with correct endpoint path
      const data = await apiRequest('/users/login/', {
        method: 'POST',
        body: { email, password },
      });

      console.log('Login response:', data); // Log successful response
      // Store token in localStorage for future API calls
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      document.cookie = `auth_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      sessionStorage.removeItem('dashboard_loaded');
      toast.success('Login successful! Redirecting...');
      // If login is successful, redirect to dashboard based on user role
      // For now, redirect to user dashboard - this can be enhanced with role-based routing
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      const message = err instanceof Error ? err.message : 'Invalid email or password. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Enhanced Wavy Lines Background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,80 Q150,30 300,60 Q450,90 600,50 Q750,10 900,60 Q1050,110 1200,80" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M0,200 Q120,150 240,180 Q360,210 480,170 Q600,130 720,170 Q840,210 960,180 Q1080,150 1200,200" stroke="rgba(147, 51, 234, 0.12)" strokeWidth="4" fill="none" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
          <path d="M0,320 Q180,270 360,300 Q540,330 720,290 Q900,250 1080,290 Q1140,310 1200,320" stroke="rgba(34, 197, 94, 0.12)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '3s' }} />
          <path d="M0,440 Q90,390 180,420 Q270,450 360,410 Q450,370 540,410 Q630,450 720,420 Q810,390 900,420 Q990,450 1080,430 Q1140,420 1200,440" stroke="rgba(236, 72, 153, 0.1)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '4.5s' }} />
          <path d="M0,560 Q150,510 300,540 Q450,570 600,530 Q750,490 900,540 Q1050,590 1200,560" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '6s' }} />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-md relative z-10">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {/* Enhanced 3D Logo */}
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl transform rotate-3 group-hover:rotate-6">
                <LuClock className="text-white text-xl drop-shadow-lg" />
              </div>
              {/* 3D depth shadow */}
              <div className="absolute top-1 left-1 w-11 h-11 bg-gradient-to-br from-blue-800 to-purple-800 rounded-2xl opacity-40 -z-10 transform rotate-3"></div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-20"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
                WorkTally
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Smart Time Tracker</p>
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto px-4">
          Sign in to access your account
        </p>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 relative group">
            Create one now
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-6 px-4 sm:py-8 sm:px-8 shadow-lg sm:rounded-2xl border border-white/20 dark:border-gray-700/30">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-xl text-sm border-l-4 border-red-500 shadow-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1 flex items-center gap-3 rounded-lg shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2.5">
                <LuMail className="h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full py-0.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 flex items-center gap-3 rounded-lg shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2.5 relative">
                <LuLock className="h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-0.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  {showPassword ? (
                    <LuEye className="h-4 w-4" />
                  ) : (
                    <LuEyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 relative group">
                  Forgot your password?
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 sm:px-6 border border-transparent rounded-xl shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} WorkTally. All rights reserved.
        </p>
        <p className="mt-2">
          <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Privacy Policy
          </Link>{' '}
          |{' '}
          <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Terms of Service
          </Link>
        </p>
      </footer>
    </div>
  );
}
