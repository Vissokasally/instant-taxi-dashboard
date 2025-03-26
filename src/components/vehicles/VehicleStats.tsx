
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';

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

interface VehicleStatsProps {
  vehicles: Vehicle[];
}

const VehicleStats = ({ vehicles }: VehicleStatsProps) => {
  const totalVehicles = vehicles.length;
  const averageKm = totalVehicles > 0 
    ? vehicles.reduce((sum, v) => sum + v.quilometragem, 0) / totalVehicles 
    : 0;
  const averageAge = totalVehicles > 0 
    ? vehicles.reduce((sum, v) => sum + (new Date().getFullYear() - v.ano), 0) / totalVehicles 
    : 0;

  return (
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
  );
};

export default VehicleStats;
