'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaTimes, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';
import { apiRequest, logout } from '@/lib/api';

export default function Team() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Notification state
  interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Show notification function
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const newNotification = { id, message, type, duration };
    
    // Check if this notification already exists to prevent duplicates
    setNotifications(prev => {
      // Check if a similar notification already exists
      const duplicateExists = prev.some(n => n.message === message && n.type === type);
      if (duplicateExists) {
        return prev; // Don't add duplicate
      }
      return [...prev, newNotification];
    });
    
    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }
  };
  
  // Dismiss notification function
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Sample team data (would normally come from API)
  const sampleTeamMembers = [
    {
      id: 1,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      job_title: 'Frontend Developer',
      department: 'Engineering',
      phone_number: '(555) 123-4567',
      profile: {
        hire_date: '2023-02-15',
        profile_picture: null
      }
    },
    {
      id: 2,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      job_title: 'Backend Developer',
      department: 'Engineering',
      phone_number: '(555) 234-5678',
      profile: {
        hire_date: '2022-08-10',
        profile_picture: null
      }
    },
    {
      id: 3,
      first_name: 'Robert',
      last_name: 'Johnson',
      email: 'robert.johnson@example.com',
      job_title: 'Project Manager',
      department: 'Product',
      phone_number: '(555) 345-6789',
      profile: {
        hire_date: '2021-05-20',
        profile_picture: null
      }
    },
    {
      id: 4,
      first_name: 'Emily',
      last_name: 'Wilson',
      email: 'emily.wilson@example.com',
      job_title: 'UX Designer',
      department: 'Design',
      phone_number: '(555) 456-7890',
      profile: {
        hire_date: '2023-01-05',
        profile_picture: null
      }
    },
    {
      id: 5,
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'michael.brown@example.com',
      job_title: 'DevOps Engineer',
      department: 'Engineering',
      phone_number: '(555) 567-8901',
      profile: {
        hire_date: '2022-11-15',
        profile_picture: null
      }
    }
  ];
  
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
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Invalid user data');
      }
    }
    
    // Fetch team data
    fetchTeamMembers();
  }, [router]);
  
  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // const data = await apiRequest('/users/team/');
      
      // Using sample data for now
      setTeamMembers(sampleTeamMembers);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team data');
      setIsLoading(false);
      
      // Show error notification
      showNotification('Failed to load team data. Please try again.', 'error');
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Successfully logged out!', 'success', 2000);
      // Short delay to show the notification before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Error logging out. Please try again.', 'error');
    }
  };
  
  // Filter team members based on search query
  const filteredTeamMembers = teamMembers.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const email = member.email.toLowerCase();
    const jobTitle = member.job_title.toLowerCase();
    const department = member.department.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || 
           email.includes(query) || 
           jobTitle.includes(query) || 
           department.includes(query);
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-md shadow-lg flex justify-between items-start 
              ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
                notification.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 
                'bg-blue-50 text-blue-800 border-l-4 border-blue-500'} 
              transform transition-all duration-300 ease-in-out`}
          >
            <div>
              <p className="font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => dismissNotification(notification.id)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <FaClock className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">TimeTrack</span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => showNotification('You have no new notifications', 'info')}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <FaBell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {user ? `${user.first_name} ${user.last_name}` : 'User'}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-4 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span className="ml-1 text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Dashboard Content */}
            <div className="px-4 py-8 sm:px-0">
              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 mb-8 md:mb-0">
                  <nav className="space-y-1">
                    <Link 
                      href="/dashboard" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaHome className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/timesheet" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaCalendarAlt className="mr-3 h-5 w-5" />
                      Timesheet
                    </Link>
                    <Link 
                      href="/dashboard/reports" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaChartBar className="mr-3 h-5 w-5" />
                      Reports
                    </Link>
                    <Link 
                      href="/dashboard/team" 
                      className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaUsers className="mr-3 h-5 w-5" />
                      Team
                    </Link>
                    <Link 
                      href="/dashboard/settings" 
                      className="text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    >
                      <FaCog className="mr-3 h-5 w-5" />
                      Settings
                    </Link>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 md:ml-8">
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Team Members</h2>
                        
                        {/* Search Input */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Team Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeamMembers.length > 0 ? (
                          filteredTeamMembers.map((member) => (
                            <div key={member.id} className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-600">
                              <div className="p-5">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                    {member.profile.profile_picture ? (
                                      <img src={member.profile.profile_picture} alt={`${member.first_name} ${member.last_name}`} className="h-16 w-16 rounded-full" />
                                    ) : (
                                      <FaUserCircle className="h-12 w-12 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{member.first_name} {member.last_name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.job_title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.department}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
                                    <a href={`mailto:${member.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                      {member.email}
                                    </a>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    <FaPhone className="mr-2 h-4 w-4 text-gray-400" />
                                    <a href={`tel:${member.phone_number.replace(/[^\d+]/g, '')}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                      {member.phone_number}
                                    </a>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <FaCalendar className="mr-2 h-4 w-4 text-gray-400" />
                                    <span>Joined {formatDate(member.profile.hire_date)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-600 px-5 py-3">
                                <button 
                                  onClick={() => showNotification(`Viewing ${member.first_name}'s timesheet is not implemented yet.`, 'info')}
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                >
                                  View Timesheet
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 py-12 text-center">
                            <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No team members found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Try adjusting your search query.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
