'use client';

import { toast } from 'react-hot-toast';
import { LuPalette, LuSettings, LuMoon, LuSun } from 'react-icons/lu';

interface AppearanceSettingsProps {
    isDarkMode: boolean;
    setIsDarkMode: (darkMode: boolean) => void;
}

export default function AppearanceSettings({ isDarkMode, setIsDarkMode }: AppearanceSettingsProps) {
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        // Store preference
        localStorage.setItem('darkMode', newMode.toString());

        // Apply to document
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        toast.success(`${newMode ? 'Dark' : 'Light'} mode enabled`);
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <div className="space-y-8">
                <div className="p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/30 dark:border-indigo-700/30">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4">
                        <LuPalette className="mr-3 text-indigo-600 dark:text-indigo-400" />
                        Theme Preferences
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Choose between light and dark theme for the application interface.
                    </p>

                    <div className="flex items-center justify-between p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-white/40 dark:border-gray-700/40">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-100'}`}>
                                {isDarkMode ? (
                                    <LuMoon className="h-6 w-6 text-blue-400" />
                                ) : (
                                    <LuSun className="h-6 w-6 text-yellow-500" />
                                )}
                            </div>
                            <div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {isDarkMode ? 'Dark theme is easier on the eyes' : 'Light theme for better visibility'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                                } hover:scale-105 transform`}
                        >
                            <span className="sr-only">Toggle theme</span>
                            <span
                                className={`pointer-events-none relative inline-block p-1 h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            >
                                <span
                                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ${isDarkMode ? 'opacity-0' : 'opacity-100'
                                        }`}
                                >
                                    <LuSun className="h-4 w-4 text-yellow-500" />
                                </span>
                                <span
                                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ${isDarkMode ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <LuMoon className="h-4 w-4 text-blue-600" />
                                </span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Additional appearance options placeholder */}
                <div className="p-6 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                        <LuSettings className="mr-2 text-emerald-600 dark:text-emerald-400" />
                        Interface Settings
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Additional interface customization options will be available in future updates.
                    </p>
                </div>
            </div>
        </div>
    );
}
