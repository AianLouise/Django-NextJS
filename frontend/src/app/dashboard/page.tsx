'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaClock, FaCalendarAlt, FaChartBar, FaTimes } from 'react-icons/fa';
import { apiRequest, logout, User, TimeEntry } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Header, Sidebar, PageLoader } from './components';

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
    return <PageLoader message="Loading dashboard..." size="lg" />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Gradient Circles & Floating Icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-20 right-1/4 text-blue-300 dark:text-blue-500 opacity-20 animate-float">
          <FaClock className="text-6xl" />
        </div>
        <div className="absolute bottom-32 left-1/4 text-purple-300 dark:text-purple-500 opacity-20 animate-float animation-delay-1000">
          <FaChartBar className="text-5xl" />
        </div>
        <div className="absolute top-1/3 left-20 text-pink-300 dark:text-pink-500 opacity-20 animate-float animation-delay-3000">
          <FaCalendarAlt className="text-4xl" />
        </div>
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
                  Time Tracking
                </h2>
                <div className="text-center py-6">
                  <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-lg text-gray-500 dark:text-gray-400 mb-6">
                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <button
                    onClick={handleClockInOut}
                    className={`${isClockedIn
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                      } text-white py-4 px-12 rounded-full text-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isClockedIn ? 'Clock Out' : 'Clock In'}
                  </button>
                  {isClockedIn && clockInTime && (
                    <div className="mt-4 text-base text-gray-700 dark:text-gray-200">
                      Clocked in at {clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {activeTimeEntry?.project && (
                        <div className="mt-1">
                          Project: <span className="font-semibold">{activeTimeEntry.project.name}</span>
                        </div>
                      )}
                      {activeTimeEntry?.notes && (
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {activeTimeEntry.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Error Message */}
                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 shadow border border-red-200 dark:border-red-700/30">
                    <div className="flex items-center">
                      <FaTimes className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-base font-medium text-red-800 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentEntries && recentEntries.length > 0 ? (
                        recentEntries.slice(0, 3).map((entry) => (
                          <div key={entry.id} className="flex items-start">
                            <div className="min-w-0 flex-1">
                              <p className="text-base font-semibold text-gray-900 dark:text-white">
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
                          <p className="text-base text-gray-500 dark:text-gray-400">
                            No recent activity found
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Weekly Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-base text-gray-500 dark:text-gray-400">Hours this week</span>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">32.5 / 40</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full" style={{ width: '81%' }}></div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-base text-gray-500 dark:text-gray-400">Overtime</span>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">0 hours</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-base text-gray-500 dark:text-gray-400">Projects</span>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">3 active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
