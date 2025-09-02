'use client';

import TeamList from '@/components/teams/TeamList';

export default function TeamsPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Teams</h1>
      <TeamList />
    </div>
  );
}