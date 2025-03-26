
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

interface VehicleHeaderProps {
  onAddVehicle: () => void;
  onExportReport: () => void;
}

const VehicleHeader = ({ onAddVehicle, onExportReport }: VehicleHeaderProps) => {
  return (
    <header className="mb-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Gestão de Veículos</h1>
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-muted-foreground">
          Gerencie todos os veículos da sua frota de táxis.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={onExportReport}
          >
            <Download className="h-4 w-4" />
            <span>Exportar Relatório</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={onAddVehicle}
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Veículo</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default VehicleHeader;
