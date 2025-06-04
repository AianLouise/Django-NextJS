'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaTimes, FaDownload, FaFilter } from 'react-icons/fa';
import { apiRequest, logout, User } from '@/lib/api';

// Define interfaces for report data
interface ReportData {
  total_hours: number;
  total_entries: number;
  projects: {
    name: string;
    hours: number;
    percentage: number;
  }[];
  daily_breakdown: {
    date: string;
    hours: number;
  }[];
}

export default function Reports() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  
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
  
  // Initialize date range on component mount
  useEffect(() => {
    // Set default dates (current week)
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    
    const mondayOfWeek = new Date(today.setDate(diff));
    const sundayOfWeek = new Date(mondayOfWeek);
    sundayOfWeek.setDate(mondayOfWeek.getDate() + 6);
    
    setStartDate(formatDate(mondayOfWeek));
    setEndDate(formatDate(sundayOfWeek));
  }, []);
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
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
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data');
      }
    }
    
    setIsLoading(false);
  }, [router]);
  
  // Generate report
  const generateReport = async () => {
    try {
      setIsLoading(true);
      
      // Fetch report data from API
      const data = await apiRequest(`/timekeeping/reports/?type=${reportType}&start_date=${startDate}&end_date=${endDate}`);
      
      setReportData(data);
      setIsLoading(false);
      showNotification('Report generated successfully!', 'success');
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report');
      setIsLoading(false);
      
      // Show error notification
      showNotification('Failed to generate report. Please try again.', 'error');
    }
  };
  
  // Export report
  const exportReport = () => {
    showNotification('Report exported successfully!', 'success');
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
  
  // Handle report type change
  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    
    // Update date range based on report type
    const today = new Date();
    
    if (e.target.value === 'weekly') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      
      const mondayOfWeek = new Date(new Date().setDate(diff));
      const sundayOfWeek = new Date(mondayOfWeek);
      sundayOfWeek.setDate(mondayOfWeek.getDate() + 6);
      
      setStartDate(formatDate(mondayOfWeek));
      setEndDate(formatDate(sundayOfWeek));
    } else if (e.target.value === 'monthly') {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setStartDate(formatDate(firstDayOfMonth));
      setEndDate(formatDate(lastDayOfMonth));
    } else if (e.target.value === 'yearly') {
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
      
      setStartDate(formatDate(firstDayOfYear));
      setEndDate(formatDate(lastDayOfYear));
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
                      className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
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
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Reports</h2>
                      
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
                      
                      {/* Report Filters */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Report Options</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Report Type
                            </label>
                            <select
                              id="report-type"
                              value={reportType}
                              onChange={handleReportTypeChange}
                              className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="custom">Custom Date Range</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              id="start-date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              id="end-date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-white"
                            />
                          </div>
                          
                          <div className="flex items-end">
                            <button
                              onClick={generateReport}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FaFilter className="mr-2 -ml-1 h-4 w-4" />
                              Generate Report
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Report Content */}
                      {reportData ? (
                        <>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-medium text-gray-900 dark:text-white">
                              Report Results: {startDate} to {endDate}
                            </h3>
                            <button
                              onClick={exportReport}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FaDownload className="mr-2 -ml-1 h-4 w-4" />
                              Export
                            </button>
                          </div>
                          
                          {/* Report Charts */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Hours by Day</h4>
                            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400">Chart visualization placeholder</span>
                            </div>
                          </div>
                          
                          {/* Report Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</h4>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">40.5</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Daily Hours</h4>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">8.1</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overtime Hours</h4>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">0.5</p>
                            </div>
                          </div>
                          
                          {/* Detailed Report Table */}
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead>
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hours</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">June 1, 2025</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">8.0</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Website Development</td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">June 2, 2025</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">8.5</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Mobile App Design</td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">June 3, 2025</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">8.0</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">API Integration</td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">June 4, 2025</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">8.0</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Testing</td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">June 5, 2025</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">8.0</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Documentation</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <div className="py-12 text-center">
                          <FaChartBar className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No report generated</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Select your report options and click Generate Report to see your time data.
                          </p>
                        </div>
                      )}
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
