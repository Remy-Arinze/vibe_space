'use client';

import * as React from 'react';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return open ? <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">{children}</div> : null;
};

const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ asChild, children }) => {
  return <>{children}</>;
};

const DialogContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return <div className={`bg-white p-6 rounded-lg shadow-lg max-w-md w-full ${className || ''}`}>{children}</div>;
};

const DialogHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return <div className={`mb-4 ${className || ''}`}>{children}</div>;
};

const DialogTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return <h2 className={`text-lg font-semibold ${className || ''}`}>{children}</h2>;
};

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };