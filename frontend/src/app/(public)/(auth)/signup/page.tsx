'use client';

import { useState } from 'react';
import { LuClock, LuMail, LuLock, LuUser, LuEye, LuEyeOff, LuBuilding, LuUsers } from 'react-icons/lu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';
import { toast } from 'react-hot-toast';

export default function Signup() {
  // Organization details
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDescription, setOrganizationDescription] = useState('');

  // User details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!organizationName.trim()) {
      toast.error('Organization name is required');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setIsLoading(true);

    try {
      // Call Django backend organization register API
      const response = await apiRequest('/users/organization/register/', {
        method: 'POST',
        body: {
          organization_name: organizationName,
          organization_description: organizationDescription,
          email,
          username,
          password,
          password2: confirmPassword,
          first_name: firstName,
          last_name: lastName,
        },
      });

      // Store auth token and user data
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }

      toast.success('Organization created successfully! Redirecting...');

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Registration error:', err);
      const message = err instanceof Error ? err.message : 'An error occurred during signup. Please try again.';
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
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 2400 1200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,100 Q300,40 600,70 Q900,100 1200,55 Q1500,10 1800,70 Q2100,130 2400,100" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M0,250 Q240,175 480,220 Q720,265 960,205 Q1200,145 1440,205 Q1680,265 1920,220 Q2160,175 2400,250" stroke="rgba(147, 51, 234, 0.12)" strokeWidth="4" fill="none" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
          <path d="M0,400 Q200,350 400,390 Q600,430 800,400 Q1000,370 1200,410 Q1400,450 1600,420 Q1800,390 2000,430 Q2200,470 2400,400" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '3s' }} />
          <path d="M0,550 Q300,475 600,520 Q900,565 1200,505 Q1500,445 1800,505 Q2100,565 2400,550" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M0,700 Q360,625 720,670 Q1080,715 1440,655 Q1800,595 2160,655 Q2280,685 2400,700" stroke="rgba(34, 197, 94, 0.12)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '4.5s' }} />
          <path d="M0,850 Q180,775 360,820 Q540,865 720,805 Q900,745 1080,805 Q1260,865 1440,820 Q1620,775 1800,820 Q1980,865 2160,835 Q2280,820 2400,850" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '6s' }} />
          <path d="M0,1000 Q240,925 480,970 Q720,1015 960,955 Q1200,895 1440,955 Q1680,1015 1920,970 Q2160,925 2400,1000" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M0,1150 Q300,1075 600,1120 Q900,1165 1200,1105 Q1500,1045 1800,1105 Q2100,1165 2400,1150" stroke="rgba(147, 51, 234, 0.12)" strokeWidth="4" fill="none" className="animate-pulse" style={{ animationDelay: '7.5s' }} />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-md sm:max-w-md relative z-10">
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
          Get Started
        </h2>
        <p className="mt-2 text-center text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto px-4">
          Create an account for your organization and start tracking time
        </p>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 relative group">
            Sign in
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md sm:max-w-xl lg:max-w-2xl relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-6 px-4 sm:py-8 sm:px-8 shadow-lg sm:rounded-2xl border border-white/20 dark:border-gray-700/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Organization Section */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <LuBuilding className="text-white" />
                </div>
                Organization Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization Name *
                  </label>
                  <div className="mt-1">
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                      placeholder="Acme Corporation"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organizationDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="organizationDescription"
                      name="organizationDescription"
                      rows={3}
                      value={organizationDescription}
                      onChange={(e) => setOrganizationDescription(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                      placeholder="Brief description of your organization..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin User Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <LuUsers className="text-white" />
                </div>
                Admin Account Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </label>
                    <div className="mt-1 flex items-center gap-3 rounded-lg shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2.5">
                      <LuUser className="h-4 w-4 text-gray-400" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full py-0.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white text-sm"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </label>
                    <div className="mt-1 flex items-center gap-3 rounded-lg shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2.5">
                      <LuUser className="h-4 w-4 text-gray-400" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full py-0.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
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
                      placeholder="admin@acmecorp.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username *
                  </label>
                  <div className="mt-1 flex items-center gap-3 rounded-lg shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2.5">
                    <LuUser className="h-4 w-4 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full py-0.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white text-sm"
                      placeholder="john_doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password *
                  </label>
                  <div className="mt-1 flex items-center gap-3 rounded-lg shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2.5 relative">
                    <LuLock className="h-4 w-4 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
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
                        <LuEyeOff className="h-4 w-4" />
                      ) : (
                        <LuEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password *
                  </label>
                  <div className="mt-1 flex items-center gap-3 rounded-lg shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2.5">
                    <LuLock className="h-4 w-4 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full py-0.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
              </div>
              <div className="ml-2">
                <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 sm:px-6 border border-transparent rounded-xl shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating organization...' : 'Create Organization & Account'}
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
