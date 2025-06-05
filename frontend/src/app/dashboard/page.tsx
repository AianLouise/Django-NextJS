'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaTimes } from 'react-icons/fa';
import { apiRequest, logout, User, TimeEntry } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTimeEntry, setActiveTimeEntry] = useState<TimeEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch dashboard data from API
      const data = await apiRequest('/timekeeping/dashboard/');

      // Update state with dashboard data
      if (data.active_time_entry) {
        setActiveTimeEntry(data.active_time_entry);
        setIsClockedIn(true);
        setClockInTime(new Date(data.active_time_entry.clock_in));
      }

      setRecentEntries(data.recent_time_entries || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setIsLoading(false);
      toast.error('Failed to load dashboard data. Please refresh the page.');
    }
  }, []);

  // Check authentication and load user data
  useEffect(() => {
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

        // Show welcome notification
        // Only show welcome notification if this is not a page refresh
        const isInitialLoad = sessionStorage.getItem('dashboard_loaded') !== 'true';
        if (isInitialLoad) {
          const firstName = parsedUser.first_name || 'User';
          toast('Welcome back, ' + firstName + '!', { icon: '👋', duration: 3000 });
          // Set flag to prevent duplicate notifications on refresh
          sessionStorage.setItem('dashboard_loaded', 'true');
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data');
      }
    }
    // Fetch dashboard data
    fetchDashboardData();
  }, [router, fetchDashboardData]);
  const handleClockInOut = async () => {
    try {
      if (isClockedIn) {
        // Clock out
        await apiRequest('/timekeeping/clock-out/', {
          method: 'POST',
          body: {},
        });

        // Reset state
        setIsClockedIn(false);
        setClockInTime(null);
        setActiveTimeEntry(null);
        toast.success('Successfully clocked out!');
      } else {
        // Clock in
        const data = await apiRequest('/timekeeping/clock-in/', {
          method: 'POST',
          body: {},
        });

        // Update state
        const now = new Date();
        setCurrentTime(now);
        setClockInTime(now);
        setIsClockedIn(true);
        setActiveTimeEntry(data);
        toast.success('Successfully clocked in!');
      }

      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error('Clock in/out error:', err);
      setError('Failed to clock in/out. Please try again.');
      toast.error('Failed to clock in/out. Please try again.');
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!', { duration: 2000 });
      // Short delay to show the notification before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <div className="flex items-center">              <button
              onClick={() => toast('You have no new notifications', { icon: '🔔' })}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">View notifications</span>
              <FaBell className="h-6 w-6" />
            </button><div className="ml-3 relative">
                <div className="flex items-center">
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {user ? `${user.first_name} ${user.last_name}` : 'User'}
                  </span>
                </div>
              </div><button
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
                      className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
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
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaCog className="mr-3 h-5 w-5" />
                      Settings
                    </Link>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 md:ml-8">
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Time Tracking</h2>

                      <div className="text-center py-6">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>

                        <button
                          onClick={handleClockInOut}
                          className={`${isClockedIn
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                            } text-white py-3 px-8 rounded-full text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          {isClockedIn ? 'Clock Out' : 'Clock In'}
                        </button>
                        {isClockedIn && clockInTime && (
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                            Clocked in at {clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {activeTimeEntry?.project && (
                              <div className="mt-1">
                                Project: <span className="font-medium">{activeTimeEntry.project.name}</span>
                              </div>
                            )}                            {activeTimeEntry?.notes && (
                              <div className="mt-1 text-xs">
                                {activeTimeEntry.notes}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaTimes className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800 dark:text-red-400">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h3>
                        <div className="space-y-3">
                          {recentEntries && recentEntries.length > 0 ? (
                            recentEntries.slice(0, 3).map((entry) => (
                              <div key={entry.id} className="flex items-start">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {entry.clock_out ? 'Clocked out' : 'Clocked in'}
                                    {entry.project && ` - ${entry.project.name}`}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(entry.clock_out || entry.clock_in).toLocaleDateString([], {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  {entry.duration_formatted && entry.clock_out && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                      Duration: {entry.duration_formatted}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                No recent activity found
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Weekly Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Hours this week</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">32.5 / 40</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '81%' }}></div>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Overtime</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">0 hours</span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Projects</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">3 active</span>
                          </div>
                        </div>
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
