
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, FileText, Car, Calendar, DollarSign } from 'lucide-react';

// Mock data for repairs
const repairsMockData = [
  { 
    id: 1, 
    veiculo: 'Toyota Corolla - LD-23-45-AB',
    peca: 'Travões', 
    data: '10/04/2023', 
    preco: 35000,
    descricao: 'Substituição das pastilhas de travão dianteiras',
    recibo: true
  },
  { 
    id: 2, 
    veiculo: 'Hyundai Accent - LD-67-89-CD',
    peca: 'Bateria', 
    data: '25/05/2023', 
    preco: 28000,
    descricao: 'Substituição da bateria',
    recibo: true
  },
  { 
    id: 3, 
    veiculo: 'Toyota Camry - LD-10-11-EF',
    peca: 'Amortecedores', 
    data: '05/03/2023', 
    preco: 75000,
    descricao: 'Substituição dos amortecedores traseiros',
    recibo: true
  },
  { 
    id: 4, 
    veiculo: 'Nissan Sentra - LD-12-34-GH',
    peca: 'Radiador', 
    data: '12/06/2023', 
    preco: 42000,
    descricao: 'Reparação do radiador e substituição do líquido de arrefecimento',
    recibo: false
  },
  { 
    id: 5, 
    veiculo: 'Honda Civic - LD-56-78-IJ',
    peca: 'Filtro de ar', 
    data: '02/06/2023', 
    preco: 8500,
    descricao: 'Substituição do filtro de ar',
    recibo: true
  },
];

// Table columns
const repairsColumns = [
  { 
    header: 'Veículo', 
    accessorKey: 'veiculo' as const,
    cell: (row: typeof repairsMockData[0]) => (
      <div className="flex items-center gap-2">
        <Car className="h-4 w-4 text-muted-foreground" />
        <span>{row.veiculo}</span>
      </div>
    )
  },
  { header: 'Peça', accessorKey: 'peca' as const },
  { 
    header: 'Data', 
    accessorKey: 'data' as const,
    cell: (row: typeof repairsMockData[0]) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{row.data}</span>
      </div>
    )
  },
  { 
    header: 'Preço', 
    accessorKey: 'preco' as const,
    cell: (row: typeof repairsMockData[0]) => (
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <span>{row.preco.toLocaleString('pt-AO')} AOA</span>
      </div>
    )
  },
  { header: 'Descrição', accessorKey: 'descricao' as const },
  { 
    header: 'Recibo', 
    accessorKey: 'recibo' as const,
    cell: (row: typeof repairsMockData[0]) => (
      <>
        {row.recibo ? (
          <Button variant="outline" size="sm" className="h-8 px-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Ver Recibo</span>
          </Button>
        ) : (
          <span className="text-muted-foreground text-sm">Não disponível</span>
        )}
      </>
    )
  },
  { 
    header: 'Ações', 
    accessorKey: 'id' as const,
    cell: (row: typeof repairsMockData[0]) => (
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

const Repairs = () => {
  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão de Reparações</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Registe e gerencie as reparações realizadas nos veículos da sua frota.
          </p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Registrar Reparação</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total de Reparações" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">5</div>
            <p className="text-sm text-muted-foreground">Este ano</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Custo Total" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">188,500</div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Custo Médio" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">37,700</div>
            <p className="text-sm text-muted-foreground">AOA / reparação</p>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Histórico de Reparações">
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={repairsColumns} 
            data={repairsMockData}
          />
        </div>
      </DashboardCard>
    </AppLayout>
  );
};

export default Repairs;
