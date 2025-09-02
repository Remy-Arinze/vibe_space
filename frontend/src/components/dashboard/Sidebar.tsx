'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTeam } from '@/context/TeamContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { teams, currentTeam, setCurrentTeam } = useTeam();
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-4">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-semibold">VibeSpace</span>
        </Link>
      </div>
      
      <nav className="mt-5">
        <div className="px-4 mb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-wide text-gray-400">Teams</h2>
            <Link 
              href="/teams/create" 
              className="text-xs text-gray-400 hover:text-white"
            >
              + New
            </Link>
          </div>
          
          <div className="mt-2 relative">
            <button
              onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
              className="flex items-center justify-between w-full px-2 py-1 text-sm font-medium rounded-md bg-gray-700 hover:bg-gray-600"
            >
              <span>{currentTeam?.name || 'Select a team'}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isTeamMenuOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isTeamMenuOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-gray-700 rounded-md shadow-lg z-10">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setCurrentTeam(team);
                      setIsTeamMenuOpen(false);
                    }}
                    className={`block w-full text-left px-2 py-1 text-sm ${currentTeam?.id === team.id ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="px-2">
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${isActive('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Dashboard
          </Link>
          
          <Link
            href="/tasks"
            className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${isActive('/tasks') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            Tasks
          </Link>
          
          <Link
            href="/teams"
            className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${isActive('/teams') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            Team Members
          </Link>
        </div>
      </nav>
    </div>
  );
}