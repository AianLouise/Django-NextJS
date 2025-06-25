'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuClock, LuChartBar, LuDownload, LuFilter } from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import { apiRequest, User } from '@/lib/api';

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

export default function ReportsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState('');
    const [reportType, setReportType] = useState('weekly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState<ReportData | null>(null);

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
            setIsGeneratingReport(true);
            setError('');

            // Fetch report data from API
            const data = await apiRequest(`/timekeeping/reports/?type=${reportType}&start_date=${startDate}&end_date=${endDate}`);
            setReportData(data);
            toast.success('Report generated successfully!');
        } catch (err) {
            console.error('Error generating report:', err);
            setError('Failed to generate report');

            // Show error notification
            toast.error('Failed to generate report. Please try again.');
        } finally {
            setIsGeneratingReport(false);
        }
    };

    // Export report
    const exportReport = async () => {
        try {
            setIsExporting(true);
            // Simulate export delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Report exported successfully!');
        } catch {
            toast.error('Failed to export report. Please try again.');
        } finally {
            setIsExporting(false);
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
            <div className="space-y-6">
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading reports...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 break-words">
                    Reports & Analytics
                </h2>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 sm:mb-6 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-md border border-red-200/50 dark:border-red-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
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
                <div className={`bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/20 dark:border-gray-700/30 shadow-lg relative ${isGeneratingReport ? 'opacity-75' : ''}`}>
                    {isGeneratingReport && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl z-10 flex items-center justify-center">
                            <div className="text-center">
                                <LuClock className="animate-spin text-blue-600 dark:text-blue-400 text-2xl mx-auto mb-2" />
                                <p className="text-blue-600 dark:text-blue-400 font-medium">Processing...</p>
                            </div>
                        </div>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                        <LuFilter className="mr-2 text-blue-600" />
                        Report Options
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Report Type
                            </label>
                            <select
                                id="report-type"
                                value={reportType}
                                onChange={handleReportTypeChange}
                                disabled={isGeneratingReport}
                                className="block w-full p-3 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700/60 dark:text-white backdrop-blur-md bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="custom">Custom Date Range</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                disabled={isGeneratingReport}
                                className="block w-full p-3 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700/60 dark:text-white backdrop-blur-md bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={isGeneratingReport}
                                className="block w-full p-3 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700/60 dark:text-white backdrop-blur-md bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={generateReport}
                                disabled={isGeneratingReport}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 sm:px-6 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] disabled:transform-none"
                            >                {isGeneratingReport ? (
                                <div className="flex items-center justify-center">
                                    <LuClock className="animate-spin mr-2" />
                                    Generating...
                                </div>
                            ) : (
                                'Generate Report'
                            )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Content */}
                {isGeneratingReport ? (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Loading Skeleton for Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-gray-700/30 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-xl animate-pulse flex items-center justify-center">
                                            <LuClock className="text-gray-500 dark:text-gray-400 text-base sm:text-lg" />
                                        </div>
                                    </div>
                                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20"></div>
                                    </div>
                                </div>
                            </div>              <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-gray-700/30 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-xl animate-pulse flex items-center justify-center">
                                            <LuChartBar className="text-gray-500 dark:text-gray-400 text-base sm:text-lg" />
                                        </div>
                                    </div>
                                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-16"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Loading text */}
                        <div className="text-center py-4">
                            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <LuClock className="animate-spin mr-2" />
                                <span className="text-sm font-medium">Generating your report...</span>
                            </div>
                        </div>
                    </div>
                ) : reportData ? (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-gray-700/30 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                            <LuClock className="text-white text-base sm:text-lg" />
                                        </div>
                                    </div>
                                    <div className="ml-3 sm:ml-4 min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</p>
                                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{reportData.total_hours.toFixed(1)}h</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-gray-700/30 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <LuChartBar className="text-white text-base sm:text-lg" />
                                        </div>
                                    </div>
                                    <div className="ml-3 sm:ml-4 min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Entries</p>
                                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{reportData.total_entries}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Button */}
                        <div className="flex justify-center sm:justify-end">
                            <button
                                onClick={exportReport}
                                disabled={isExporting}
                                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 sm:px-6 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isExporting ? (
                                    <div className="flex items-center">
                                        <LuDownload className="animate-pulse mr-2" />
                                        Exporting...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <LuDownload className="mr-2" />
                                        Export Report
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Projects Breakdown */}
                        {reportData.projects && reportData.projects.length > 0 && (
                            <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-gray-700/30 shadow-lg">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Breakdown</h3>
                                <div className="space-y-4">
                                    {reportData.projects.map((project, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between text-sm mb-1 gap-1 sm:gap-0">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{project.name}</span>
                                                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{project.hours.toFixed(1)}h ({project.percentage.toFixed(1)}%)</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${project.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>) : (
                    <div className="text-center py-8 sm:py-12">
                        <LuChartBar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">No Report Generated</h3>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">Click &quot;Generate Report&quot; to view your time tracking analytics.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
