
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DriverForm from '@/components/drivers/DriverForm';

// Interface para os dados do motorista
interface Driver {
  id: string;
  nome: string;
  bi: string;
  carta_conducao: string;
  morada: string;
  foto_url: string | null;
  bi_pdf_url: string | null;
  carta_pdf_url: string | null;
}

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDriverForm, setOpenDriverForm] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Tabela de colunas
  const driversColumns = [
    { 
      header: 'Motorista', 
      accessorKey: 'nome' as const,
      cell: (row: Driver) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.foto_url || 'https://randomuser.me/api/portraits/men/32.jpg'} 
            alt={row.nome} 
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
          <span className="font-medium">{row.nome}</span>
        </div>
      )
    },
    { header: 'BI', accessorKey: 'bi' as const },
    { header: 'Carta de Condução', accessorKey: 'carta_conducao' as const },
    { header: 'Morada', accessorKey: 'morada' as const },
    { 
      header: 'Ações', 
      accessorKey: 'id' as const,
      cell: (row: Driver) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handleEditDriver(row.id)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            onClick={() => handleDeleteDriver(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  // Função para carregar motoristas
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('motoristas')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      
      setDrivers(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar motoristas:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os motoristas. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir o formulário de edição
  const handleEditDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
    setOpenDriverForm(true);
  };

  // Função para abrir o formulário de adição
  const handleAddDriver = () => {
    setSelectedDriverId(undefined);
    setOpenDriverForm(true);
  };

  // Função para excluir motorista
  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm('Tem certeza que deseja excluir este motorista?')) return;
    
    try {
      const { error } = await supabase
        .from('motoristas')
        .delete()
        .eq('id', driverId);
        
      if (error) throw error;
      
      toast({
        title: "Motorista excluído",
        description: "O motorista foi excluído com sucesso.",
      });
      
      // Atualizar a lista
      fetchDrivers();
    } catch (error: any) {
      console.error('Erro ao excluir motorista:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o motorista. Tente novamente.",
      });
    }
  };

  // Carregar dados quando o componente for montado
  useEffect(() => {
    fetchDrivers();

    // Configurar listener para atualizações em tempo real
    const channel = supabase
      .channel('public:motoristas')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'motoristas'
      }, () => {
        fetchDrivers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão de Motoristas</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Gerencie todos os motoristas da sua frota de táxis.
          </p>
          <Button className="flex items-center gap-2" onClick={handleAddDriver}>
            <Plus className="h-4 w-4" />
            <span>Adicionar Motorista</span>
          </Button>
        </div>
      </header>

      <DashboardCard title="Lista de Motoristas">
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={driversColumns} 
            data={drivers}
            loading={loading}
            emptyState={
              <div className="text-center py-10">
                <h3 className="mt-2 text-lg font-medium">Nenhum motorista encontrado</h3>
                <p className="mt-1 text-muted-foreground">
                  Adicione seu primeiro motorista para começar.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={handleAddDriver}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Motorista
                </Button>
              </div>
            }
          />
        </div>
      </DashboardCard>

      <DriverForm 
        open={openDriverForm} 
        onOpenChange={setOpenDriverForm} 
        onSuccess={fetchDrivers}
        driverId={selectedDriverId}
      />
    </AppLayout>
  );
};

export default Drivers;
