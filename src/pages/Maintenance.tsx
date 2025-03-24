
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calendar, Clock, AlertTriangle, Check, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, isBefore, isAfter } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type Maintenance = {
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

const Maintenance = () => {
  const [openForm, setOpenForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date();

  // Buscar manutenções com join para informações do veículo
  const { data: maintenances = [], isLoading } = useQuery({
    queryKey: ['maintenances'],
    queryFn: async () => {
      // Primeiro, buscar as manutenções
      const { data: maintenancesData, error: maintenancesError } = await supabase
        .from('manutencoes')
        .select('*')
        .order('data_agendada', { ascending: false });
        
      if (maintenancesError) throw maintenancesError;
      
      // Se não houver manutenções, retornar lista vazia
      if (!maintenancesData || maintenancesData.length === 0) return [];
      
      // Buscar os veículos correspondentes
      const vehicleIds = maintenancesData.map(maintenance => maintenance.veiculo_id);
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('veiculos')
        .select('id, marca, modelo, matricula, motorista_id');
        
      if (vehiclesError) throw vehiclesError;
      
      // Buscar informações dos motoristas
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
      
      // Combinar os dados e calcular o estado da manutenção
      const maintenancesWithInfo = maintenancesData.map(maintenance => {
        const vehicle = vehiclesData?.find(v => v.id === maintenance.veiculo_id);
        let driverName;
        
        if (vehicle?.motorista_id) {
          const driver = driversData.find(d => d.id === vehicle.motorista_id);
          driverName = driver ? driver.nome : undefined;
        }
        
        // Determinar o estado da manutenção
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

  // Configurar listener para atualizações em tempo real
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
  
  // Marcar manutenção como realizada
  const handleCompleteMaintenance = async (id: string) => {
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
    } catch (error: any) {
      console.error('Erro ao atualizar manutenção:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível atualizar a manutenção. Tente novamente."
      });
    }
  };
  
  // Função para excluir uma manutenção
  const handleDeleteMaintenance = async (id: string) => {
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
    } catch (error: any) {
      console.error('Erro ao excluir manutenção:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o agendamento. Tente novamente."
      });
    }
  };

  // Função para exportar relatório de manutenções
  const exportMaintenanceReport = () => {
    try {
      // Criar um novo documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(18);
      doc.text('Relatório de Manutenções', 14, 22);
      
      // Adicionar data de geração
      doc.setFontSize(10);
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
      
      // Preparar dados para a tabela
      const tableColumn = ["Veículo", "Motorista", "Data Agendada", "Estado"];
      const tableRows = maintenances.map((maint) => [
        `${maint.veiculoInfo?.marca || ''} ${maint.veiculoInfo?.modelo || ''} - ${maint.veiculoInfo?.matricula || ''}`,
        maint.veiculoInfo?.motorista || 'Não atribuído',
        format(new Date(maint.data_agendada), 'dd/MM/yyyy'),
        maint.estado
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
        },
        // Colorir linhas com base no estado
        rowStyles: maintenances.map(m => {
          if (m.estado === 'Realizada') return { textColor: [39, 174, 96] };
          if (m.estado === 'Atrasada') return { textColor: [192, 57, 43] };
          return { textColor: [243, 156, 18] };
        })
      });
      
      // Adicionar rodapé com estatísticas
      const pendentes = maintenances.filter(m => m.estado === 'Pendente').length;
      const atrasadas = maintenances.filter(m => m.estado === 'Atrasada').length;
      const realizadas = maintenances.filter(m => m.estado === 'Realizada').length;
      
      doc.setFontSize(12);
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Manutenções Pendentes: ${pendentes}`, 14, finalY);
      doc.text(`Manutenções Atrasadas: ${atrasadas}`, 14, finalY + 8);
      doc.text(`Manutenções Realizadas: ${realizadas}`, 14, finalY + 16);
      doc.text(`Total de Manutenções: ${maintenances.length}`, 14, finalY + 24);
      
      // Salvar o PDF
      const fileName = `relatorio_manutencoes_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
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
  const pendingMaintenances = maintenances.filter(m => m.estado === 'Pendente').length;
  const lateMaintenances = maintenances.filter(m => m.estado === 'Atrasada').length;
  const completedMaintenances = maintenances.filter(m => m.estado === 'Realizada').length;

  // Tabela de manutenções
  const maintenanceColumns = [
    { 
      header: 'Veículo', 
      accessorKey: 'veiculoInfo' as const,
      cell: (row: Maintenance) => (
        <div>
          {row.veiculoInfo 
            ? `${row.veiculoInfo.marca} ${row.veiculoInfo.modelo} - ${row.veiculoInfo.matricula}`
            : 'Veículo não encontrado'}
        </div>
      )
    },
    { 
      header: 'Motorista', 
      accessorKey: 'veiculoInfo.motorista' as const,
      cell: (row: Maintenance) => (
        <span>{row.veiculoInfo?.motorista || 'Não atribuído'}</span>
      )
    },
    { 
      header: 'Data Agendada', 
      accessorKey: 'data_agendada' as const,
      cell: (row: Maintenance) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(row.data_agendada), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    { 
      header: 'Estado', 
      accessorKey: 'estado' as const,
      cell: (row: Maintenance) => {
        const statusConfig = {
          'Realizada': { icon: Check, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
          'Pendente': { icon: Clock, bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
          'Atrasada': { icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
        };
        
        const status = row.estado as keyof typeof statusConfig;
        const config = statusConfig[status];
        const Icon = config.icon;
        
        return (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${config.bg} ${config.text} ${config.border}`}>
              <Icon className="h-3 w-3" />
              <span>{row.estado}</span>
            </span>
          </div>
        );
      }
    },
    { 
      header: 'Ações', 
      accessorKey: 'id' as const,
      cell: (row: Maintenance) => (
        <div className="flex items-center gap-2">
          {row.estado !== 'Realizada' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs flex items-center gap-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
              onClick={() => handleCompleteMaintenance(row.id)}
            >
              <Check className="h-3 w-3" />
              <span>Concluir</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            onClick={() => handleDeleteMaintenance(row.id)}
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
        <h1 className="text-3xl font-bold mb-6">Gestão de Manutenção</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Agende e gerencie manutenções para os veículos da sua frota.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={exportMaintenanceReport}
            >
              <Download className="h-4 w-4" />
              <span>Exportar Relatório</span>
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setOpenForm(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Agendar Manutenção</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Manutenções Pendentes" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-yellow-500 mb-2">{pendingMaintenances}</div>
            <p className="text-sm text-muted-foreground">Agendadas</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Manutenções Atrasadas" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-red-500 mb-2">{lateMaintenances}</div>
            <p className="text-sm text-muted-foreground">Necessitam atenção</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Manutenções Realizadas" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-green-500 mb-2">{completedMaintenances}</div>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DashboardCard title="Calendário de Manutenção">
          <div className="border border-border rounded-lg overflow-hidden">
            <DataTable 
              columns={maintenanceColumns} 
              data={maintenances}
              loading={isLoading}
              rowClassName={(row) => {
                if (row.estado === 'Atrasada') return 'bg-red-50/50';
                if (row.estado === 'Pendente') return 'bg-yellow-50/50';
                return '';
              }}
              emptyState={
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">Nenhuma manutenção agendada.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setOpenForm(true)}
                  >
                    Agendar Manutenção
                  </Button>
                </div>
              }
            />
          </div>
        </DashboardCard>
      </div>

      <MaintenanceForm 
        open={openForm} 
        onOpenChange={setOpenForm} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['maintenances'] })}
      />
    </AppLayout>
  );
};

export default Maintenance;
