'use client';

import { useState } from 'react';
import { FaClock, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaBuilding, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!organizationName.trim()) {
      setError('Organization name is required');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

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

      setSuccess('Organization created successfully! Redirecting to dashboard...');

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }; return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-yellow-400 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400 dark:bg-green-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-8000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-10000"></div>
        <div className="absolute bottom-40 left-10 w-64 h-64 bg-teal-400 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-blob animation-delay-14000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
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
                TimeTrack
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Smart Time Management</p>
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
          Get Started
        </h2>
        <p className="mt-2 text-center text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Create an account for your organization and start tracking time
        </p>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 relative group">
            Sign in
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-8 px-6 shadow-lg sm:rounded-2xl sm:px-10 border border-white/20 dark:border-gray-700/30">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-xl text-sm border-l-4 border-red-500 shadow-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-4 rounded-xl text-sm border-l-4 border-green-500 shadow-sm">
              {success}
            </div>
          )}

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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </label>
                    <div className="mt-1 relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                      placeholder="admin@acmecorp.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username *
                  </label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                      placeholder="john_doe"
                    />
                  </div>
                </div>                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password *
                  </label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password *
                  </label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white sm:text-sm backdrop-blur-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating organization...' : 'Create Organization & Account'}
              </button>
            </div>
          </form>          <div className="mt-6">
            <div className="relative">              <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 backdrop-blur-sm">
                  Benefits of TimeTrack
                </span>
              </div>
            </div>            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl shadow-sm border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm">
                <FaUsers className="h-4 w-4 mr-2 text-blue-600" />
                Invite up to 50 team members
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl shadow-sm border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm">
                <FaClock className="h-4 w-4 mr-2 text-blue-600" />
                Track time across projects
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 p-3 rounded-xl shadow-sm border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm">
                <FaBuilding className="h-4 w-4 mr-2 text-blue-600" />
                Manage your organization
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
