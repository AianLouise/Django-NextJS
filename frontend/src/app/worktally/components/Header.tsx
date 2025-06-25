'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuClock, LuUser, LuBell, LuLogOut } from 'react-icons/lu';
import { User, logout } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps) {
    const router = useRouter();

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
        <header className="z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">                {/* Logo Section */}
                <Link href="/worktally/dashboard" className="flex items-center space-x-2 sm:space-x-3 group">                    <div className="relative">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <LuClock className="text-white text-base sm:text-lg" />
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            WorkTally
                        </span>
                    </div>
                </Link>

                {/* Right Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Notifications Button */}                    <button
                        onClick={() => toast('You have no new notifications', { icon: '🔔' })}
                        className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <span className="sr-only">View notifications</span>
                        <LuBell className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    {/* User Info */}                    <div className="flex items-center space-x-1 sm:space-x-2 bg-white/60 dark:bg-gray-800/60 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl shadow border border-white/20 dark:border-gray-700/30">
                        <LuUser className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base truncate max-w-24 sm:max-w-none">
                            {user ? (
                                <span className="hidden sm:inline">{`${user.first_name} ${user.last_name}`}</span>
                            ) : (
                                <span className="hidden sm:inline">User</span>
                            )}
                            {user && (
                                <span className="sm:hidden">{user.first_name}</span>
                            )}
                        </span>
                    </div>                    
                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            toast((t) => (
                                <div className="flex items-center space-x-2">
                                    <span>Are you sure you want to logout?</span>
                                    <div className="flex space-x-2">                                          <button
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
                        className="flex items-center text-gray-400 hover:text-red-500 focus:outline-none transition-colors p-1 sm:p-2"                        title="Logout"
                    >
                        <LuLogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="ml-1 text-xs sm:text-sm font-semibold hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
