
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import { useMaintenanceData } from '@/hooks/useMaintenanceData';
import { MaintenanceHeader } from '@/components/maintenance/MaintenanceHeader';
import { MaintenanceStats } from '@/components/maintenance/MaintenanceStats';
import { MaintenanceTable } from '@/components/maintenance/MaintenanceTable';

const Maintenance = () => {
  const [openForm, setOpenForm] = useState(false);
  const { 
    maintenances, 
    isLoading, 
    stats, 
    completeMaintenance, 
    deleteMaintenance 
  } = useMaintenanceData();

  return (
    <AppLayout>
      <MaintenanceHeader 
        maintenances={maintenances} 
        onAddClick={() => setOpenForm(true)} 
      />

      <MaintenanceStats 
        pendingCount={stats.pending} 
        lateCount={stats.late} 
        completedCount={stats.completed} 
      />

      <div className="grid grid-cols-1 gap-6">
        <MaintenanceTable 
          maintenances={maintenances}
          isLoading={isLoading}
          onComplete={completeMaintenance}
          onDelete={deleteMaintenance}
          onAddClick={() => setOpenForm(true)}
        />
      </div>

      <MaintenanceForm 
        open={openForm} 
        onOpenChange={setOpenForm} 
        onSuccess={() => {}} // The hook handles invalidation automatically
      />
    </AppLayout>
  );
};

export default Maintenance;
