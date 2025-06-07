'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { apiRequest, User, TimeEntry } from '@/lib/api';
import { Header, PageLoader, Sidebar } from '../components';

export default function Timesheet() {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date()); const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]); const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  // Get days of the current week (memoized to prevent infinite re-renders)
  const daysOfWeek = useMemo(() => {
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

    return getDaysOfWeek(new Date(currentWeek));
  }, [currentWeek]);

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
  // Fetch time entries for the current week
  const fetchTimeEntries = useCallback(async () => {
    try {
      setIsLoading(true);

      // Calculate start and end dates for the week
      const startDate = formatDate(daysOfWeek[0]);
      const endDate = formatDate(daysOfWeek[6]);

      // Fetch time entries from API
      const data = await apiRequest(`/timekeeping/time-entries/?start_date=${startDate}&end_date=${endDate}`); setTimeEntries(data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching time entries:', err);
      setError('Failed to load timesheet data');
      setIsLoading(false);

      // Show error notification
      toast.error('Failed to load timesheet data. Please try again.');
    }
  }, [daysOfWeek]);
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
  }, [router]);

  // Separate useEffect for fetching timesheet data when week changes
  useEffect(() => {
    fetchTimeEntries();
  }, [fetchTimeEntries]);

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
    setCurrentWeek(nextWeek);  };

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
    return <PageLoader message="Loading timesheet..." size="lg" />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">      {/* Animated Gradient Circles & Floating Icons - Responsive */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-4 left-4 w-32 h-32 sm:top-10 sm:left-10 sm:w-72 sm:h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-4 w-40 h-40 sm:top-40 sm:right-10 sm:w-96 sm:h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>        <div className="absolute bottom-10 left-1/4 w-36 h-36 sm:bottom-20 sm:left-1/3 sm:w-80 sm:h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <Header user={user} />      
      <div className="py-6 sm:py-10 relative z-10">
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
            <Sidebar />

            {/* Main Content */}
            <section className="flex-1 min-w-0">
              <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">                {/* Header with Week Navigation */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 break-words">
                      Weekly Timesheet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">Track your time entries for the week</p>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 bg-white/50 dark:bg-gray-700/50 rounded-xl p-2 sm:p-3 w-full lg:w-auto">
                    <button
                      onClick={goToPreviousWeek}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-600/50 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <FaChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-2 bg-white/60 dark:bg-gray-600/60 rounded-lg text-center flex-1 lg:flex-none">
                      {daysOfWeek[0]?.toLocaleDateString()} - {daysOfWeek[6]?.toLocaleDateString()}
                    </span>
                    <button
                      onClick={goToNextWeek}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-600/50 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <FaChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 bg-red-50/80 dark:bg-red-900/60 backdrop-blur-md border border-red-200/50 dark:border-red-700/50 rounded-xl p-4">
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
                {/* Timesheet Table */}
                <div className="overflow-x-auto rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/40 dark:to-purple-900/40">
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Clock In</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Clock Out</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Project</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      {entriesByDay.map((day) => (
                        day.entries.length > 0 ? (day.entries.map((entry: TimeEntry, entryIndex: number) => (
                          <tr key={entry.id || entryIndex} className="hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {entryIndex === 0 ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs sm:text-sm">{day.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                </div>
                              ) : ''}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300">{formatTime(entry.clock_in)}</td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">{formatTime(entry.clock_out)}</td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-lg text-xs">
                                {calculateDuration(entry.clock_in, entry.clock_out)}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">{entry.project?.name || '-'}</td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate hidden lg:table-cell">{entry.notes || '-'}</td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-1 sm:space-x-2">
                                <button className="p-1.5 sm:p-2 rounded-lg text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
                                  <FaEdit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                                <button className="p-1.5 sm:p-2 rounded-lg text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
                                  <FaTrash className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                        ) : (
                          <tr key={day.date.toISOString()} className="hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <span className="text-xs sm:text-sm">{day.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic" colSpan={6}>
                              No time entries for this day
                            </td>
                          </tr>
                        )))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-800/60 dark:to-blue-900/40">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">Total Weekly Hours</td>
                        <td colSpan={2} className="hidden sm:table-cell"></td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-bold">
                          <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs sm:text-sm">
                            {totalWeeklyHours.toFixed(2)}h
                          </span>
                        </td>
                        <td colSpan={3} className="hidden md:table-cell"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>                
                {/* Add Time Entry Button */}
                <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-h-[44px]">
                    <FaPlus className="mr-2 h-4 w-4" />
                    Add Time Entry
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
