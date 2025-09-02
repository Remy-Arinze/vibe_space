import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { ReactNode } from 'react';

export default function TeamsLayout({ children }: { children: ReactNode }) {
  return (
   <ProtectedRoute>
         <div className="flex h-screen bg-gray-50">
           <Sidebar />
           <div className="flex-1 flex flex-col overflow-hidden">
             <Header />
             <main className="flex-1 overflow-y-auto p-4">
               {children}
             </main>
           </div>
         </div>
       </ProtectedRoute>
  );
}