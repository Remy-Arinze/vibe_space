'use client';

import TaskList from '@/components/tasks/TaskList';

export default function TasksPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
      <TaskList view="all" />
    </div>
  );
}