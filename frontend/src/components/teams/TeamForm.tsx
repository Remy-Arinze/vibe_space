'use client';

import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { useRouter } from 'next/navigation';

interface TeamFormProps {
  teamId?: string;
  isEditing?: boolean;
}

export default function TeamForm({ teamId, isEditing = false }: TeamFormProps) {
  const router = useRouter();
  const { teams, createTeam, updateTeam, getTeamById } = useTeam();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadTeam = async () => {
      if (isEditing && teamId) {
        setIsLoading(true);
        try {
          const team = await getTeamById(teamId);
          if (team) {
            setName(team.name);
            setDescription(team.description || '');
          }
        } catch (err) {
          setError('Failed to load team details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTeam();
  }, [isEditing, teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {

      if (isEditing && teamId) {
        await updateTeam(teamId, name, description);
        setSuccess('Team updated successfully');
      } else {
        await createTeam(name, description);
        setSuccess('Team created successfully');
        // Reset form after creation
        setName('');
        setDescription('');
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/teams');
      }, 1500);
    } catch (err) {
      setError('Failed to save team');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">{isEditing ? 'Edit Team' : 'Create New Team'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Team Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Team' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  );
}