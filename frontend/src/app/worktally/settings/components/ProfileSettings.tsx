'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { User } from '@/lib/api';

interface ProfileSettingsProps {
    user: User | null;
    setUser: (user: User | null) => void;
    setError: (error: string) => void;
    setIsLoading: (loading: boolean) => void;
}

export default function ProfileSettings({ user, setUser, setError, setIsLoading }: ProfileSettingsProps) {
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email] = useState(user?.email || '');
    const [jobTitle, setJobTitle] = useState(user?.job_title || '');
    const [department, setDepartment] = useState(user?.department || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
    const [bio, setBio] = useState((user as User & { profile?: { bio?: string } })?.profile?.bio || '');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            // Prepare profile data
            const profileData = {
                first_name: firstName,
                last_name: lastName,
                job_title: jobTitle,
                department: department,
                phone_number: phoneNumber,
            };
            // Update profile via API
            try {
                // For now, just log the profile data (simulating API call)
                console.log('Profile data to be sent:', profileData);
                // Uncomment when API endpoint is ready:
                // const data = await apiRequest('/users/update-profile/', {
                //   method: 'PUT',
                //   body: profileData,
                // });
            } catch (apiError) {
                console.error('Profile update API error:', apiError);
                throw apiError;
            }
            // Update user data in local storage
            if (user) {
                const updatedUser = {
                    ...user,
                    first_name: firstName,
                    last_name: lastName,
                    job_title: jobTitle,
                    department: department,
                    phone_number: phoneNumber,
                };

                localStorage.setItem('user_data', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
            setIsLoading(false);
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
            setIsLoading(false);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/30">
            <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="first-name"
                            value={firstName}
                            placeholder='Enter your first name'
                            onChange={(e) => setFirstName(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="last-name"
                            value={lastName}
                            placeholder='Enter your last name'
                            onChange={(e) => setLastName(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder='Enter your email address'
                            disabled
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-gray-100/70 dark:bg-gray-600/50 text-gray-500 dark:text-gray-400 text-sm backdrop-blur-sm"
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Email cannot be changed. Contact support for assistance.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="job-title" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Job Title
                        </label>
                        <input
                            type="text"
                            id="job-title"
                            value={jobTitle}
                            placeholder='Enter your job title'
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="department" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Department
                        </label>
                        <input
                            type="text"
                            id="department"
                            value={department}
                            placeholder='Enter your department'
                            onChange={(e) => setDepartment(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone-number" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone-number"
                            value={phoneNumber}
                            placeholder='Enter your phone number'
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label htmlFor="bio" className="block p-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        rows={4}
                        value={bio}
                        placeholder='Tell us about yourself'
                        onChange={(e) => setBio(e.target.value)}
                        className="block p-3 w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700/50 dark:text-white backdrop-blur-sm bg-white/70 transition-all duration-200"
                    ></textarea>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
