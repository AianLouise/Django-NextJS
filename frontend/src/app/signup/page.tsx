'use client';

import { useState } from 'react';
import { FaClock, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaBuilding, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
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
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,60 Q150,20 300,40 Q450,60 600,30 Q750,10 900,40 Q1050,80 1200,50" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M0,140 Q100,90 200,120 Q350,160 500,100 Q650,40 800,120 Q950,200 1100,140 Q1150,120 1200,140" stroke="rgba(147, 51, 234, 0.12)" strokeWidth="4" fill="none" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
          <path d="M0,220 Q120,170 240,200 Q360,230 480,190 Q600,150 720,190 Q840,230 960,200 Q1080,170 1200,220" stroke="rgba(236, 72, 153, 0.1)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '3s' }} />
          <path d="M0,300 Q150,250 300,280 Q450,300 600,270 Q750,240 900,280 Q1050,340 1200,300" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M0,380 Q180,330 360,360 Q540,390 720,350 Q900,310 1080,350 Q1140,370 1200,380" stroke="rgba(34, 197, 94, 0.12)" strokeWidth="3" fill="none" className="animate-pulse" style={{ animationDelay: '4.5s' }} />
          <path d="M0,460 Q90,410 180,440 Q270,470 360,430 Q450,390 540,430 Q630,470 720,440 Q810,410 900,440 Q990,470 1080,450 Q1140,440 1200,460" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '6s' }} />
          <path d="M0,540 Q120,490 240,520 Q360,550 480,510 Q600,470 720,510 Q840,550 960,520 Q1080,490 1200,540" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" fill="none" className="animate-pulse" />
          <path d="M0,600 Q150,550 300,580 Q450,600 600,570 Q750,540 900,580 Q1050,640 1200,600" stroke="rgba(147, 51, 234, 0.12)" strokeWidth="4" fill="none" className="animate-pulse" style={{ animationDelay: '7.5s' }} />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-md sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaClock className="text-white text-lg" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
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
                  <FaBuilding className="text-white" />
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
                  <FaUsers className="text-white" />
                </div>
                Admin Account Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </label>
                    <div className="mt-1 flex items-center gap-3 rounded-xl shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2">
                      <FaUser className="h-4 w-4 text-gray-400" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full py-1.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white sm:text-sm"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </label>
                    <div className="mt-1 flex items-center gap-3 rounded-xl shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2">
                      <FaUser className="h-4 w-4 text-gray-400" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full py-1.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white sm:text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <div className="mt-1 flex items-center gap-3 rounded-xl shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full py-1.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white sm:text-sm"
                      placeholder="admin@acmecorp.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username *
                  </label>
                  <div className="mt-1 flex items-center gap-3 rounded-xl shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2">
                    <FaUser className="h-4 w-4 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full py-1.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white sm:text-sm"
                      placeholder="john_doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password *
                  </label>
                  <div className="mt-1 flex items-center gap-3 rounded-xl shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2 relative">
                    <FaLock className="h-4 w-4 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full py-1.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white sm:text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-4 w-4" />
                      ) : (
                        <FaEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password *
                  </label>
                  <div className="mt-1 flex items-center gap-3 rounded-xl shadow-sm bg-white dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 px-3 py-2">
                    <FaLock className="h-4 w-4 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full py-1.5 bg-transparent outline-none border-none placeholder-gray-400 dark:text-white sm:text-sm"
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
    </div>
  );
}
