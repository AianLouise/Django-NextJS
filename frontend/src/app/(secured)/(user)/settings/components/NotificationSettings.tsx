'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { LuMail, LuBell, LuSave } from 'react-icons/lu';

interface NotificationSettingsProps {
    setError: (error: string) => void;
    setIsLoading: (loading: boolean) => void;
}

export default function NotificationSettings({ setError, setIsLoading }: NotificationSettingsProps) {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [browserNotifications, setBrowserNotifications] = useState(true);

    const handleNotificationSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            // Call notification settings API
            // await apiRequest('/users/notification-settings/', {
            //   method: 'POST',
            //   body: {
            //     email_notifications: emailNotifications,
            //     browser_notifications: browserNotifications
            //   },
            // });
            setIsLoading(false);
            toast.success('Notification settings updated successfully!');
        } catch (err) {
            console.error('Error updating notification settings:', err);
            setError('Failed to update notification settings');
            setIsLoading(false);
            toast.error('Failed to update notification settings. Please try again.');
        }
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <form onSubmit={handleNotificationSettingsUpdate}>
                <div className="space-y-8">
                    <div className="flex items-start p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                        <div className="flex items-center h-5">
                            <input
                                id="email-notifications"
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                            />
                        </div>
                        <div className="ml-4">
                            <label htmlFor="email-notifications" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <LuMail className="mr-2 text-blue-600 dark:text-blue-400" />
                                Email Notifications
                            </label>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Receive notifications about timesheet approvals, reminders, and system updates via email.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start p-6 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200/30 dark:border-green-700/30">
                        <div className="flex items-center h-5">
                            <input
                                id="browser-notifications"
                                type="checkbox"
                                checked={browserNotifications}
                                onChange={(e) => setBrowserNotifications(e.target.checked)}
                                className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                            />
                        </div>
                        <div className="ml-4">
                            <label htmlFor="browser-notifications" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <LuBell className="mr-2 text-green-600 dark:text-green-400" />
                                Browser Notifications
                            </label>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Receive browser notifications when you&apos;re using the application.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                    >
                        <LuSave className="mr-2 h-4 w-4" />
                        Save Preferences
                    </button>
                </div>
            </form>
        </div>
    );
}
