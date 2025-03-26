
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isBefore } from 'date-fns';

export type Maintenance = {
  id: string;
  veiculo_id: string;
  data_agendada: string;
  realizada: boolean;
  veiculoInfo?: {
    marca: string;
    modelo: string;
    matricula: string;
    motorista?: string;
  };
  estado: 'Realizada' | 'Pendente' | 'Atrasada';
};

export function useMaintenanceData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date();

  // Fetch maintenance data with vehicle information
  const { data: maintenances = [], isLoading } = useQuery({
    queryKey: ['maintenances'],
    queryFn: async () => {
      // Fetch maintenance records
      const { data: maintenancesData, error: maintenancesError } = await supabase
        .from('manutencoes')
        .select('*')
        .order('data_agendada', { ascending: false });
        
      if (maintenancesError) throw maintenancesError;
      
      // If no maintenance records, return empty array
      if (!maintenancesData || maintenancesData.length === 0) return [];
      
      // Fetch related vehicles
      const vehicleIds = maintenancesData.map(maintenance => maintenance.veiculo_id);
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('veiculos')
        .select('id, marca, modelo, matricula, motorista_id');
        
      if (vehiclesError) throw vehiclesError;
      
      // Fetch driver information
      const driverIds = vehiclesData?.filter(v => v.motorista_id).map(v => v.motorista_id) || [];
      let driversData: any[] = [];
      
      if (driverIds.length > 0) {
        const { data: drivers, error: driversError } = await supabase
          .from('motoristas')
          .select('id, nome')
          .in('id', driverIds);
          
        if (!driversError && drivers) {
          driversData = drivers;
        }
      }
      
      // Combine data and calculate maintenance status
      const maintenancesWithInfo = maintenancesData.map(maintenance => {
        const vehicle = vehiclesData?.find(v => v.id === maintenance.veiculo_id);
        let driverName;
        
        if (vehicle?.motorista_id) {
          const driver = driversData.find(d => d.id === vehicle.motorista_id);
          driverName = driver ? driver.nome : undefined;
        }
        
        // Determine maintenance status
        let estado: 'Realizada' | 'Pendente' | 'Atrasada';
        if (maintenance.realizada) {
          estado = 'Realizada';
        } else if (isBefore(new Date(maintenance.data_agendada), today)) {
          estado = 'Atrasada';
        } else {
          estado = 'Pendente';
        }
        
        return {
          ...maintenance,
          estado,
          veiculoInfo: vehicle ? {
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            matricula: vehicle.matricula,
            motorista: driverName
          } : undefined
        };
      });
      
      return maintenancesWithInfo;
    }
  });

  // Setup realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('public:manutencoes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'manutencoes'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['maintenances'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Mark maintenance as completed
  const completeMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('manutencoes')
        .update({ realizada: true })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Manutenção concluída",
        description: "A manutenção foi marcada como realizada com sucesso."
      });
      
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
    } catch (error: any) {
      console.error('Erro ao atualizar manutenção:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível atualizar a manutenção. Tente novamente."
      });
    }
  };
  
  // Delete maintenance record
  const deleteMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('manutencoes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Agendamento excluído",
        description: "O agendamento de manutenção foi excluído com sucesso."
      });
      
      queryClient.invalidateQueries({ queryKey: ['maintenances'] });
    } catch (error: any) {
      console.error('Erro ao excluir manutenção:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o agendamento. Tente novamente."
      });
    }
  };

  // Calculate maintenance statistics
  const stats = {
    pending: maintenances.filter(m => m.estado === 'Pendente').length,
    late: maintenances.filter(m => m.estado === 'Atrasada').length,
    completed: maintenances.filter(m => m.estado === 'Realizada').length
  };

  return {
    maintenances,
    isLoading,
    stats,
    completeMaintenance,
    deleteMaintenance
  };
}
