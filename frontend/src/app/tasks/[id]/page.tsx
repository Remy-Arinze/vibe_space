'use client';

import TaskDetail from '@/components/tasks/TaskDetail';

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <TaskDetail taskId={params.id} />
    </div>
  );
}