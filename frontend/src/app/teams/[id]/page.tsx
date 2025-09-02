'use client';

import TeamDetail from '@/components/teams/TeamDetail';
import { use } from 'react';

interface TeamPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: teamId } = use(params); 
  return (
    <div className="max-w-7xl mx-auto py-6">
      <TeamDetail teamId={teamId} />
    </div>
  );
}