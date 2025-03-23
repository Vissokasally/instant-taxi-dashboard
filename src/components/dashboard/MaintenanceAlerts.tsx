
import React from 'react';
import DashboardCard from './DashboardCard';
import { maintenanceData } from '@/data/dashboardData';
import { AlertTriangle, Clock } from 'lucide-react';

const MaintenanceAlerts: React.FC = () => {
  return (
    <DashboardCard 
      title="Alertas de Manutenção"
      isGlass={true}
    >
      <div className="space-y-4">
        {maintenanceData.filter(item => item.estado !== 'Realizada').map((item, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-4 border ${
              item.estado === 'Atrasada' 
                ? 'border-red-200 bg-red-50 dark:bg-red-900/10' 
                : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10'
            } transition-all duration-200 hover:shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                item.estado === 'Atrasada' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'
              }`}>
                {item.estado === 'Atrasada' ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{item.veiculo}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.estado === 'Atrasada' 
                    ? 'Manutenção atrasada desde ' 
                    : 'Próxima manutenção em '
                  }
                  <span className="font-medium text-foreground">
                    {item.estado === 'Atrasada' ? item.proximaData : item.proximaData}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default MaintenanceAlerts;
