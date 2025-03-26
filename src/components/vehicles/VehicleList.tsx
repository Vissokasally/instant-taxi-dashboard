
import React from 'react';
import DataTable from '@/components/ui/DataTable';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { getVehicleColumns } from './VehicleColumns';

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

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onAddVehicle: () => void;
  onDeleteVehicle: (id: string) => Promise<void>;
}

const VehicleList = ({ 
  vehicles, 
  isLoading,
  onAddVehicle,
  onDeleteVehicle
}: VehicleListProps) => {
  const vehiclesColumns = getVehicleColumns({ onDeleteVehicle });

  return (
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
                onClick={onAddVehicle}
              >
                Adicionar Veículo
              </Button>
            </div>
          }
        />
      </div>
    </DashboardCard>
  );
};

export default VehicleList;
