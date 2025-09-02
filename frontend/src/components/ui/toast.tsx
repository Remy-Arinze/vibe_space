'use client';

import * as React from 'react';

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className = '', ...props }, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-lg border border-gray-200 shadow-md p-4 my-4 relative ${className}`}
        {...props}
      />
    );
  }
);
Toast.displayName = 'Toast';

interface ToastTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

const ToastTitle = React.forwardRef<HTMLHeadingElement, ToastTitleProps>(
  ({ className = '', ...props }, ref: React.Ref<HTMLHeadingElement>) => {
    return (
      <h5
        ref={ref}
        className={`text-lg font-semibold mb-1 ${className}`}
        {...props}
      />
    );
  }
);
ToastTitle.displayName = 'ToastTitle';

interface ToastDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

const ToastDescription = React.forwardRef<HTMLParagraphElement, ToastDescriptionProps>(
  ({ className = '', ...props }, ref: React.Ref<HTMLParagraphElement>) => {
    return (
      <p
        ref={ref}
        className={`text-sm text-gray-500 ${className}`}
        {...props}
      />
    );
  }
);
ToastDescription.displayName = 'ToastDescription';

interface ToastActionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const ToastAction = React.forwardRef<HTMLDivElement, ToastActionProps>(
  ({ className = '', ...props }, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className={`absolute top-2 right-2 ${className}`}
        {...props}
      />
    );
  }
);
ToastAction.displayName = 'ToastAction';

interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className = '', ...props }, ref: React.Ref<HTMLButtonElement>) => {
    return (
      <button
        ref={ref}
        className={`rounded-full h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
        {...props}
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    );
  }
);
ToastClose.displayName = 'ToastClose';

export { Toast, ToastTitle, ToastDescription, ToastAction, ToastClose };