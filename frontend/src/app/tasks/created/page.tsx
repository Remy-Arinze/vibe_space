'use client';

import TaskList from '@/components/tasks/TaskList';

export default function CreatedTasksPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks Created by Me</h1>
      <TaskList view="created" />
    </div>
  );
}