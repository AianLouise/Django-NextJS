'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FaCog, FaUser, FaLock, FaRegBell, FaDesktop, FaMoon, FaSun, FaEnvelope, FaSave, FaPalette, FaBell } from 'react-icons/fa';
import { logout, User } from '@/lib/api';
import { Header, Sidebar, PageLoader } from '../components';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);

  // Check authentication and load user data
  useEffect(() => {
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);

    // Apply dark mode class if needed
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check for auth token
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (!token) {
      // Redirect to login if no token is found
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Initialize form with user data
        setFirstName(parsedUser.first_name || '');
        setLastName(parsedUser.last_name || '');
        setEmail(parsedUser.email || '');
        setJobTitle(parsedUser.job_title || '');
        setDepartment(parsedUser.department || '');
        setPhoneNumber(parsedUser.phone_number || '');

        if (parsedUser.profile) {
          setBio(parsedUser.profile.bio || '');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data');
      }
    }

    setIsLoading(false);
  }, [router]);
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
      // Short delay to show the notification before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out. Please try again.');
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // Prepare profile data
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        job_title: jobTitle,
        department: department,
        phone_number: phoneNumber,
      };
      // Update profile via API
      try {
        // For now, just log the profile data (simulating API call)
        console.log('Profile data to be sent:', profileData);
        // Uncomment when API endpoint is ready:
        // const data = await apiRequest('/users/update-profile/', {
        //   method: 'PUT',
        //   body: profileData,
        // });
      } catch (apiError) {
        console.error('Profile update API error:', apiError);
        throw apiError;
      }
      // Update user data in local storage
      if (user) {
        const updatedUser = {
          ...user,
          first_name: firstName,
          last_name: lastName,
          job_title: jobTitle,
          department: department,
          phone_number: phoneNumber,
        };

        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      setIsLoading(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err); setError('Failed to update profile');
      setIsLoading(false);

      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);

      // Call password change API
      // await apiRequest('/users/change-password/', {
      //   method: 'POST',
      //   body: {
      //     old_password: currentPassword,
      //     new_password: newPassword,
      //     confirm_password: confirmPassword
      //   },
      // });

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsLoading(false);
      toast.success('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err); setError('Failed to change password');
      setIsLoading(false);

      toast.error('Failed to change password. Please try again.');
    }
  };

  // Handle notification settings update
  const handleNotificationSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Call notification settings API
      // await apiRequest('/users/notification-settings/', {
      //   method: 'POST',
      //   body: {
      //     email_notifications: emailNotifications,
      //     browser_notifications: browserNotifications
      //   },
      // });
      setIsLoading(false);
      toast.success('Notification settings updated successfully!');
    } catch (err) {
      console.error('Error updating notification settings:', err); setError('Failed to update notification settings');
      setIsLoading(false);

      toast.error('Failed to update notification settings. Please try again.');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Store preference
    localStorage.setItem('darkMode', newMode.toString());

    // Apply to document
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`${newMode ? 'Dark' : 'Light'} mode enabled`);
  };
  if (isLoading && !user) {
    return <PageLoader message="Loading settings..." size="lg" />;
  }return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Gradient Circles & Floating Icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <Header user={user} onLogout={handleLogout} />

      <div className="py-10 relative z-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
            <Sidebar />

            {/* Main Content */}
            <section className="flex-1">
              <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8">
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
                  Settings
                </h2>
                {/* Error Display */}
                {error && (
                  <div className="mb-6 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-md border border-red-200/50 dark:border-red-700/50 rounded-2xl p-6 shadow-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tabs */}
                <div className="border-b border-gray-200/30 dark:border-gray-700/30">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`${activeTab === 'profile'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center rounded-t-xl transition-all duration-200`}
                    >
                      <FaUser className="mr-2 h-5 w-5" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`${activeTab === 'password'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center rounded-t-xl transition-all duration-200`}
                    >
                      <FaLock className="mr-2 h-5 w-5" />
                      Password
                    </button>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`${activeTab === 'notifications'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center rounded-t-xl transition-all duration-200`}
                    >
                      <FaRegBell className="mr-2 h-5 w-5" />
                      Notifications
                    </button>
                    <button
                      onClick={() => setActiveTab('appearance')}
                      className={`${activeTab === 'appearance'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                        } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center rounded-t-xl transition-all duration-200`}
                    >
                      <FaDesktop className="mr-2 h-5 w-5" />
                      Appearance
                    </button>
                  </nav>
                </div>
                {/* Tab Content */}
                <div className="mt-8">
                  {/* Profile Settings */}
                  {activeTab === 'profile' && (
                    <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
                      <form onSubmit={handleProfileUpdate}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="first-name" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="first-name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label htmlFor="last-name" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="last-name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              disabled
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-gray-100/70 dark:bg-gray-600/50 text-gray-500 dark:text-gray-400 text-sm backdrop-blur-sm"
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Email cannot be changed. Contact support for assistance.
                            </p>
                          </div>
                          <div>
                            <label htmlFor="job-title" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Job Title
                            </label>
                            <input
                              type="text"
                              id="job-title"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label htmlFor="department" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Department
                            </label>
                            <input
                              type="text"
                              id="department"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone-number" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              id="phone-number"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <label htmlFor="bio" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                          ></textarea>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Brief description about yourself.
                          </p>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {/* Password Settings */}
                  {activeTab === 'password' && (
                    <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
                      <form onSubmit={handlePasswordChange}>
                        <div className="space-y-6">
                          <div>
                            <label htmlFor="current-password" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="current-password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="new-password" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="new-password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="confirm-password" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="block p-1 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
                          </p>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                          >
                            Change Password
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
                      <form onSubmit={handleNotificationSettingsUpdate}>
                        <div className="space-y-8">
                          <div className="flex items-start p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                            <div className="flex items-center h-5">
                              <input
                                id="email-notifications"
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                              />
                            </div>
                            <div className="ml-4">
                              <label htmlFor="email-notifications" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <FaEnvelope className="mr-2 text-blue-600 dark:text-blue-400" />
                                Email Notifications
                              </label>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Receive notifications about timesheet approvals, reminders, and system updates via email.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start p-6 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200/30 dark:border-green-700/30">
                            <div className="flex items-center h-5">
                              <input
                                id="browser-notifications"
                                type="checkbox"
                                checked={browserNotifications}
                                onChange={(e) => setBrowserNotifications(e.target.checked)}
                                className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                              />
                            </div>
                            <div className="ml-4">
                              <label htmlFor="browser-notifications" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <FaBell className="mr-2 text-green-600 dark:text-green-400" />
                                Browser Notifications
                              </label>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Receive browser notifications when you&apos;re using the application.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <button
                            type="submit"
                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                          >
                            <FaSave className="mr-2 h-4 w-4" />
                            Save Preferences
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {/* Appearance Settings */}
                  {activeTab === 'appearance' && (
                    <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
                      <div className="space-y-8">
                        <div className="p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/30 dark:border-indigo-700/30">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4">
                            <FaPalette className="mr-3 text-indigo-600 dark:text-indigo-400" />
                            Theme Preferences
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Choose between light and dark theme for the application interface.
                          </p>

                          <div className="flex items-center justify-between p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-white/40 dark:border-gray-700/40">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-100'}`}>
                                {isDarkMode ? (
                                  <FaMoon className="h-6 w-6 text-blue-400" />
                                ) : (
                                  <FaSun className="h-6 w-6 text-yellow-500" />
                                )}
                              </div>
                              <div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {isDarkMode ? 'Dark theme is easier on the eyes' : 'Light theme for better visibility'}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={toggleDarkMode}
                              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                                } hover:scale-105 transform`}
                            >
                              <span className="sr-only">Toggle theme</span>
                              <span
                                className={`pointer-events-none relative inline-block p-1 h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
                                  }`}
                              >
                                <span
                                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ${isDarkMode ? 'opacity-0' : 'opacity-100'
                                    }`}
                                >
                                  <FaSun className="h-4 w-4 text-yellow-500" />
                                </span>
                                <span
                                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ${isDarkMode ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                  <FaMoon className="h-4 w-4 text-blue-600" />
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Additional appearance options placeholder */}
                        <div className="p-6 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                            <FaCog className="mr-2 text-emerald-600 dark:text-emerald-400" />
                            Interface Settings
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Additional interface customization options will be available in future updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
