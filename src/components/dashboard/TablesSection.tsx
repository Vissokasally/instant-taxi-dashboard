
import React from 'react';
import DashboardCard from './DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { maintenanceColumns, activityColumns } from '@/components/tables/MaintenanceColumns';
import { maintenanceData, recentActivityData } from '@/data/dashboardData';

const TablesSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardCard title="Manutenções Recentes">
        <DataTable 
          columns={maintenanceColumns} 
          data={maintenanceData}
          rowClassName={(row) => {
            if (row.estado === 'Atrasada') return 'bg-red-50/50 dark:bg-red-900/5';
            return '';
          }}
        />
      </DashboardCard>
      
      <DashboardCard title="Atividade Recente">
        <DataTable 
          columns={activityColumns} 
          data={recentActivityData} 
        />
      </DashboardCard>
    </div>
  );
};

export default TablesSection;
