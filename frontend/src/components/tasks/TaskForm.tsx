'use client';

import { useState, useEffect } from 'react';
import { useTeam } from '@/context/TeamContext';
import { useTask } from '@/context/TaskContext';
import { useRouter } from 'next/navigation';

interface TaskFormProps {
  taskId?: string;
  isEditing?: boolean;
}

export default function TaskForm({ taskId, isEditing = false }: TaskFormProps) {
  const router = useRouter();
  const { currentTeam, teamMembers, fetchTeamMembers } = useTeam();
  const { tasks, createTask, updateTask, fetchTaskById } = useTask();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [assigneeId, setAssigneeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!currentTeam) {
        setError('Please select a team first');
        return;
      }
      
      await fetchTeamMembers();
      
      if (isEditing && taskId) {
        setIsLoading(true);
        try {
          const task = await fetchTaskById(taskId);
          if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
            setAssigneeId(task.assignee?.id || '');
          }
        } catch (err) {
          setError('Failed to load task details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [currentTeam, isEditing, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!currentTeam) {
      setError('Please select a team first');
      setIsLoading(false);
      return;
    }

    try {
      const taskData = {
        title,
        description,
        status,
        teamId: currentTeam.id,
        assigneeId: assigneeId || undefined
      };

      if (isEditing && taskId) {
        await updateTask(taskId, taskData);
        setSuccess('Task updated successfully');
      } else {
        await createTask(taskData);
        setSuccess('Task created successfully');
        // Reset form after creation
        setTitle('');
        setDescription('');
        setStatus('To Do');
        setAssigneeId('');
      }

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/tasks');
      }, 1500);
    } catch (err) {
      setError('Failed to save task');
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
      <h2 className="text-xl font-semibold mb-6">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
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
        
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <select
            id="assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Unassigned</option>
            {teamMembers.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.username}
              </option>
            ))}
          </select>
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
            {isLoading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}