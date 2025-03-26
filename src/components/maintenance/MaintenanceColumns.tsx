
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Maintenance } from '@/hooks/useMaintenanceData';

interface GetMaintenanceColumnsProps {
  onComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const getMaintenanceColumns = ({ onComplete, onDelete }: GetMaintenanceColumnsProps) => [
  { 
    header: 'Veículo', 
    accessorKey: 'veiculoInfo' as const,
    cell: (row: Maintenance) => (
      <div>
        {row.veiculoInfo 
          ? `${row.veiculoInfo.marca} ${row.veiculoInfo.modelo} - ${row.veiculoInfo.matricula}`
          : 'Veículo não encontrado'}
      </div>
    )
  },
  { 
    header: 'Motorista', 
    accessorKey: 'veiculoInfo.motorista' as const,
    cell: (row: Maintenance) => (
      <span>{row.veiculoInfo?.motorista || 'Não atribuído'}</span>
    )
  },
  { 
    header: 'Data Agendada', 
    accessorKey: 'data_agendada' as const,
    cell: (row: Maintenance) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{format(new Date(row.data_agendada), 'dd/MM/yyyy')}</span>
      </div>
    )
  },
  { 
    header: 'Estado', 
    accessorKey: 'estado' as const,
    cell: (row: Maintenance) => {
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
    header: 'Ações', 
    accessorKey: 'id' as const,
    cell: (row: Maintenance) => (
      <div className="flex items-center gap-2">
        {row.estado !== 'Realizada' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs flex items-center gap-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
            onClick={() => onComplete(row.id)}
          >
            <Check className="h-3 w-3" />
            <span>Concluir</span>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          onClick={() => onDelete(row.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  },
];
