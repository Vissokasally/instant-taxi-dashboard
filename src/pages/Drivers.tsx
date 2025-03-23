
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for drivers
const driversMockData = [
  { 
    id: 1, 
    nome: 'Manuel Silva', 
    bi: '12345678LA123', 
    cartaConducao: 'CC98765432', 
    morada: 'Rua das Acácias, 123, Luanda', 
    fotoUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  { 
    id: 2, 
    nome: 'João Martins', 
    bi: '87654321LA456', 
    cartaConducao: 'CC12345678', 
    morada: 'Avenida Ho Chi Minh, 45, Luanda', 
    fotoUrl: 'https://randomuser.me/api/portraits/men/28.jpg'
  },
  { 
    id: 3, 
    nome: 'Maria Fernandes', 
    bi: '23456789LA789', 
    cartaConducao: 'CC56789012', 
    morada: 'Rua dos Coqueiros, 78, Luanda', 
    fotoUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  { 
    id: 4, 
    nome: 'António Costa', 
    bi: '34567890LA012', 
    cartaConducao: 'CC34567890', 
    morada: 'Avenida 4 de Fevereiro, 15, Luanda', 
    fotoUrl: 'https://randomuser.me/api/portraits/men/42.jpg'
  },
  { 
    id: 5, 
    nome: 'Teresa Santos', 
    bi: '45678901LA345', 
    cartaConducao: 'CC90123456', 
    morada: 'Rua Comandante Gika, 56, Luanda', 
    fotoUrl: 'https://randomuser.me/api/portraits/women/23.jpg'
  },
];

// Table columns
const driversColumns = [
  { 
    header: 'Motorista', 
    accessorKey: 'nome' as const,
    cell: (row: typeof driversMockData[0]) => (
      <div className="flex items-center gap-3">
        <img 
          src={row.fotoUrl} 
          alt={row.nome} 
          className="w-8 h-8 rounded-full object-cover border border-border"
        />
        <span className="font-medium">{row.nome}</span>
      </div>
    )
  },
  { header: 'BI', accessorKey: 'bi' as const },
  { header: 'Carta de Condução', accessorKey: 'cartaConducao' as const },
  { header: 'Morada', accessorKey: 'morada' as const },
  { 
    header: 'Ações', 
    accessorKey: 'id' as const,
    cell: (row: typeof driversMockData[0]) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  },
];

const Drivers = () => {
  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão de Motoristas</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Gerencie todos os motoristas da sua frota de táxis.
          </p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Adicionar Motorista</span>
          </Button>
        </div>
      </header>

      <DashboardCard title="Lista de Motoristas">
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={driversColumns} 
            data={driversMockData}
            onRowClick={(row) => console.log('Clicked row:', row)}
          />
        </div>
      </DashboardCard>
    </AppLayout>
  );
};

export default Drivers;
