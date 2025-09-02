'use client';

import TeamDetail from '@/components/teams/TeamDetail';

interface TeamPageProps {
  params: {
    id: string;
  };
}

export default function TeamPage({ params }: TeamPageProps) {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <TeamDetail teamId={params.id} />
    </div>
  );
}