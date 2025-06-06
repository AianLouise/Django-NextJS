'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

    return (
        <aside className="w-full md:w-64 mb-8 md:mb-0">
            <nav className="space-y-3 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
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
                                } group flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${isActive ? 'shadow hover:scale-105' : ''
                                }`}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
