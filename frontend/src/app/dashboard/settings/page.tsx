'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaTimes, FaUser, FaLock, FaRegBell, FaDesktop, FaMoon, FaSun } from 'react-icons/fa';
import { logout, User } from '@/lib/api';

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
  
  // Notification state
  interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Show notification function
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const newNotification = { id, message, type, duration };
    
    // Check if this notification already exists to prevent duplicates
    setNotifications(prev => {
      // Check if a similar notification already exists
      const duplicateExists = prev.some(n => n.message === message && n.type === type);
      if (duplicateExists) {
        return prev; // Don't add duplicate
      }
      return [...prev, newNotification];
    });
    
    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
  };
  
  // Dismiss notification function
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
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
      showNotification('Successfully logged out!', 'success', 2000);
      // Short delay to show the notification before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Error logging out. Please try again.', 'error');
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
      showNotification('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      setIsLoading(false);
      
      showNotification('Failed to update profile. Please try again.', 'error');
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match.', 'error');
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
      showNotification('Password changed successfully!', 'success');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password');
      setIsLoading(false);
      
      showNotification('Failed to change password. Please try again.', 'error');
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
      showNotification('Notification settings updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('Failed to update notification settings');
      setIsLoading(false);
      
      showNotification('Failed to update notification settings. Please try again.', 'error');
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
    
    showNotification(`${newMode ? 'Dark' : 'Light'} mode enabled`, 'success', 2000);
  };
  
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-md shadow-lg flex justify-between items-start 
              ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
                notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 
                'bg-blue-50 text-blue-800 border-l-4 border-blue-500'} 
              transform transition-all duration-300 ease-in-out`}
          >
            <div>
              <p className="font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => dismissNotification(notification.id)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <FaClock className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">TimeTrack</span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => showNotification('You have no new notifications', 'info')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <FaBell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {user ? `${user.first_name} ${user.last_name}` : 'User'}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-4 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span className="ml-1 text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Dashboard Content */}
            <div className="px-4 py-8 sm:px-0">
              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 mb-8 md:mb-0">
                  <nav className="space-y-1">
                    <Link 
                      href="/dashboard" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaHome className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/timesheet" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaCalendarAlt className="mr-3 h-5 w-5" />
                      Timesheet
                    </Link>
                    <Link 
                      href="/dashboard/reports" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaChartBar className="mr-3 h-5 w-5" />
                      Reports
                    </Link>
                    <Link 
                      href="/dashboard/team" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaUsers className="mr-3 h-5 w-5" />
                      Team
                    </Link>
                    <Link 
                      href="/dashboard/settings" 
                      className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaCog className="mr-3 h-5 w-5" />
                      Settings
                    </Link>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 md:ml-8">
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Settings</h2>
                      
                      {/* Error Display */}
                      {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
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
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                          <button
                            onClick={() => setActiveTab('profile')}
                            className={`${
                              activeTab === 'profile'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                          >
                            <FaUser className="mr-2 h-5 w-5" />
                            Profile
                          </button>
                          <button
                            onClick={() => setActiveTab('password')}
                            className={`${
                              activeTab === 'password'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                          >
                            <FaLock className="mr-2 h-5 w-5" />
                            Password
                          </button>
                          <button
                            onClick={() => setActiveTab('notifications')}
                            className={`${
                              activeTab === 'notifications'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                          >
                            <FaRegBell className="mr-2 h-5 w-5" />
                            Notifications
                          </button>
                          <button
                            onClick={() => setActiveTab('appearance')}
                            className={`${
                              activeTab === 'appearance'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                          >
                            <FaDesktop className="mr-2 h-5 w-5" />
                            Appearance
                          </button>
                        </nav>
                      </div>
                      
                      {/* Tab Content */}
                      <div className="mt-6">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                          <form onSubmit={handleProfileUpdate}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  id="first-name"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  id="last-name"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  value={email}
                                  disabled
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 sm:text-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  Email cannot be changed. Contact support for assistance.
                                </p>
                              </div>
                              <div>
                                <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Job Title
                                </label>
                                <input
                                  type="text"
                                  id="job-title"
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Department
                                </label>
                                <input
                                  type="text"
                                  id="department"
                                  value={department}
                                  onChange={(e) => setDepartment(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Phone Number
                                </label>
                                <input
                                  type="text"
                                  id="phone-number"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Bio
                              </label>
                              <textarea
                                id="bio"
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                              ></textarea>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Brief description about yourself.
                              </p>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        )}
                        
                        {/* Password Settings */}
                        {activeTab === 'password' && (
                          <form onSubmit={handlePasswordChange}>
                            <div className="space-y-6">
                              <div>
                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  id="current-password"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  id="new-password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Confirm New Password
                                </label>
                                <input
                                  type="password"
                                  id="confirm-password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
                              </p>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Change Password
                              </button>
                            </div>
                          </form>
                        )}
                        
                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                          <form onSubmit={handleNotificationSettingsUpdate}>
                            <div className="space-y-6">
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="email-notifications"
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                                  <p className="text-gray-500 dark:text-gray-400">Receive notifications about timesheet approvals, reminders, and system updates via email.</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="browser-notifications"
                                    type="checkbox"
                                    checked={browserNotifications}
                                    onChange={(e) => setBrowserNotifications(e.target.checked)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="browser-notifications" className="font-medium text-gray-700 dark:text-gray-300">Browser Notifications</label>
                                  <p className="text-gray-500 dark:text-gray-400">Receive browser notifications when you&apos;re using the application.</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Save Preferences
                              </button>
                            </div>
                          </form>
                        )}
                        
                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Theme</h3>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Choose between light and dark theme for the application.
                              </p>
                              
                              <div className="mt-4 flex items-center">
                                <button
                                  onClick={toggleDarkMode}
                                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                  }`}
                                >
                                  <span className="sr-only">Toggle theme</span>
                                  <span
                                    className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      isDarkMode ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  >
                                    <span
                                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                        isDarkMode ? 'opacity-0' : 'opacity-100'
                                      }`}
                                    >
                                      <FaSun className="h-3 w-3 text-gray-400" />
                                    </span>
                                    <span
                                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                        isDarkMode ? 'opacity-100' : 'opacity-0'
                                      }`}
                                    >
                                      <FaMoon className="h-3 w-3 text-blue-600" />
                                    </span>
                                  </span>
                                </button>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
