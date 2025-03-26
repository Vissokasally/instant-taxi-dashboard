
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MaintenanceReport } from './MaintenanceReport';
import type { Maintenance } from '@/hooks/useMaintenanceData';

interface MaintenanceHeaderProps {
  maintenances: Maintenance[];
  onAddClick: () => void;
}

export function MaintenanceHeader({ maintenances, onAddClick }: MaintenanceHeaderProps) {
  return (
    <header className="mb-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Gestão de Manutenção</h1>
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-muted-foreground">
          Agende e gerencie manutenções para os veículos da sua frota.
        </p>
        <div className="flex gap-2">
          <MaintenanceReport maintenances={maintenances} />
          <Button 
            className="flex items-center gap-2"
            onClick={onAddClick}
          >
            <Plus className="h-4 w-4" />
            <span>Agendar Manutenção</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
