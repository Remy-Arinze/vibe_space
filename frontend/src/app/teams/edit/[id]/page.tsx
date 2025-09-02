'use client';

import TeamForm from '@/components/teams/TeamForm';

interface EditTeamPageProps {
  params: {
    id: string;
  };
}

export default function EditTeamPage({ params }: EditTeamPageProps) {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Team</h1>
      <TeamForm teamId={params.id} isEditing={true} />
    </div>
  );
}