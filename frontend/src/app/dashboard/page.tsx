'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { apiRequest, User, TimeEntry } from '@/lib/api';
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
  if (isLoading) {
    return <PageLoader message="Loading dashboard..." size="lg" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Gradient Circles & Floating Icons - Responsive */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-5 sm:top-40 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/4 sm:bottom-20 sm:left-1/3 w-56 h-56 sm:w-80 sm:h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <Header user={user} />
      <div className="py-4 sm:py-6 lg:py-10 relative z-10">
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 lg:gap-8">
            <Sidebar />

            {/* Main Content */}
            <section className="flex-1 min-w-0">
              <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
                  Time Tracking
                </h2>

                {/* Main Clock Section */}
                <div className="text-center py-4 sm:py-6">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-2">
                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>

                  {/* Clock In/Out Button */}
                  <button
                    onClick={handleClockInOut}
                    className={`${isClockedIn
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                      } text-white py-3 sm:py-4 px-8 sm:px-12 rounded-full text-lg sm:text-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto`}
                  >
                    {isClockedIn ? 'Clock Out' : 'Clock In'}
                  </button>

                  {/* Clock Status */}
                  {isClockedIn && clockInTime && (
                    <div className="mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-200 px-2">
                      <div className="font-medium">
                        Clocked in at {clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {activeTimeEntry?.project && (
                        <div className="mt-1">
                          Project: <span className="font-semibold">{activeTimeEntry.project.name}</span>
                        </div>
                      )}
                      {activeTimeEntry?.notes && (
                        <div className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">
                          {activeTimeEntry.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 shadow border border-red-200 dark:border-red-700/30">
                    <div className="flex items-start">
                      <FaTimes className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm sm:text-base font-medium text-red-800 dark:text-red-400 break-words">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Activity Cards */}
                <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Recent Activity Card */}
                  <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-xl lg:rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {recentEntries && recentEntries.length > 0 ? (
                        recentEntries.slice(0, 3).map((entry) => (
                          <div key={entry.id} className="flex items-start space-x-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-words">
                                {entry.clock_out ? 'Clocked out' : 'Clocked in'}
                                {entry.project && ` - ${entry.project.name}`}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(entry.clock_out || entry.clock_in).toLocaleDateString([], {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {entry.duration_formatted && entry.clock_out && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  Duration: {entry.duration_formatted}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            No recent activity found
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weekly Summary Card */}
                  <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-xl lg:rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">Weekly Summary</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Hours this week</span>
                        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">32.5 / 40</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: '81%' }}></div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Overtime</span>
                          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">0 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Projects</span>
                          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">3 active</span>
                        </div>
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
