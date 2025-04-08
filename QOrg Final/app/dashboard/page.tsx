'use client';

import React from 'react';
import PageContainer from '@/PageContainer'; // Adjust path if needed
import { useAuth } from '@/useAuth'; // Optional: Use auth to personalize

export default function DashboardHomePage() {
  const { user } = useAuth();

  return (
    <PageContainer title="Dashboard">
      <h1 className="text-3xl font-semibold text-[#004B87] mb-4">
        Welcome{user ? `, ${user.email}` : ''}!
      </h1>
      <p className="text-lg text-gray-700">
        Select an option from the sidebar to view and manage the Quality Organization details.
      </p>
      {/* TODO: Add overview widgets or summary information here */}
    </PageContainer>
  );
} 