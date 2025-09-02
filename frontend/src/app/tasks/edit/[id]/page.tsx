'use client';

import TaskForm from '@/components/tasks/TaskForm';

interface EditTaskPageProps {
  params: {
    id: string;
  };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
      <TaskForm taskId={params.id} isEditing={true} />
    </div>
  );
}