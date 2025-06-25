'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuClock, LuBell, LuLogOut, LuChevronDown, LuSettings } from 'react-icons/lu';
import { User, logout } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useState, useEffect, useRef, useCallback } from 'react';

interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps) {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownClosing, setIsDropdownClosing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);    // Handle smooth dropdown closing
    const closeDropdown = useCallback(() => {
        setIsDropdownClosing(true);
        setTimeout(() => {
            setIsDropdownOpen(false);
            setIsDropdownClosing(false);
        }, 150); // Match the animation duration
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (isDropdownOpen) {
                    closeDropdown();
                }
            }
        }; document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen, closeDropdown]);

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Successfully logged out!', { duration: 1500 });
            // Short delay to show the notification before redirecting
            setTimeout(() => {
                toast.dismiss(); // Clear all toasts before redirect
                router.push('/login');
            }, 1200);
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Error logging out. Please try again.');
        }
    };

    return (
        <header className="relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/30 animate-slideDown">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">

                {/* Logo Section */}
                <Link href="/" className="flex items-center space-x-4 group">
                    <div className="relative">
                        {/* Enhanced 3D Logo */}
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl transform rotate-3 group-hover:rotate-6">
                            <LuClock className="text-white text-xl drop-shadow-lg" />
                        </div>
                        {/* 3D depth shadow */}
                        <div className="absolute top-1 left-1 w-11 h-11 bg-gradient-to-br from-blue-800 to-purple-800 rounded-2xl opacity-40 -z-10 transform rotate-3"></div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-20"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 drop-shadow-sm">
                            WorkTally
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Smart Time Tracker</p>
                    </div>
                </Link>

                {/* Right Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Notifications Button */}
                    <button
                        onClick={() => toast('You have no new notifications', { icon: '🔔' })}
                        className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <span className="sr-only">View notifications</span>
                        <LuBell className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    {/* User Info */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => {
                                if (isDropdownOpen) {
                                    closeDropdown();
                                } else {
                                    setIsDropdownOpen(true);
                                }
                            }}
                            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            {/* User Avatar */}
                            <div className="relative">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm sm:text-base font-semibold">
                                        {user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : 'U'}
                                    </span>
                                </div>
                                {/* Online indicator */}
                                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>
                            </div>

                            {/* User Details */}
                            <div className="hidden sm:flex flex-col min-w-0">
                                <span className="text-gray-900 dark:text-white font-semibold text-sm leading-tight truncate">
                                    {user ? `${user.first_name} ${user.last_name}` : 'User'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs leading-tight truncate">
                                    {user?.email || 'user@example.com'}
                                </span>
                            </div>

                            {/* Mobile: Show only first name */}
                            <div className="sm:hidden">
                                <span className="text-gray-900 dark:text-white font-semibold text-sm">
                                    {user?.first_name || 'User'}
                                </span>
                            </div>

                            {/* Dropdown Arrow */}
                            <LuChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {(isDropdownOpen || isDropdownClosing) && (
                            <div className={`absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 ${isDropdownClosing ? 'animate-dropdown-out' : 'animate-dropdown'}`}>                                {/* User Info Header */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user ? `${user.first_name} ${user.last_name}` : 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email || 'user@example.com'}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            closeDropdown();
                                            toast('Profile settings coming soon!', { icon: '⚙️' });
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <LuSettings className="mr-3 h-4 w-4" />
                                        Profile Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            closeDropdown();
                                            toast((t) => (
                                                <div className="flex items-center space-x-2">
                                                    <span>Are you sure you want to logout?</span>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                toast.dismiss(t.id);
                                                                handleLogout();
                                                            }}
                                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            onClick={() => toast.dismiss(t.id)}
                                                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ), {
                                                duration: 10000,
                                                position: 'top-center',
                                            });
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <LuLogOut className="mr-3 h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </header>
    );
}
