
import React from 'react';

export const maintenanceColumns = [
  { header: 'Veículo', accessorKey: 'veiculo' },
  { header: 'Última Manutenção', accessorKey: 'data' },
  { header: 'Próxima Manutenção', accessorKey: 'proximaData' },
  { 
    header: 'Estado', 
    accessorKey: 'estado',
    cell: (row: { estado: string }) => {
      const statusClasses = {
        'Realizada': 'bg-green-50 text-green-600 border-green-200',
        'Pendente': 'bg-yellow-50 text-yellow-600 border-yellow-200',
        'Atrasada': 'bg-red-50 text-red-600 border-red-200',
      };
      
      const status = row.estado as keyof typeof statusClasses;
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
          {row.estado}
        </span>
      );
    }
  },
];

export const activityColumns = [
  { header: 'Ação', accessorKey: 'acao' },
  { header: 'Detalhes', accessorKey: 'veiculo' },
  { header: 'Data', accessorKey: 'data' },
];
