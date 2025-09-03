'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext';
import { useTask } from '@/context/TaskContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { teams, currentTeam } = useTeam();
  const { tasks, fetchTasks, fetchAssignedTasks } = useTask();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Only fetch tasks for current team if it exists
      if (currentTeam) {
        await fetchTasks();
      }

      await fetchAssignedTasks();
      setIsLoading(false);
    };
    loadData();
  }, [currentTeam]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.username}!</h1>
        <p className="text-gray-600 text-sm">Here's an overview of your workspace.</p>
      </div>

      {/* Tasks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks Assigned to You */}
        <div className="bg-white rounded-lg  p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tasks Assigned to You</h2>
            <Link href="/tasks/assigned" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-500 truncate">You don't have any assigned tasks.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.slice(0, 5).map((task) => (
                <li key={task.id} className="py-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{task.title}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'To Do'
                            ? 'bg-gray-100 text-gray-800'
                            : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{task.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current Team Tasks */}
  <div className="bg-white rounded-lg  p-6">
  {currentTeam ? (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{currentTeam.name} Tasks</h2>
        <Link href="/tasks/create" className="text-sm text-blue-600 hover:text-blue-800">
          + Add Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 truncate">This team doesn't have any tasks yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate">{task.title}</div>
                    <div className="text-sm text-gray-500 truncate">{task.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === 'To Do'
                          ? 'bg-gray-100 text-gray-800'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.assignee ? task.assignee.username : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/tasks/${task.id}`} className="text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  ) : teams.length > 0 ? (
    <p className="text-gray-500 truncate">Select a team to view its tasks.</p>
  ) : (
    <div>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Team Tasks</h2>
      <Link
        href="/teams/create"
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        + Create Team
      </Link>
      
    </div>
          <p className='mt-3 text-gray-500 '>you currently are in no teams, create or join a team to see team tasks</p>

    </div>
  )}
</div>

      </div>

      {/* Teams Section */}
      <div className="bg-white rounded-lg  p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Teams</h2>
          <Link href="/teams/create" className="text-sm text-blue-600 hover:text-blue-800">
            + Create Team
          </Link>
        </div>
        {teams.length === 0 ? (
          <p className="text-gray-500 truncate">You don't have any teams yet. Create one to get started!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {teams.map((team) => (
              <li key={team.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <p className="font-medium truncate">{team.name}</p>
                    <p className="text-sm text-gray-500 truncate">{team.description}</p>
                  </div>
                  <Link href={`/teams/${team.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
