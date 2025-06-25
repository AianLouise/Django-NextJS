'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Header, Sidebar, PageLoader } from './components';

interface WorkTallyLayoutProps {
    children: React.ReactNode;
}

export default function WorkTallyLayout({ children }: WorkTallyLayoutProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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

                // Show welcome notification
                // Only show welcome notification if this is not a page refresh
                const isInitialLoad = sessionStorage.getItem('worktally_loaded') !== 'true';
                if (isInitialLoad) {
                    const firstName = parsedUser.first_name || 'User';
                    toast('Welcome back, ' + firstName + '!', { icon: '👋', duration: 3000 });
                    // Set flag to prevent duplicate notifications on refresh
                    sessionStorage.setItem('worktally_loaded', 'true');
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
                setError('Invalid user data');
            }
        }

        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return <PageLoader message="Loading WorkTally..." size="lg" />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-6 rounded-full font-semibold transition-all duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Animated Gradient Circles & Floating Icons - Responsive */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-5 sm:top-40 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/4 sm:bottom-20 sm:left-1/3 w-56 h-56 sm:w-80 sm:h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <Header user={user} />

            <div className="py-4 sm:py-6 lg:py-10 relative z-10">
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 lg:gap-8">
                        <Sidebar />

                        {/* Main Content Area - This is where components will be rendered */}
                        <section className="flex-1 min-w-0">
                            {children}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
