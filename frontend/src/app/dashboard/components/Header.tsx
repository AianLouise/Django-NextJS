'use client';

import Link from 'next/link';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { User } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
    return (
        <header className="z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/30">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center space-x-3 group">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FaClock className="text-white text-lg" />
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
                    </div>
                    <div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            WorkTally
                        </span>
                    </div>
                </Link>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => toast('You have no new notifications', { icon: '🔔' })}
                        className="p-2 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <span className="sr-only">View notifications</span>
                        <FaBell className="h-6 w-6" />
                    </button>
                    <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-xl shadow border border-white/20 dark:border-gray-700/30">
                        <FaUserCircle className="h-7 w-7 text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {user ? `${user.first_name} ${user.last_name}` : 'User'}
                        </span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                    >
                        <FaSignOutAlt className="h-5 w-5" />
                        <span className="ml-1 text-sm font-semibold">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
