
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Car, Users, Calendar } from 'lucide-react';

// Mock data for vehicles
const vehiclesMockData = [
  { 
    id: 1, 
    matricula: 'LD-23-45-AB', 
    marca: 'Toyota', 
    modelo: 'Corolla', 
    ano: 2019,
    quilometragem: 65000,
    motorista: 'Manuel Silva',
    ultimaManutencao: '12/05/2023'
  },
  { 
    id: 2, 
    matricula: 'LD-67-89-CD', 
    marca: 'Hyundai', 
    modelo: 'Accent', 
    ano: 2020,
    quilometragem: 45000,
    motorista: 'João Martins',
    ultimaManutencao: '15/06/2023'
  },
  { 
    id: 3, 
    matricula: 'LD-10-11-EF', 
    marca: 'Toyota', 
    modelo: 'Camry', 
    ano: 2018,
    quilometragem: 85000,
    motorista: 'Maria Fernandes',
    ultimaManutencao: '01/04/2023'
  },
  { 
    id: 4, 
    matricula: 'LD-12-34-GH', 
    marca: 'Nissan', 
    modelo: 'Sentra', 
    ano: 2021,
    quilometragem: 32000,
    motorista: 'António Costa',
    ultimaManutencao: '20/03/2023'
  },
  { 
    id: 5, 
    matricula: 'LD-56-78-IJ', 
    marca: 'Honda', 
    modelo: 'Civic', 
    ano: 2019,
    quilometragem: 58000,
    motorista: 'Teresa Santos',
    ultimaManutencao: '05/06/2023'
  },
];

// Table columns
const vehiclesColumns = [
  { 
    header: 'Veículo', 
    accessorKey: 'marca' as const,
    cell: (row: typeof vehiclesMockData[0]) => (
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
    cell: (row: typeof vehiclesMockData[0]) => (
      <span>{row.quilometragem.toLocaleString('pt-AO')} km</span>
    )
  },
  { 
    header: 'Motorista', 
    accessorKey: 'motorista' as const,
    cell: (row: typeof vehiclesMockData[0]) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span>{row.motorista}</span>
      </div>
    )
  },
  { 
    header: 'Última Manutenção', 
    accessorKey: 'ultimaManutencao' as const,
    cell: (row: typeof vehiclesMockData[0]) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{row.ultimaManutencao}</span>
      </div>
    )
  },
  { 
    header: 'Ações', 
    accessorKey: 'id' as const,
    cell: (row: typeof vehiclesMockData[0]) => (
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

const Vehicles = () => {
  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão de Veículos</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Gerencie todos os veículos da sua frota de táxis.
          </p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Adicionar Veículo</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Veículos Ativos" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">5</div>
            <p className="text-sm text-muted-foreground">Total da frota</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Quilometragem Média" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">57,000</div>
            <p className="text-sm text-muted-foreground">Quilómetros</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Idade Média" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-semibold text-primary mb-2">3.4</div>
            <p className="text-sm text-muted-foreground">Anos</p>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Lista de Veículos">
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={vehiclesColumns} 
            data={vehiclesMockData}
            onRowClick={(row) => console.log('Clicked row:', row)}
          />
        </div>
      </DashboardCard>
    </AppLayout>
  );
};

export default Vehicles;
