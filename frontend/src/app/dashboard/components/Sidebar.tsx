'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';

const navigationItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: FaHome,
    },
    {
        name: 'Timesheet',
        href: '/dashboard/timesheet',
        icon: FaCalendarAlt,
    },
    {
        name: 'Reports',
        href: '/dashboard/reports',
        icon: FaChartBar,
    },
    {
        name: 'Team',
        href: '/dashboard/team',
        icon: FaUsers,
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: FaCog,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const activeItemRef = useRef<HTMLAnchorElement>(null);    // Scroll active item into view on mobile
    useEffect(() => {
        if (mobileNavRef.current && activeItemRef.current) {
            const container = mobileNavRef.current;
            const activeItem = activeItemRef.current;
            
            // Small delay to ensure proper rendering
            setTimeout(() => {
                // Calculate the scroll position to center the active item
                const containerWidth = container.offsetWidth;
                const itemLeft = activeItem.offsetLeft;
                const itemWidth = activeItem.offsetWidth;
                
                // Center the active item in the container
                const scrollLeft = itemLeft - (containerWidth / 2) + (itemWidth / 2);
                
                container.scrollTo({
                    left: Math.max(0, scrollLeft), // Prevent negative scroll
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [pathname]);

    return (
        <aside className="w-full lg:w-64 mb-4 lg:mb-0">
            {/* Mobile Navigation - Horizontal Scroll */}
            <nav className="lg:hidden">                <div 
                    ref={mobileNavRef}
                    className="flex space-x-2 overflow-x-auto pb-2 px-4 sm:px-6 scrollbar-hide smooth-scroll"
                >
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                ref={isActive ? activeItemRef : null}
                                href={item.href}
                                className={`${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-white/70 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900'
                                    } group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap backdrop-blur-md shadow-lg border border-white/20 dark:border-gray-700/30 ${
                                        isActive ? 'shadow hover:scale-105' : ''
                                    }`}
                            >
                                <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Navigation - Vertical */}
            <nav className="hidden lg:block space-y-3 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900'
                                } group flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                                    isActive ? 'shadow hover:scale-105' : ''
                                }`}
                        >
                            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <span className="truncate">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
