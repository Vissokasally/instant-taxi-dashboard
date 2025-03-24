
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
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  // Buscar veículos com join para informações do motorista
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('marca', { ascending: true });
        
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      // Buscar informações dos motoristas
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
      
      // Combinar os dados
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

  // Configurar listener para atualizações em tempo real
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
  
  // Função para excluir um veículo
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

  // Função para exportar relatório de veículos
  const exportVehicleReport = () => {
    try {
      // Criar um novo documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(18);
      doc.text('Relatório de Veículos', 14, 22);
      
      // Adicionar data de geração
      doc.setFontSize(10);
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
      
      // Preparar dados para a tabela
      const tableColumn = ["Marca", "Modelo", "Matrícula", "Ano", "Quilometragem", "Motorista"];
      const tableRows = vehicles.map((vehicle) => [
        vehicle.marca,
        vehicle.modelo,
        vehicle.matricula,
        vehicle.ano.toString(),
        vehicle.quilometragem.toLocaleString('pt-AO') + ' km',
        vehicle.motorista?.nome || 'Não atribuído'
      ]);
      
      // Adicionar tabela ao PDF
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255
        }
      });
      
      // Adicionar rodapé com estatísticas
      const averageAge = vehicles.reduce((sum, v) => sum + (new Date().getFullYear() - v.ano), 0) / vehicles.length || 0;
      const averageKm = vehicles.reduce((sum, v) => sum + v.quilometragem, 0) / vehicles.length || 0;
      
      doc.setFontSize(12);
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total de Veículos: ${vehicles.length}`, 14, finalY);
      doc.text(`Quilometragem Média: ${averageKm.toLocaleString('pt-AO')} km`, 14, finalY + 8);
      doc.text(`Idade Média: ${averageAge.toFixed(1)} anos`, 14, finalY + 16);
      
      // Salvar o PDF
      const fileName = `relatorio_veiculos_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
      doc.save(fileName);
      
      // Fazer upload do relatório para Supabase Storage (opcional)
      const pdfBlob = doc.output('blob');
      const uploadFile = async () => {
        try {
          const { error } = await supabase.storage
            .from('relatorios')
            .upload(fileName, pdfBlob);
            
          if (error) throw error;
        } catch (error) {
          console.error('Erro ao fazer upload do relatório:', error);
        }
      };
      
      uploadFile();
      
      toast({
        title: "Relatório exportado",
        description: "O relatório foi exportado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível exportar o relatório. Tente novamente."
      });
    }
  };

  // Calcular estatísticas
  const totalVehicles = vehicles.length;
  const averageKm = totalVehicles > 0 
    ? vehicles.reduce((sum, v) => sum + v.quilometragem, 0) / totalVehicles 
    : 0;
  const averageAge = totalVehicles > 0 
    ? vehicles.reduce((sum, v) => sum + (new Date().getFullYear() - v.ano), 0) / totalVehicles 
    : 0;

  // Tabela de veículos
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
