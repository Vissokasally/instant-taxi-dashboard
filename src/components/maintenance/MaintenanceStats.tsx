
import DashboardCard from '@/components/dashboard/DashboardCard';

interface MaintenanceStatsProps {
  pendingCount: number;
  lateCount: number;
  completedCount: number;
}

export function MaintenanceStats({ pendingCount, lateCount, completedCount }: MaintenanceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <DashboardCard title="Manutenções Pendentes" isGlass={true}>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-semibold text-yellow-500 mb-2">{pendingCount}</div>
          <p className="text-sm text-muted-foreground">Agendadas</p>
        </div>
      </DashboardCard>
      
      <DashboardCard title="Manutenções Atrasadas" isGlass={true}>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-semibold text-red-500 mb-2">{lateCount}</div>
          <p className="text-sm text-muted-foreground">Necessitam atenção</p>
        </div>
      </DashboardCard>
      
      <DashboardCard title="Manutenções Realizadas" isGlass={true}>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-semibold text-green-500 mb-2">{completedCount}</div>
          <p className="text-sm text-muted-foreground">Concluídas</p>
        </div>
      </DashboardCard>
    </div>
  );
}
