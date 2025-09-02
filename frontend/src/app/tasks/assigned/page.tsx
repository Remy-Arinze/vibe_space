'use client';

import TaskList from '@/components/tasks/TaskList';

export default function AssignedTasksPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks Assigned to Me</h1>
      <TaskList view="assigned" />
    </div>
  );
}