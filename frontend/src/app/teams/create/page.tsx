'use client';

import TeamForm from '@/components/teams/TeamForm';

export default function CreateTeamPage() {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Team</h1>
      <TeamForm />
    </div>
  );
}