'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuUser, LuLock, LuBell, LuMonitor, LuBadgeAlert } from 'react-icons/lu';
import { User } from '../../../lib/api'; // Adjust the import path as needed
import ProfileSettings from './components/ProfileSettings';
import PasswordSettings from './components/PasswordSettings';
import NotificationSettings from './components/NotificationSettings';
import AppearanceSettings from './components/AppearanceSettings';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [isDarkMode, setIsDarkMode] = useState(false);

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
        }        if (userData) {
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

    if (isLoading) {
        return (
            <div className="min-w-0">
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">                    <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading settings...</span>
                </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-0">
            <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 break-words">
                    Settings
                </h2>
                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-md border border-red-200/50 dark:border-red-700/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <LuBadgeAlert className="h-5 w-5 text-red-400" />
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
                <div className="mb-8">
                    <nav className="flex items-center gap-2 sm:gap-8">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`${activeTab === 'profile'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                } py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm flex items-center transition-all duration-300 ease-out min-h-[44px] touch-manipulation group`}
                        >
                            <LuUser className="mr-2 h-4 w-4 transition-transform duration-300" />
                            <span>Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`${activeTab === 'password'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                } py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm flex items-center transition-all duration-300 ease-out min-h-[44px] touch-manipulation group`}
                        >
                            <LuLock className="mr-2 h-4 w-4 transition-transform duration-300" />
                            <span>Password</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`${activeTab === 'notifications'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                } py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm flex items-center transition-all duration-300 ease-out min-h-[44px] touch-manipulation group`}
                        >
                            <LuBell className="mr-2 h-4 w-4 transition-transform duration-300" />
                            <span>Notifications</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`${activeTab === 'appearance'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                } py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm flex items-center transition-all duration-300 ease-out min-h-[44px] touch-manipulation group`}
                        >
                            <LuMonitor className="mr-2 h-4 w-4 transition-transform duration-300" />
                            <span>Appearance</span>
                        </button>
                    </nav>
                </div>                {/* Tab Content */}
                <div className="mt-8">
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <ProfileSettings
                            user={user}
                            setUser={setUser}
                            setError={setError}
                            setIsLoading={setIsLoading}
                        />
                    )}

                    {/* Password Settings */}
                    {activeTab === 'password' && (
                        <PasswordSettings
                            setError={setError}
                            setIsLoading={setIsLoading}
                        />
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <NotificationSettings
                            setError={setError}
                            setIsLoading={setIsLoading}
                        />
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <AppearanceSettings
                            isDarkMode={isDarkMode}
                            setIsDarkMode={setIsDarkMode}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
