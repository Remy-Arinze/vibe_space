'use client';

import { useState, useEffect } from 'react';
import { useTask } from '@/context/TaskContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TaskDetailProps {
  taskId: string;
}

export default function TaskDetail({ taskId }: TaskDetailProps) {
  const router = useRouter();
  const { fetchTaskById, deleteTask } = useTask();
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true);
      try {
        const taskData = await fetchTaskById(taskId);
        setTask(taskData);
      } catch (err) {
        setError('Failed to load task details');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const handleDelete = async () => {
    try {
      await deleteTask(taskId);
      router.push('/tasks');
    } catch (err) {
      setError('Failed to delete task');
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

  if (!task) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Not Found!</strong>
        <span className="block sm:inline"> Task not found or you don't have permission to view it.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg  overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            task.status === 'To Do' ? 'bg-gray-100 text-gray-800' :
            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.status}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
          <p className="text-gray-900 whitespace-pre-line">{task.description || 'No description provided.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Assignee</h2>
            <p className="text-gray-900">{task.assignee ? task.assignee.username : 'Unassigned'}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Created By</h2>
            <p className="text-gray-900">{task.creator ? task.creator.username : 'Unknown'}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Team</h2>
            <p className="text-gray-900">{task.team ? task.team.name : 'Unknown'}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Created At</h2>
            <p className="text-gray-900">{new Date(task.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link
            href="/tasks"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Tasks
          </Link>
          <Link
            href={`/tasks/edit/${task.id}`}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Edit Task
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete Task
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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