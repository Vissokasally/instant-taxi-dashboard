
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsSection from '@/components/dashboard/StatsSection';
import ChartsSection from '@/components/dashboard/ChartsSection';
import TablesSection from '@/components/dashboard/TablesSection';

const Index = () => {
  return (
    <AppLayout>
      <DashboardHeader />
      <StatsSection />
      <ChartsSection />
      <TablesSection />
    </AppLayout>
  );
};

export default Index;
