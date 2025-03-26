
import React from 'react';
import { Car, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface GetVehicleColumnsProps {
  onDeleteVehicle: (id: string) => Promise<void>;
}

export const getVehicleColumns = ({ onDeleteVehicle }: GetVehicleColumnsProps) => [
  { 
    header: 'Veículo', 
    accessorKey: 'marca' as const,
    cell: (row: Vehicle) => (
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
    cell: (row: Vehicle) => (
      <span>{row.quilometragem.toLocaleString('pt-AO')} km</span>
    )
  },
  { 
    header: 'Motorista', 
    accessorKey: 'motorista' as const,
    cell: (row: Vehicle) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span>{row.motorista?.nome || 'Não atribuído'}</span>
      </div>
    )
  },
  { 
    header: 'Ações', 
    accessorKey: 'id' as const,
    cell: (row: Vehicle) => (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          onClick={() => onDeleteVehicle(row.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  },
];
