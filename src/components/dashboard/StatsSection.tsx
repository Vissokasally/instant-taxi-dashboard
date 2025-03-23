
import React from 'react';
import StatsCard from './StatsCard';
import { statsMockData } from '@/data/dashboardData';

const StatsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
      {statsMockData.map((stat, index) => (
        <StatsCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          className={index === 4 ? "xl:col-span-1" : ""}
        />
      ))}
    </div>
  );
};

export default StatsSection;
