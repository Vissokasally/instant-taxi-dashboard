
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsSection from '@/components/dashboard/StatsSection';
import ChartsSection from '@/components/dashboard/ChartsSection';
import TablesSection from '@/components/dashboard/TablesSection';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  useEffect(() => {
    // Inicializar os buckets de armazenamento na primeira execução
    const setupStorage = async () => {
      try {
        await supabase.functions.invoke('setup-storage');
        console.log('Storage inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar storage:', error);
      }
    };

    setupStorage();
  }, []);

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
