
import React, { useEffect, useState } from 'react';
import RevenueChart from './RevenueChart';
import MaintenanceAlerts from './MaintenanceAlerts';
import { supabase } from '@/integrations/supabase/client';

const ChartsSection: React.FC = () => {
  const [transactionData, setTransactionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transacoes')
          .select('*')
          .order('data', { ascending: false });
        
        if (error) throw error;
        setTransactionData(data || []);
      } catch (error) {
        console.error('Erro ao carregar transações para gráficos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    
    // Configurar listener para atualizações em tempo real
    const channel = supabase
      .channel('public:transacoes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'transacoes'
      }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <RevenueChart data={transactionData} loading={loading} />
      <MaintenanceAlerts />
    </div>
  );
};

export default ChartsSection;
