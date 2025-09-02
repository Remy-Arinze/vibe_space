'use client';

import TaskDetail from '@/components/tasks/TaskDetail';
import { use } from 'react';

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: taskId } = use(params); 
  return <TaskDetail taskId={taskId} />;
}