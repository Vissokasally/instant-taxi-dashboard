
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import RepairForm from '@/components/repairs/RepairForm';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, FileText, Car, Calendar, DollarSign, FileDown, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type Repair = {
  id: string;
  veiculo_id: string;
  peca: string;
  data: string;
  preco: number;
  descricao: string | null;
  recibo_pdf_url: string | null;
  veiculoInfo?: {
    marca: string;
    modelo: string;
    matricula: string;
  };
};

const Repairs = () => {
  const [openForm, setOpenForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar reparações com join para informações do veículo
  const { data: repairs = [], isLoading } = useQuery({
    queryKey: ['repairs'],
    queryFn: async () => {
      // Primeiro, buscar as reparações
      const { data: repairsData, error: repairsError } = await supabase
        .from('reparacoes')
        .select('*')
        .order('data', { ascending: false });
        
      if (repairsError) throw repairsError;
      
      // Se não houver reparações, retornar lista vazia
      if (!repairsData || repairsData.length === 0) return [];
      
      // Buscar os veículos correspondentes
      const vehicleIds = repairsData.map(repair => repair.veiculo_id);
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('veiculos')
        .select('id, marca, modelo, matricula')
        .in('id', vehicleIds);
        
      if (vehiclesError) throw vehiclesError;
      
      // Combinar os dados
      const repairsWithVehicleInfo = repairsData.map(repair => {
        const vehicle = vehiclesData?.find(v => v.id === repair.veiculo_id);
        return {
          ...repair,
          veiculoInfo: vehicle ? {
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            matricula: vehicle.matricula
          } : undefined
        };
      });
      
      return repairsWithVehicleInfo;
    }
  });

  // Configurar listener para atualizações em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('public:reparacoes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'reparacoes'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['repairs'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  // Função para excluir uma reparação
  const handleDeleteRepair = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reparacoes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Reparação excluída",
        description: "A reparação foi excluída com sucesso."
      });
    } catch (error: any) {
      console.error('Erro ao excluir reparação:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir a reparação. Tente novamente."
      });
    }
  };

  // Função para exportar relatório de reparações
  const exportRepairReport = () => {
    try {
      // Criar um novo documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(18);
      doc.text('Relatório de Reparações', 14, 22);
      
      // Adicionar data de geração
      doc.setFontSize(10);
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
      
      // Preparar dados para a tabela
      const tableColumn = ["Veículo", "Peça", "Data", "Preço (AOA)", "Descrição"];
      const tableRows = repairs.map((repair) => [
        `${repair.veiculoInfo?.marca || ''} ${repair.veiculoInfo?.modelo || ''} - ${repair.veiculoInfo?.matricula || ''}`,
        repair.peca,
        format(new Date(repair.data), 'dd/MM/yyyy'),
        repair.preco.toLocaleString('pt-AO'),
        repair.descricao || ''
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
      
      // Adicionar rodapé com custos totais
      const totalCost = repairs.reduce((sum, repair) => sum + repair.preco, 0);
      doc.setFontSize(12);
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Custo Total: ${totalCost.toLocaleString('pt-AO')} AOA`, 14, finalY);
      doc.text(`Total de Reparações: ${repairs.length}`, 14, finalY + 8);
      
      // Salvar o PDF
      const fileName = `relatorio_reparacoes_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
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
  const totalRepairs = repairs.length;
  const totalCost = repairs.reduce((sum, repair) => sum + repair.preco, 0);
  const averageCost = totalRepairs > 0 ? totalCost / totalRepairs : 0;

  // Tabela de reparações
  const repairsColumns = [
    { 
      header: 'Veículo', 
      accessorKey: 'veiculoInfo' as const,
      cell: (row: Repair) => (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span>
            {row.veiculoInfo 
              ? `${row.veiculoInfo.marca} ${row.veiculoInfo.modelo} - ${row.veiculoInfo.matricula}`
              : 'Veículo não encontrado'}
          </span>
        </div>
      )
    },
    { header: 'Peça', accessorKey: 'peca' as const },
    { 
      header: 'Data', 
      accessorKey: 'data' as const,
      cell: (row: Repair) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(row.data), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    { 
      header: 'Preço', 
      accessorKey: 'preco' as const,
      cell: (row: Repair) => (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>{row.preco.toLocaleString('pt-AO')} AOA</span>
        </div>
      )
    },
    { header: 'Descrição', accessorKey: 'descricao' as const },
    { 
      header: 'Recibo', 
      accessorKey: 'recibo_pdf_url' as const,
      cell: (row: Repair) => (
        <>
          {row.recibo_pdf_url ? (
            <a 
              href={row.recibo_pdf_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 bg-gray-50 text-sm hover:bg-gray-100 transition"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Ver Recibo</span>
            </a>
          ) : (
            <span className="text-muted-foreground text-sm">Não disponível</span>
          )}
        </>
      )
    },
    { 
      header: 'Ações', 
      accessorKey: 'id' as const,
      cell: (row: Repair) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            onClick={() => handleDeleteRepair(row.id)}
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
        <h1 className="text-3xl font-bold mb-6">Gestão de Reparações</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Registe e gerencie as reparações realizadas nos veículos da sua frota.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={exportRepairReport}
            >
              <Download className="h-4 w-4" />
              <span>Exportar Relatório</span>
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setOpenForm(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Reparação</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total de Reparações" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">{totalRepairs}</div>
            <p className="text-sm text-muted-foreground">Este ano</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Custo Total" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">
              {totalCost.toLocaleString('pt-AO')}
            </div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Custo Médio" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">
              {averageCost.toLocaleString('pt-AO', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-sm text-muted-foreground">AOA / reparação</p>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Histórico de Reparações">
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={repairsColumns} 
            data={repairs}
            loading={isLoading}
            emptyState={
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">Nenhuma reparação registrada.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setOpenForm(true)}
                >
                  Registrar Reparação
                </Button>
              </div>
            }
          />
        </div>
      </DashboardCard>

      <RepairForm 
        open={openForm} 
        onOpenChange={setOpenForm} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['repairs'] })}
      />
    </AppLayout>
  );
};

export default Repairs;
