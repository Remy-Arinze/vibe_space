'use client';

import * as React from 'react';
import { Toast, ToastTitle, ToastDescription, ToastClose } from './toast';

type ToastType = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  type?: 'default' | 'success' | 'error' | 'warning';
};

type ToastContextType = {
  addToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): React.ReactElement {
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  const addToast = React.useCallback(
    ({ title, description, duration = 5000, type = 'default' }: Omit<ToastType, 'id'>): void => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev: ToastType[]) => [...prev, { id, title, description, duration, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = React.useCallback((id: string): void => {
    setToasts((prev: ToastType[]) => prev.filter((toast: ToastType) => toast.id !== id));
  }, []);

  // Get toast type-specific styles
  const getToastTypeStyles = (type: ToastType['type'] = 'default'): string => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return '';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map((toast: ToastType) => (
          <Toast key={toast.id} className={getToastTypeStyles(toast.type)}>
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
            <ToastClose onClick={() => removeToast(toast.id)} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}