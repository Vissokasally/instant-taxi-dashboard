
import React from 'react';
import RevenueChart from './RevenueChart';
import MaintenanceAlerts from './MaintenanceAlerts';

const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <RevenueChart />
      <MaintenanceAlerts />
    </div>
  );
};

export default ChartsSection;
