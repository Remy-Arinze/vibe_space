'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { TeamProvider } from './TeamContext';
import { TaskProvider } from './TaskContext';
import { ToastProvider } from '@/components/ui/toast-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TeamProvider>
        <TaskProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </TaskProvider>
      </TeamProvider>
    </AuthProvider>
  );
}