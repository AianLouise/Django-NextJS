'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaClock, FaUserCircle, FaBell, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUsers, FaCog, FaTimes, FaEnvelope, FaPhone, FaCalendar, FaUser, FaBuilding, FaPlus, FaEdit } from 'react-icons/fa';
import { apiRequest, logout } from '@/lib/api';

export default function Team() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Organization and team state
  const [organization, setOrganization] = useState<any>(null);
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Invitation modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteRole, setInviteRole] = useState('employee');
  const [isInviting, setIsInviting] = useState(false);
  
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

  // Fetch team members from organization API
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      
      // Try to call the organization team API
      const data = await apiRequest('/users/organization/team/', {
        method: 'GET'
      });
      
      setOrganization(data.organization);
      setActiveMembers(data.active_members || []);
      setPendingInvitations(data.pending_invitations || []);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      
      // Set empty arrays for demo purposes
      setActiveMembers([]);
      setPendingInvitations([]);
      setIsLoading(false);
      
      // Show error notification
      showNotification('Unable to load team data - please check your connection', 'error');
    }
  };

  // Handle team member invitation
  const handleInviteTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim() || !inviteFirstName.trim() || !inviteLastName.trim()) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    setIsInviting(true);
    
    try {
      const response = await apiRequest('/users/organization/invite/', {
        method: 'POST',
        body: {
          email: inviteEmail,
          first_name: inviteFirstName,
          last_name: inviteLastName,
          role: inviteRole
        }
      });
      
      showNotification('Team member invited successfully! An invitation email has been sent.', 'success');
      
      // Reset form and close modal
      setInviteEmail('');
      setInviteFirstName('');
      setInviteLastName('');
      setInviteRole('employee');
      setShowInviteModal(false);
      
      // Refresh team data
      fetchTeamMembers();
      
    } catch (err: any) {
      console.error('Error inviting team member:', err);
      showNotification(err.message || 'Failed to invite team member', 'error');
    } finally {
      setIsInviting(false);
    }  };
  
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
  const filteredActiveMembers = activeMembers.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const email = member.email.toLowerCase();
    const role = member.role?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || 
           email.includes(query) || 
           role.includes(query);
  });

  const filteredPendingInvitations = pendingInvitations.filter(invitation => {
    const fullName = `${invitation.first_name} ${invitation.last_name}`.toLowerCase();
    const email = invitation.email.toLowerCase();
    const role = invitation.role?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || 
           email.includes(query) || 
           role.includes(query);  });
  
  // Check if user can invite team members (owner or admin)
  const canInviteMembers = user && (user.role === 'owner' || user.role === 'admin');
  
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
                </div>                {/* Main Content */}
                <div className="flex-1 md:ml-8">
                  {/* Organization Header */}
                  {organization && (
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <FaBuilding className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{organization.name}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{organization.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Management Header */}
                  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Team Management</h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage your organization's team members and invitations
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
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

                          {/* Invite Button */}
                          {canInviteMembers && (
                            <button
                              onClick={() => setShowInviteModal(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FaPlus className="mr-2 h-4 w-4" />
                              Invite Team Member
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Active Members Section */}
                      <div className="mb-8">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <FaUser className="mr-2 h-5 w-5 text-green-600" />
                          Active Members ({filteredActiveMembers.length})
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredActiveMembers.length > 0 ? (
                            filteredActiveMembers.map((member) => (
                              <div key={member.id} className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-600">
                                <div className="p-5">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                      <FaUserCircle className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="ml-4">
                                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {member.first_name} {member.last_name}
                                      </h4>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                        {member.role || 'employee'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                                      <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
                                      <a href={`mailto:${member.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                        {member.email}
                                      </a>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <FaCalendar className="mr-2 h-4 w-4 text-gray-400" />
                                      <span>Joined {formatDate(member.date_joined)}</span>
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
                            <div className="col-span-3 py-8 text-center">
                              <FaUsers className="mx-auto h-8 w-8 text-gray-400" />
                              <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active members found</h4>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {searchQuery ? 'Try adjusting your search query.' : 'Invite team members to get started.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pending Invitations Section */}
                      {filteredPendingInvitations.length > 0 && (
                        <div>
                          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaClock className="mr-2 h-5 w-5 text-yellow-600" />
                            Pending Invitations ({filteredPendingInvitations.length})
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPendingInvitations.map((invitation) => (
                              <div key={invitation.id} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow overflow-hidden border border-yellow-200 dark:border-yellow-800">
                                <div className="p-5">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                                      <FaEnvelope className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div className="ml-4">
                                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {invitation.first_name} {invitation.last_name}
                                      </h4>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                        {invitation.role || 'employee'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                                      <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
                                      <span>{invitation.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <FaClock className="mr-2 h-4 w-4 text-gray-400" />
                                      <span>Invited {formatDate(invitation.invited_at)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-yellow-100 dark:bg-yellow-900/30 px-5 py-3">
                                  <span className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">
                                    Invitation Pending
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>          </div>
        </main>
      </div>

      {/* Invite Team Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Invite Team Member
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleInviteTeamMember}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="inviteEmail"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="colleague@company.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inviteFirstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="inviteFirstName"
                      value={inviteFirstName}
                      onChange={(e) => setInviteFirstName(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inviteLastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="inviteLastName"
                      value={inviteLastName}
                      onChange={(e) => setInviteLastName(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <select
                      id="inviteRole"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInviting ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
