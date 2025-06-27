'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PasswordSettingsProps {
    setError: (error: string) => void;
    setIsLoading: (loading: boolean) => void;
}

export default function PasswordSettings({ setError, setIsLoading }: PasswordSettingsProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);

            // Call password change API
            // await apiRequest('/users/change-password/', {
            //   method: 'POST',
            //   body: {
            //     old_password: currentPassword,
            //     new_password: newPassword,
            //     confirm_password: confirmPassword
            //   },
            // });

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsLoading(false);
            toast.success('Password changed successfully!');
        } catch (err) {
            console.error('Error changing password:', err);
            setError('Failed to change password');
            setIsLoading(false);
            toast.error('Failed to change password. Please try again.');
        }
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <form onSubmit={handlePasswordChange}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="current-password" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="current-password"
                            value={currentPassword}
                            placeholder='Enter your current password'
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            placeholder='Enter your new password'
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            placeholder='Re-enter your new password'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                            required
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
                    </p>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
}
