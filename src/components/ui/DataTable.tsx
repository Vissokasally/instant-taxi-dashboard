
import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  header: string;
  accessorKey: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
}

function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyState,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column, i) => (
                <th key={i} className="text-left p-3 text-muted-foreground font-medium text-sm">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border/50">
                {columns.map((_, j) => (
                  <td key={j} className="p-3">
                    <div className="h-6 bg-muted/50 rounded animate-pulse-soft w-24"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {columns.map((column, i) => (
              <th key={i} className="text-left p-3 text-muted-foreground font-medium text-sm">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((row, i) => (
            <tr 
              key={i} 
              className={cn(
                "transition-colors hover:bg-muted/30",
                onRowClick && "cursor-pointer",
                rowClassName && rowClassName(row)
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column, j) => (
                <td key={j} className="p-3 text-sm">
                  {column.cell ? column.cell(row) : String(row[column.accessorKey as keyof T] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
