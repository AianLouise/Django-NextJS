'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LuX, LuMail, LuCalendar, LuUser, LuBuilding, LuPlus, LuUsers, LuCircleUser, LuClock } from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import { apiRequest, User, Organization } from '../../../lib/api';

// Define interfaces for team-specific data
interface TeamMember extends User {
    role?: string;
    status?: string;
}

interface TeamUser extends User {
    role?: string;
}

interface PendingInvitation {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    invited_at: string;
    expires_at: string;
}

export default function TeamPage() {
    const router = useRouter();
    const [user, setUser] = useState<TeamUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Organization and team state
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [activeMembers, setActiveMembers] = useState<TeamMember[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Invitation modal state
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteFirstName, setInviteFirstName] = useState('');
    const [inviteLastName, setInviteLastName] = useState(''); const [inviteRole, setInviteRole] = useState('employee');
    const [isInviting, setIsInviting] = useState(false);
    // Fetch team members from organization API
    const fetchTeamMembers = useCallback(async () => {
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
        } catch (err) {
            console.error('Error fetching team members:', err);

            // Set empty arrays for demo purposes
            setActiveMembers([]);
            setPendingInvitations([]);
            setIsLoading(false);      // Show error notification
            const errorMessage = err instanceof Error ? err.message : 'Unable to load team data - please check your connection';
            toast.error(errorMessage);
        }
    }, []);

    // Handle team member invitation
    const handleInviteTeamMember = async (e: React.FormEvent) => {
        e.preventDefault(); if (!inviteEmail.trim() || !inviteFirstName.trim() || !inviteLastName.trim()) {
            toast.error('Please fill in all required fields.');
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
            });      // Log response for debugging
            console.log('Invitation response:', response);

            toast.success('Team member invited successfully! An invitation email has been sent.');

            // Reset form and close modal
            setInviteEmail('');
            setInviteFirstName('');
            setInviteLastName('');
            setInviteRole('employee');
            setShowInviteModal(false);

            // Refresh team data
            fetchTeamMembers();
        } catch (err) {
            console.error('Error inviting team member:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to invite team member';
            toast.error(errorMessage);
        } finally {
            setIsInviting(false);
        }
    };

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
                toast.error('Invalid user data. Please log in again.');
            }
        }    // Fetch team data
        fetchTeamMembers();
    }, [router, fetchTeamMembers]);

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
            role.includes(query);
    });  // Check if user can invite team members (creator or admin)
    const canInviteMembers = user && (user.role === 'creator' || user.role === 'admin');

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading team...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Organization Header */}
                {organization && (
                    <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 mb-6 sm:mb-8">
                        <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
                            <div className="flex items-center">
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <LuBuilding className="text-white text-lg sm:text-xl" />
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-20 -z-10"></div>
                                </div>
                                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                    <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 break-words">
                                        {organization.name}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">{organization.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Team Management Header */}
                <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
                    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 sm:mb-8 gap-4">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 break-words">
                                    Team Management
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Manage your organization&apos;s team members and invitations
                                </p>
                            </div>

                            {/* Invite Button */}
                            {canInviteMembers && (
                                <button
                                    onClick={() => setShowInviteModal(true)} className="w-full lg:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-h-[44px]"
                                >
                                    <LuPlus className="mr-2 h-4 w-4" />
                                    Invite Team Member
                                </button>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="mb-6 sm:mb-8">
                            <div className="relative max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search team members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:text-white transition-all duration-200"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Active Members Section */}
                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                                    <LuUser className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </div>
                                Active Members ({filteredActiveMembers.length})
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {filteredActiveMembers.length > 0 ? (
                                    filteredActiveMembers.map((member, idx) => (
                                        <div key={member.id || `active-${idx}`}
                                            className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-600/30 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full">
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                            <LuCircleUser className="h-8 w-8 text-white" />
                                                        </div>
                                                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-20 -z-10"></div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h4
                                                            className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                                                            title={`${member.first_name} ${member.last_name}`}
                                                        >
                                                            {`${member.first_name} ${member.last_name}`.length > 15
                                                                ? `${member.first_name} ${member.last_name}`.slice(0, 15) + '...'
                                                                : `${member.first_name} ${member.last_name}`}
                                                        </h4>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-200 capitalize">
                                                            {member.role || 'employee'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                                                            <LuMail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <a href={`mailto:${member.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 truncate">
                                                            {member.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                                                            <LuCalendar className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <span>Joined {formatDate(member.date_joined)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1" /> {/* Spacer to push button to bottom */}
                                            </div>

                                            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-600/30 dark:to-blue-900/30 backdrop-blur-sm px-6 py-4 border-t border-white/20 dark:border-gray-600/30">
                                                <button
                                                    onClick={() => toast(`Viewing ${member.first_name}'s timesheet is not implemented yet.`)}
                                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                                                >
                                                    View Timesheet →
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <LuUsers className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active members found</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {searchQuery ? 'Try adjusting your search query.' : 'Invite team members to get started.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pending Invitations Section */}
                        {filteredPendingInvitations.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                                        <LuClock className="h-4 w-4 text-white" />
                                    </div>
                                    Pending Invitations ({filteredPendingInvitations.length})
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredPendingInvitations.map((invitation, idx) => (
                                        <div key={invitation.id || `pending-${idx}`}
                                            className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-md rounded-2xl shadow-xl border border-yellow-200/50 dark:border-yellow-800/30 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                            <div className="p-6">
                                                <div className="flex items-center">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="h-14 w-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                                                            <LuMail className="h-7 w-7 text-white" />
                                                        </div>
                                                        <div className="absolute -inset-1 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl opacity-20 -z-10"></div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={`${invitation.first_name} ${invitation.last_name}`}>
                                                            {`${invitation.first_name} ${invitation.last_name}`.length > 28
                                                                ? `${invitation.first_name} ${invitation.last_name}`.slice(0, 25) + '...'
                                                                : `${invitation.first_name} ${invitation.last_name}`}
                                                        </h4>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-200 capitalize">
                                                            {invitation.role || 'employee'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-6 space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
                                                            <LuMail className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                                        </div>
                                                        <span className="truncate">{invitation.email}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                        <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                                                            <LuClock className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                                        </div>
                                                        <span>Invited {formatDate(invitation.invited_at)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-yellow-100/80 to-orange-100/80 dark:from-yellow-900/30 dark:to-orange-900/30 backdrop-blur-sm px-6 py-4 border-t border-yellow-200/50 dark:border-yellow-800/30">
                                                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex items-center">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
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

            {/* Invite Team Member Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                                        <LuPlus className="text-white text-lg" />
                                    </div>
                                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                        Invite Team Member
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowInviteModal(false)}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
                                >
                                    <LuX className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleInviteTeamMember} className="space-y-6">
                                <div>
                                    <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="inviteEmail"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:text-white transition-all duration-200"
                                        placeholder="colleague@company.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="inviteFirstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="inviteFirstName"
                                            value={inviteFirstName}
                                            onChange={(e) => setInviteFirstName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:text-white transition-all duration-200"
                                            placeholder="John"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="inviteLastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="inviteLastName"
                                            value={inviteLastName}
                                            onChange={(e) => setInviteLastName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:text-white transition-all duration-200"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role
                                    </label>
                                    <select
                                        id="inviteRole"
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 dark:text-white transition-all duration-200"
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="px-6 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isInviting}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                                    >
                                        {isInviting ? 'Sending...' : 'Send Invitation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
