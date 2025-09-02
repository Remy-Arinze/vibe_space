'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useTeam } from './TeamContext';

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creatorId: string;
  assigneeId: string | null;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    username: string;
  };
  assignee?: {
    id: string;
    username: string;
  } | null;
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchAssignedTasks: () => Promise<void>;
  fetchCreatedTasks: () => Promise<void>;
  createTask: (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    teamId: string;
    assigneeId?: string;
  }) => Promise<void>;
  updateTask: (id: string, data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string | null;
  }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTaskById: (id: string) => Promise<any>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const { currentTeam } = useTeam();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && currentTeam) {
      fetchTasks();
    }
  }, [token, currentTeam]);

  const fetchTasks = async () => {
    if (!token || !currentTeam) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/tasks/team/${currentTeam.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignedTasks = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/tasks/assigned', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch assigned tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch assigned tasks error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreatedTasks = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/tasks/created', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch created tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Fetch created tasks error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    teamId: string;
    assigneeId?: string;
  }) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Create task error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, data: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    assigneeId?: string | null;
  }) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Update task error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Delete task error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTaskById = async (id: string) => {
    if (!token) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch task');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch task error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    tasks,
    isLoading,
    error,
    fetchTasks,
    fetchAssignedTasks,
    fetchCreatedTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTaskById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}