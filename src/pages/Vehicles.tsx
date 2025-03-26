
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Car, Users, Calendar, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPdfReport } from '@/utils/pdfGenerator';

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

  const totalVehicles = vehicles.length;
  const averageKm = totalVehicles > 0 
    ? vehicles.reduce((sum, v) => sum + v.quilometragem, 0) / totalVehicles 
    : 0;
  const averageAge = totalVehicles > 0 
    ? vehicles.reduce((sum, v) => sum + (new Date().getFullYear() - v.ano), 0) / totalVehicles 
    : 0;

  const vehiclesColumns = [
    { 
      header: 'Veículo', 
      accessorKey: 'marca' as const,
      cell: (row: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Car className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">
              {row.marca} {row.modelo}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.matricula}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: 'Ano', 
      accessorKey: 'ano' as const 
    },
    { 
      header: 'Quilometragem', 
      accessorKey: 'quilometragem' as const,
      cell: (row: Vehicle) => (
        <span>{row.quilometragem.toLocaleString('pt-AO')} km</span>
      )
    },
    { 
      header: 'Motorista', 
      accessorKey: 'motorista' as const,
      cell: (row: Vehicle) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.motorista?.nome || 'Não atribuído'}</span>
        </div>
      )
    },
    { 
      header: 'Ações', 
      accessorKey: 'id' as const,
      cell: (row: Vehicle) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            onClick={() => handleDeleteVehicle(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão de Veículos</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Gerencie todos os veículos da sua frota de táxis.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={exportVehicleReport}
            >
              <Download className="h-4 w-4" />
              <span>Exportar Relatório</span>
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setOpenForm(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Veículo</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Veículos Ativos" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">{totalVehicles}</div>
            <p className="text-sm text-muted-foreground">Total da frota</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Quilometragem Média" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">
              {Math.round(averageKm).toLocaleString('pt-AO')}
            </div>
            <p className="text-sm text-muted-foreground">Quilómetros</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Idade Média" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">{averageAge.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">Anos</p>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Lista de Veículos">
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={vehiclesColumns} 
            data={vehicles}
            loading={isLoading}
            emptyState={
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">Nenhum veículo registrado.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setOpenForm(true)}
                >
                  Adicionar Veículo
                </Button>
              </div>
            }
          />
        </div>
      </DashboardCard>

      <VehicleForm 
        open={openForm} 
        onOpenChange={setOpenForm} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['vehicles'] })}
      />
    </AppLayout>
  );
};

export default Vehicles;
