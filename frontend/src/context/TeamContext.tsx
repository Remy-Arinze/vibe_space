'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Team {
  id: string;
  name: string;
  description: string;
}

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'ADMIN' | 'MEMBER';
  username: string;
  email: string;
}

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  createTeam: (name: string, description: string) => Promise<void>;
  updateTeam: (id: string, name: string, description: string) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  setCurrentTeam: (team: Team | null) => void;
  fetchTeamMembers: (teamId: string) => Promise<void>;
  addTeamMember: (teamId: string, email: string) => Promise<void>;
  removeTeamMember: (teamId: string, userId: string) => Promise<void>;
  updateMemberRole: (teamId: string, userId: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchTeams();
    }
  }, [token]);

  useEffect(() => {
    // Restore current team from localStorage if available
    const storedTeam = localStorage.getItem('currentTeam');
    if (storedTeam) {
      try {
        const parsedTeam = JSON.parse(storedTeam);
        setCurrentTeam(parsedTeam);
        fetchTeamMembers(parsedTeam.id);
      } catch (error) {
        console.error('Error parsing stored team:', error);
        localStorage.removeItem('currentTeam');
      }
    }
  }, [teams]);

  const fetchTeams = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/teams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch teams');
      }

      const data = await response.json();
      setTeams(data);
      
      // Set first team as current if no current team is selected
      if (data.length > 0 && !currentTeam) {
        setCurrentTeam(data[0]);
        localStorage.setItem('currentTeam', JSON.stringify(data[0]));
        fetchTeamMembers(data[0].id);
      }
    } catch (error) {
      console.error('Fetch teams error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (name: string, description: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create team');
      }

      const newTeam = await response.json();
      setTeams([...teams, newTeam]);
      setCurrentTeam(newTeam);
      localStorage.setItem('currentTeam', JSON.stringify(newTeam));
    } catch (error) {
      console.error('Create team error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeam = async (id: string, name: string, description: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/teams/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update team');
      }

      const updatedTeam = await response.json();
      setTeams(teams.map(team => team.id === id ? updatedTeam : team));
      
      if (currentTeam?.id === id) {
        setCurrentTeam(updatedTeam);
        localStorage.setItem('currentTeam', JSON.stringify(updatedTeam));
      }
    } catch (error) {
      console.error('Update team error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeam = async (id: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/teams/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete team');
      }

      const updatedTeams = teams.filter(team => team.id !== id);
      setTeams(updatedTeams);
      
      if (currentTeam?.id === id) {
        const newCurrentTeam = updatedTeams.length > 0 ? updatedTeams[0] : null;
        setCurrentTeam(newCurrentTeam);
        
        if (newCurrentTeam) {
          localStorage.setItem('currentTeam', JSON.stringify(newCurrentTeam));
          fetchTeamMembers(newCurrentTeam.id);
        } else {
          localStorage.removeItem('currentTeam');
          setTeamMembers([]);
        }
      }
    } catch (error) {
      console.error('Delete team error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/teams/${teamId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch team members');
      }

      const data = await response.json();
      setTeamMembers(data);
      return data;
    } catch (error) {
      console.error('Fetch team members error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = async (teamId: string, email: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add team member');
      }

      // Refresh team members list
      const members = await fetchTeamMembers(teamId);
      setTeamMembers(members);
    } catch (error) {
      console.error('Add team member error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeTeamMember = async (teamId: string, userId: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove team member');
      }

      // Update local state
      setTeamMembers(teamMembers.filter(member => member.userId !== userId));
    } catch (error) {
      console.error('Remove team member error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemberRole = async (teamId: string, userId: string, role: 'ADMIN' | 'MEMBER') => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/teams/${teamId}/members/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update member role');
      }

      // Update local state
      setTeamMembers(teamMembers.map(member => {
        if (member.userId === userId && member.teamId === teamId) {
          return { ...member, role };
        }
        return member;
      }));
    } catch (error) {
      console.error('Update member role error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    teams,
    currentTeam,
    teamMembers,
    isLoading,
    error,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    setCurrentTeam,
    fetchTeamMembers,
    addTeamMember,
    removeTeamMember,
    updateMemberRole,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}