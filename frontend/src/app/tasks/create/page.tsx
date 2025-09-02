'use client';

import TaskForm from '@/components/tasks/TaskForm';

export default function CreateTaskPage() {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
      <TaskForm />
    </div>
  );
}