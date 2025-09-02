'use client';

import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TeamDetailProps {
  teamId: string;
}

export default function TeamDetail({ teamId }: TeamDetailProps) {
  
  const router = useRouter();
  const { 
    getTeamById, 
    fetchTeamMembers, 
    addTeamMember, 
    removeTeamMember, 
    updateMemberRole,
    deleteTeam 
  } = useTeam();
  
  const [team, setTeam] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // For adding new members
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  // For modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);

  useEffect(() => {
    const loadTeamData = async () => {
      setIsLoading(true);
      try {
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
        
        const members = await fetchTeamMembers(teamId);
        setTeamMembers(members);
      } catch (err) {
        setError('Failed to load team details');
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      loadTeamData();
    }
  }, [teamId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingMember(true);
    setError('');
    setSuccess('');
    
    try {
      await addTeamMember(teamId, { email, role });
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      
      // Refresh team members list
      await fetchTeamMembers(teamId);
    } catch (err) {
      setError('Failed to add team member');
    } finally {
      setIsAddingMember(false);
    }
  };


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, userId: string) => {
  const value = e.target.value as 'ADMIN' | 'MEMBER';
  if (value === 'ADMIN' || value === 'MEMBER') {
    handleRoleChange(userId, value);
  }
};

const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'MEMBER') => {
  try {
    await updateMemberRole(teamId, userId, newRole);

    // Update local state
    setTeamMembers(teamMembers.map(member =>
      member.userId === userId && member.teamId === teamId
        ? { ...member, role: newRole }
        : member
    ));

    setSuccess('Member role updated successfully');
  } catch (err) {
    setError('Failed to update member role');
  }
};


  const handleRemoveMemberClick = (memberId: string) => {
    setMemberToRemove(memberId);
    setShowRemoveMemberModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    
    try {
      await removeTeamMember(teamId, memberToRemove);
      setShowRemoveMemberModal(false);
      setMemberToRemove(null);
      
      // Refresh team members list
      const members = await fetchTeamMembers(teamId);
      setTeamMembers(members);
      
      setSuccess('Member removed successfully');
    } catch (err) {
      setError('Failed to remove team member');
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(teamId);
      router.push('/teams');
    } catch (err) {
      setError('Failed to delete team');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Not Found!</strong>
        <span className="block sm:inline"> Team not found or you don't have permission to view it.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{success}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccess('')}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className='w-[60%]'>
              <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
              {team.description && (
                <p className="mt-2  text-sm text-gray-600">{team.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/teams/edit/${team.id}`}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Edit Team
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete Team
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Team Members</h2>
            
            {teamMembers.length === 0 ? (
              <p className="text-gray-500">No members in this team yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
  {teamMembers.map((member) => (
    <tr key={member.userId}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 font-medium">
              {member.user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{member.user.username}</div>
            <div className="text-sm text-gray-500">{member.user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={member.role}
            onChange={(e) => handleSelectChange(e, member.userId)}

          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
            sm:text-sm rounded-md"
        >
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(member.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => handleRemoveMemberClick(member.userId)}
          className="text-red-600 hover:text-red-900"
        >
          Remove
        </button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add Team Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingMember}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isAddingMember ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Team Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this team? This action cannot be undone and will delete all tasks associated with this team.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTeam}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveMemberModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Remove Member</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to remove this member from the team?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRemoveMemberModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveMember}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}