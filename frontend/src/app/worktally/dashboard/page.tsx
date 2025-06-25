'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    LuClock,
    LuPlay,
    LuSquare,
    LuCalendar,
    LuTrendingUp,
    LuCircleCheck,
    LuTriangleAlert
} from 'react-icons/lu';
import { apiRequest, User, TimeEntry, Project, TimeOffRequest } from '@/lib/api';

interface DashboardData {
    active_time_entry: TimeEntry | null;
    recent_time_entries: TimeEntry[];
    pending_time_off: TimeOffRequest[];
    active_projects: Project[];
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isClockingIn, setIsClockingIn] = useState(false);
    const [isClockingOut, setIsClockingOut] = useState(false);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Check authentication and load user data
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');

        if (!token) {
            window.location.href = '/login';
            return;
        }

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }

        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const data = await apiRequest('/timekeeping/dashboard/');
            setDashboardData(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockIn = async () => {
        // Validation: Check if already clocked in
        if (dashboardData?.active_time_entry) {
            toast.error('You are already clocked in. Please clock out first.');
            return;
        }

        // Validation: Check if user is authenticated
        const token = localStorage.getItem('auth_token');
        if (!token) {
            toast.error('Please log in to clock in.');
            window.location.href = '/login';
            return;
        }

        setIsClockingIn(true);
        try {
            await apiRequest('/timekeeping/clock-in/', {
                method: 'POST',
            });
            toast.success('Clocked in successfully!');
            loadDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error clocking in:', error);
            const message = error instanceof Error ? error.message : 'Failed to clock in. Please try again.';
            toast.error(message);
        } finally {
            setIsClockingIn(false);
        }
    };

    const handleClockOut = async () => {
        // Validation: Check if not clocked in
        if (!dashboardData?.active_time_entry) {
            toast.error('You are not currently clocked in. Please clock in first.');
            return;
        }

        // Validation: Check if user is authenticated
        const token = localStorage.getItem('auth_token');
        if (!token) {
            toast.error('Please log in to clock out.');
            window.location.href = '/login';
            return;
        }        // Validation: Check minimum work duration (optional - e.g., at least 1 minute)
        const clockInTime = new Date(dashboardData.active_time_entry.clock_in);
        const now = new Date();
        const workDuration = now.getTime() - clockInTime.getTime();
        const minimumDuration = 60 * 1000; // 1 minute in milliseconds

        if (workDuration < minimumDuration) {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <LuTriangleAlert className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Short Work Session</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        You have been clocked in for less than 1 minute. Are you sure you want to clock out?
                    </p>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                executeClockOut();
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                            Yes, Clock Out
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), {
                duration: 10000,
                position: 'top-center',
            });
            return;
        } performClockOut();
    };

    const performClockOut = async () => {
        // Final confirmation before clocking out
        toast((t) => (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <LuClock className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Confirm Clock Out</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to clock out? This will end your current work session.
                </p>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            executeClockOut();
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                        Yes, Clock Out
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 8000,
            position: 'top-center',
        });
    };

    const executeClockOut = async () => {
        setIsClockingOut(true);
        try {
            await apiRequest('/timekeeping/clock-out/', {
                method: 'POST',
            });
            toast.success('Clocked out successfully!');
            loadDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error clocking out:', error);
            const message = error instanceof Error ? error.message : 'Failed to clock out. Please try again.';
            toast.error(message);
        } finally {
            setIsClockingOut(false);
        }
    };

    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateWorkingTime = (clockIn: string) => {
        const start = new Date(clockIn);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Welcome back, {user?.first_name || user?.username}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono text-gray-900 dark:text-white">
                            {currentTime.toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Clock In/Out Section */}
            <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <LuClock className="mr-2" />
                    Time Tracking
                </h2>

                {dashboardData?.active_time_entry ? (
                    <div className="bg-green-50/80 dark:bg-green-900/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-green-800 dark:text-green-300 font-medium">Currently Working</p>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Started at {formatTime(dashboardData.active_time_entry.clock_in)}
                                </p>
                                <p className="text-lg font-mono text-green-900 dark:text-green-200 mt-2">
                                    {calculateWorkingTime(dashboardData.active_time_entry.clock_in)}
                                </p>
                            </div>
                            <button
                                onClick={handleClockOut}
                                disabled={isClockingOut}
                                className={`flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors ${isClockingOut ? 'opacity-70' : ''}`}
                            >
                                <LuSquare className="mr-2" />
                                {isClockingOut ? 'Clocking Out...' : 'Clock Out'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">Ready to Start Working</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Click the button to begin tracking your time
                                </p>
                            </div>
                            <button
                                onClick={handleClockIn}
                                disabled={isClockingIn}
                                className={`flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors ${isClockingIn ? 'opacity-70' : ''}`}
                            >
                                <LuPlay className="mr-2" />
                                {isClockingIn ? 'Clocking In...' : 'Clock In'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <LuTrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Entries</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {dashboardData?.recent_time_entries?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <LuCalendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Time Off</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {dashboardData?.pending_time_off?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${dashboardData?.active_time_entry ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                            <LuCircleCheck className={`h-6 w-6 ${dashboardData?.active_time_entry ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {dashboardData?.active_time_entry ? 'Working' : 'Available'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>

                {dashboardData?.recent_time_entries && dashboardData.recent_time_entries.length > 0 ? (
                    <div className="space-y-3">
                        {dashboardData.recent_time_entries.map((entry, index) => (
                            <div key={entry.id || index} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-500/10 rounded-lg mr-3">
                                        <LuClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(entry.clock_in).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatTime(entry.clock_in)} - {entry.clock_out ? formatTime(entry.clock_out) : 'In Progress'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {entry.clock_out && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {(() => {
                                                const start = new Date(entry.clock_in);
                                                const end = new Date(entry.clock_out);
                                                const diff = end.getTime() - start.getTime();
                                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                return `${hours}h ${minutes}m`;
                                            })()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>) : (
                    <div className="text-center py-8">
                        <LuTriangleAlert className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Activity</h3>
                        <p className="text-gray-600 dark:text-gray-400">Start tracking your time to see recent entries here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
