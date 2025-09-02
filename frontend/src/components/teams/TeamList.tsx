'use client';

import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import Link from 'next/link';

export default function TeamList() {
  const { teams, fetchTeams, deleteTeam } = useTeam();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        await fetchTeams();
      } catch (err) {
        setError('Failed to load teams');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleDeleteClick = (teamId: string) => {
    setTeamToDelete(teamId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!teamToDelete) return;
    
    try {
      await deleteTeam(teamToDelete);
      setShowDeleteModal(false);
      setTeamToDelete(null);
    } catch (err) {
      setError('Failed to delete team');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTeamToDelete(null);
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

  if (teams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 mb-4">You don't have any teams yet.</p>
        <Link 
          href="/teams/create" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Team
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Teams</h2>
        <Link 
          href="/teams/create" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Create New Team
        </Link>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {teams.map((team) => (
          <li key={team.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                {team.description && (
                  <p className="mt-1 text-sm text-gray-500">{team.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Link 
                  href={`/teams/${team.id}`} 
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                >
                  View
                </Link>
                <Link 
                  href={`/teams/edit/${team.id}`} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(team.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this team? This action cannot be undone and will delete all tasks associated with this team.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}