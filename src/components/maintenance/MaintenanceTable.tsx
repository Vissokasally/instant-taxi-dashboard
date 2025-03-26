
import React from 'react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { getMaintenanceColumns } from './MaintenanceColumns';
import type { Maintenance } from '@/hooks/useMaintenanceData';

interface MaintenanceTableProps {
  maintenances: Maintenance[];
  isLoading: boolean;
  onComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddClick: () => void;
}

export function MaintenanceTable({ 
  maintenances, 
  isLoading, 
  onComplete, 
  onDelete, 
  onAddClick 
}: MaintenanceTableProps) {
  const maintenanceColumns = getMaintenanceColumns({ 
    onComplete, 
    onDelete 
  });

  return (
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
                onClick={onAddClick}
              >
                Agendar Manutenção
              </Button>
            </div>
          }
        />
      </div>
    </DashboardCard>
  );
}
