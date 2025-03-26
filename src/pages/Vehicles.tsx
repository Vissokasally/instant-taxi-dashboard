
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPdfReport } from '@/utils/pdfGenerator';
import VehicleHeader from '@/components/vehicles/VehicleHeader';
import VehicleStats from '@/components/vehicles/VehicleStats';
import VehicleList from '@/components/vehicles/VehicleList';

type Vehicle = {
  id: string;
  marca: string;
  modelo: string;
  matricula: string;
  ano: number;
  quilometragem: number;
  motorista_id: string | null;
  updated_at: string;
  motorista?: {
    nome: string;
    foto_url?: string;
  };
};

const Vehicles = () => {
  const [openForm, setOpenForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('marca', { ascending: true });
        
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      const driverIds = data.filter(v => v.motorista_id).map(v => v.motorista_id);
      let driversData: any[] = [];
      
      if (driverIds.length > 0) {
        const { data: drivers, error: driversError } = await supabase
          .from('motoristas')
          .select('id, nome, foto_url')
          .in('id', driverIds);
          
        if (!driversError && drivers) {
          driversData = drivers;
        }
      }
      
      const vehiclesWithDrivers = data.map(vehicle => {
        let driverInfo;
        
        if (vehicle.motorista_id) {
          const driver = driversData.find(d => d.id === vehicle.motorista_id);
          if (driver) {
            driverInfo = {
              nome: driver.nome,
              foto_url: driver.foto_url
            };
          }
        }
        
        return {
          ...vehicle,
          motorista: driverInfo
        };
      });
      
      return vehiclesWithDrivers;
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('public:veiculos')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'veiculos'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  const handleDeleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Veículo excluído",
        description: "O veículo foi excluído com sucesso."
      });
    } catch (error: any) {
      console.error('Erro ao excluir veículo:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o veículo. Tente novamente."
      });
    }
  };

  const exportVehicleReport = () => {
    try {
      if (!vehicles || vehicles.length === 0) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não há veículos para exportar."
        });
        return;
      }
      
      const headers = ["Marca", "Modelo", "Matrícula", "Ano", "Quilometragem", "Motorista"];
      
      const rows = vehicles.map((vehicle) => [
        vehicle.marca,
        vehicle.modelo,
        vehicle.matricula,
        vehicle.ano.toString(),
        vehicle.quilometragem.toLocaleString('pt-AO') + ' km',
        vehicle.motorista?.nome || 'Não atribuído'
      ]);
      
      const totalVehicles = vehicles.length;
      const averageKm = totalVehicles > 0 
        ? vehicles.reduce((sum, v) => sum + v.quilometragem, 0) / totalVehicles 
        : 0;
      const averageAge = totalVehicles > 0 
        ? vehicles.reduce((sum, v) => sum + (new Date().getFullYear() - v.ano), 0) / totalVehicles 
        : 0;
      
      const summaryData = [
        { label: "Total de Veículos", value: totalVehicles.toString() },
        { label: "Quilometragem Média", value: Math.round(averageKm).toLocaleString('pt-AO') + ' km' },
        { label: "Idade Média", value: averageAge.toFixed(1) + ' anos' }
      ];
      
      const result = createPdfReport(
        "Relatório de Veículos",
        headers,
        rows,
        summaryData
      );
      
      toast({
        title: result.success ? "Relatório exportado" : "Erro",
        description: result.message
      });
      
    } catch (error: any) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível exportar o relatório. Tente novamente."
      });
    }
  };

  return (
    <AppLayout>
      <VehicleHeader 
        onAddVehicle={() => setOpenForm(true)}
        onExportReport={exportVehicleReport}
      />

      <VehicleStats vehicles={vehicles} />

      <VehicleList
        vehicles={vehicles}
        isLoading={isLoading}
        onAddVehicle={() => setOpenForm(true)}
        onDeleteVehicle={handleDeleteVehicle}
      />

      <VehicleForm 
        open={openForm} 
        onOpenChange={setOpenForm} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['vehicles'] })}
      />
    </AppLayout>
  );
};

export default Vehicles;
