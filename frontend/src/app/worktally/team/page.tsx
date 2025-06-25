'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaEnvelope, FaCalendar, FaUser, FaBuilding, FaPlus, FaUsers, FaUserCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { apiRequest, User, Organization } from '@/lib/api';

// Define interfaces for team-specific data
interface TeamMember extends User {
  role?: string;
  status?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [activeMembers, setActiveMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [inviteRole, setInviteRole] = useState('employee');
  const [isInviting, setIsInviting] = useState(false);
  // Fetch team members from organization API
  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest('/users/organization/team/');
      
      if (data.organization) {
        setOrganization(data.organization);
        setActiveMembers(data.active_members || []);
        setPendingInvitations(data.pending_invitations || []);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching team members:', err);
      toast.error('Failed to load team data. Please try again.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Send invitation
  const sendInvitation = async () => {
    try {
      setIsInviting(true);
      await apiRequest('/users/organization/invite/', {
        method: 'POST',
        body: {
          email: inviteEmail,
          first_name: inviteFirstName,
          last_name: inviteLastName,
          role: inviteRole,
        },
      });

      toast.success('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteFirstName('');
      setInviteLastName('');
      setInviteRole('employee');
      fetchTeamMembers();
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  // Filter functions
  const filteredActiveMembers = activeMembers.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const email = member.email.toLowerCase();
    const role = member.role?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || email.includes(query) || role.includes(query);
  });

  const filteredPendingInvitations = pendingInvitations.filter(invitation => {
    const fullName = `${invitation.first_name} ${invitation.last_name}`.toLowerCase();
    const email = invitation.email.toLowerCase();
    const role = invitation.role?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || email.includes(query) || role.includes(query);
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading team...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      {organization && (
        <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
          <div className="px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
            <div className="flex items-center">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaBuilding className="text-white text-lg sm:text-xl" />
                </div>
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

      {/* Team Management */}
      <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300">
            Team Management
          </h2>
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Invite Member
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/60 dark:text-white backdrop-blur-md bg-white/60"
          />
        </div>

        {/* Active Members */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaUsers className="mr-2 text-blue-600" />
            Active Members ({filteredActiveMembers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActiveMembers.map((member) => (
              <div key={member.id} className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/20 dark:border-gray-700/30 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FaUserCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                      {member.role || 'Member'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        {filteredPendingInvitations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaEnvelope className="mr-2 text-yellow-600" />
              Pending Invitations ({filteredPendingInvitations.length})
            </h3>
            <div className="space-y-4">
              {filteredPendingInvitations.map((invitation) => (
                <div key={invitation.id} className="bg-yellow-50/60 dark:bg-yellow-900/20 backdrop-blur-md rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-700/30 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {invitation.first_name} {invitation.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{invitation.email}</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium capitalize">
                          {invitation.role} • Invited {formatDate(invitation.invited_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={inviteFirstName}
                    onChange={(e) => setInviteFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="First name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={inviteLastName}
                    onChange={(e) => setInviteLastName(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={sendInvitation}
                disabled={isInviting || !inviteEmail || !inviteFirstName || !inviteLastName}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
