
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calendar, Clock, AlertTriangle, Check } from 'lucide-react';

// Mock data for maintenance
const maintenanceMockData = [
  { 
    id: 1, 
    veiculo: 'Toyota Corolla - LD-23-45-AB',
    motorista: 'Manuel Silva', 
    data: '12/05/2023', 
    proximaData: '12/07/2023',
    estado: 'Realizada',
    notas: 'Troca de óleo e filtros'
  },
  { 
    id: 2, 
    veiculo: 'Hyundai Accent - LD-67-89-CD',
    motorista: 'João Martins', 
    data: '15/06/2023', 
    proximaData: '15/08/2023',
    estado: 'Pendente',
    notas: 'Verificação de travões e suspensão'
  },
  { 
    id: 3, 
    veiculo: 'Toyota Camry - LD-10-11-EF',
    motorista: 'Maria Fernandes', 
    data: '01/04/2023', 
    proximaData: '01/06/2023',
    estado: 'Atrasada',
    notas: 'Revisão geral'
  },
  { 
    id: 4, 
    veiculo: 'Nissan Sentra - LD-12-34-GH',
    motorista: 'António Costa', 
    data: '20/03/2023', 
    proximaData: '20/05/2023',
    estado: 'Atrasada',
    notas: 'Troca de óleo e verificação de sistemas elétricos'
  },
  { 
    id: 5, 
    veiculo: 'Honda Civic - LD-56-78-IJ',
    motorista: 'Teresa Santos', 
    data: '05/06/2023', 
    proximaData: '05/08/2023',
    estado: 'Pendente',
    notas: 'Verificação do ar condicionado e alinhamento'
  },
];

// Table columns
const maintenanceColumns = [
  { 
    header: 'Veículo', 
    accessorKey: 'veiculo' as const
  },
  { 
    header: 'Motorista', 
    accessorKey: 'motorista' as const 
  },
  { 
    header: 'Última Manutenção', 
    accessorKey: 'data' as const
  },
  { 
    header: 'Próxima Manutenção', 
    accessorKey: 'proximaData' as const
  },
  { 
    header: 'Estado', 
    accessorKey: 'estado' as const,
    cell: (row: typeof maintenanceMockData[0]) => {
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
    header: 'Notas', 
    accessorKey: 'notas' as const 
  },
  { 
    header: 'Ações', 
    accessorKey: 'id' as const,
    cell: (row: typeof maintenanceMockData[0]) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  },
];

const Maintenance = () => {
  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão de Manutenção</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Agende e gerencie manutenções para os veículos da sua frota.
          </p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Agendar Manutenção</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Manutenções Pendentes" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-yellow-500 mb-2">2</div>
            <p className="text-sm text-muted-foreground">Agendadas</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Manutenções Atrasadas" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-red-500 mb-2">2</div>
            <p className="text-sm text-muted-foreground">Necessitam atenção</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Manutenções Realizadas" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-green-500 mb-2">1</div>
            <p className="text-sm text-muted-foreground">Este mês</p>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DashboardCard title="Calendário de Manutenção">
          <div className="border border-border rounded-lg overflow-hidden">
            <DataTable 
              columns={maintenanceColumns} 
              data={maintenanceMockData}
              rowClassName={(row) => {
                if (row.estado === 'Atrasada') return 'bg-red-50/50';
                if (row.estado === 'Pendente') return 'bg-yellow-50/50';
                return '';
              }}
            />
          </div>
        </DashboardCard>
      </div>
    </AppLayout>
  );
};

export default Maintenance;
