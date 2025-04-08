'use client';

import React, { useState } from 'react';
import Sidebar from '@/Sidebar'; // Reverted: Removed .tsx extension
import Header from '@/Header'; // Reverted: Removed .tsx extension
import { DataProvider } from '@/DataContext'; // Reverted: Removed .tsx extension
// import ProtectedRoute from '@/ProtectedRoute'; // Import ProtectedRoute
// Note: ProtectedRoute logic needs review/update based on current auth setup

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // TODO: Wrap with updated ProtectedRoute logic if needed
  // return (
  //   <ProtectedRoute>
  //     <div className="flex h-screen bg-gray-100">
  //       <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
  //       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
  //         <Header toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
  //         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
  //           {children}
  //         </main>
  //       </div>
  //     </div>
  //   </ProtectedRoute>
  // );

  // Temporarily rendering without ProtectedRoute until it's reviewed/updated
   return (
       // Wrap the content with DataProvider
       <DataProvider>
           <div className="flex h-screen bg-gray-100">
             <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
             <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
               <Header toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
               <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                 {children}
               </main>
             </div>
           </div>
       </DataProvider>
   );
} 