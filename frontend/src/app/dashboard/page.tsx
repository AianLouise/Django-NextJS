'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaTimes } from 'react-icons/fa';
import { apiRequest, logout } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTimeEntry, setActiveTimeEntry] = useState<any>(null);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Notification state
  interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);
    // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
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
          showNotification(`Welcome back, ${firstName}!`, 'info', 3000);
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
  }, [router]);
  const fetchDashboardData = async () => {
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
      
      // Show error notification
      showNotification('Failed to load dashboard data. Please refresh the page.', 'error');
    }
  };
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
        
        // Show success notification
        showNotification('Successfully clocked out!', 'success');
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
        
        // Show success notification
        showNotification('Successfully clocked in!', 'success');
      }
      
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error('Clock in/out error:', err);
      setError('Failed to clock in/out. Please try again.');
      
      // Show error notification
      showNotification('Failed to clock in/out. Please try again.', 'error');
    }
  };
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
  
  if (isLoading) {
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
            <div className="flex items-center">              <button 
                onClick={() => showNotification('You have no new notifications', 'info')}
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
                          className={`${
                            isClockedIn 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white py-3 px-8 rounded-full text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          {isClockedIn ? 'Clock Out' : 'Clock In'}
                        </button>
                        
                        {isClockedIn && clockInTime && (
                          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                            Clocked in at {clockInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h3>
                        <div className="space-y-3">
                          {/* Activity items */}
                          <div className="flex items-start">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Yesterday's timesheet approved
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                June 3, 2025 at 5:30 PM
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Clocked out
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                June 3, 2025 at 5:15 PM
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Clocked in
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                June 3, 2025 at 9:00 AM
                              </p>
                            </div>
                          </div>
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
