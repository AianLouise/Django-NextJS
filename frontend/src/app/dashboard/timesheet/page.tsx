'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaTimes, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { apiRequest, logout, User, TimeEntry } from '@/lib/api';

export default function Timesheet() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  
  // Notification state
  interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Get days of the current week
  const getDaysOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      days.push(nextDay);
    }
    
    return days;
  };
  
  const daysOfWeek = getDaysOfWeek(currentWeek);
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
    // Format time as HH:MM
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate duration between two times
  const calculateDuration = (start: string, end: string | undefined) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
    // Show notification function
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) => {
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
  }, []);
    // Dismiss notification function
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Fetch time entries for the current week
  const fetchTimeEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Calculate start and end dates for the week
      const startDate = formatDate(daysOfWeek[0]);
      const endDate = formatDate(daysOfWeek[6]);
      
      // Fetch time entries from API
      const data = await apiRequest(`/timekeeping/time-entries/?start_date=${startDate}&end_date=${endDate}`);
      
      setTimeEntries(data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching time entries:', err);
      setError('Failed to load timesheet data');
      setIsLoading(false);
      
      // Show error notification
      showNotification('Failed to load timesheet data. Please try again.', 'error');
    }
  }, [daysOfWeek, showNotification]);
  
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
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data');
      }
    }
      // Fetch timesheet data
    fetchTimeEntries();
  }, [router, fetchTimeEntries]);
  
  // Move to previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };
  
  // Move to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };
  
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
    // Get entries for a specific day
  const getEntriesForDay = (date: Date) => {
    const formattedDate = formatDate(date);
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.clock_in).toISOString().split('T')[0];
      return entryDate === formattedDate;
    });
  };
  
  // Group entries by day
  const entriesByDay = daysOfWeek.map(day => ({
    date: day,
    entries: getEntriesForDay(day),
  }));
  
  // Calculate total hours for the week
  const totalWeeklyHours = timeEntries.reduce((total, entry) => {
    if (entry.clock_in && entry.clock_out) {
      const start = new Date(entry.clock_in);
      const end = new Date(entry.clock_out);
      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + diffHours;
    }
    return total;
  }, 0);
  
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
                      className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
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
                    <div className="px-4 py-5 sm:p-6">                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Timesheet</h2>
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={goToPreviousWeek}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FaChevronLeft className="h-5 w-5" />
                          </button>                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {daysOfWeek[0]?.toLocaleDateString()} - {daysOfWeek[6]?.toLocaleDateString()}
                          </span>
                          <button 
                            onClick={goToNextWeek}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <FaChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>                      {/* Error Display */}
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
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clock In</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clock Out</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">                            {entriesByDay.map((day) => (
                              day.entries.length > 0 ? (
                                day.entries.map((entry: TimeEntry, entryIndex: number) => (
                                  <tr key={entry.id || entryIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                      {entryIndex === 0 ? day.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatTime(entry.clock_in)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatTime(entry.clock_out)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{calculateDuration(entry.clock_in, entry.clock_out)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{entry.project?.name || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">{entry.notes || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                        <FaEdit />
                                      </button>
                                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                        <FaTrash />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr key={day.date.toISOString()} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {day.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={6}>
                                    No time entries for this day
                                  </td>
                                </tr>
                              )
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Total</td>
                              <td colSpan={2}></td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {totalWeeklyHours.toFixed(2)} hours
                              </td>
                              <td colSpan={3}></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button 
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaPlus className="mr-2 -ml-1 h-5 w-5" />
                          Add Time Entry
                        </button>
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
