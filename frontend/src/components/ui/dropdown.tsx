'use client';

import * as React from 'react';

const Dropdown = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`relative inline-block text-left ${className}`}
    {...props}
  />
));
Dropdown.displayName = 'Dropdown';

const DropdownTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex cursor-pointer ${className}`}
    {...props}
  />
));
DropdownTrigger.displayName = 'DropdownTrigger';

const DropdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${className}`}
    {...props}
  />
));
DropdownContent.displayName = 'DropdownContent';

const DropdownItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${className}`}
    {...props}
  />
));
DropdownItem.displayName = 'DropdownItem';

export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem };