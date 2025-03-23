
import React from 'react';
import { Clock } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="mb-1">
        <span className="text-sm font-medium text-muted-foreground">Bem-vindo de volta,</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard TaxiGest</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('pt-AO', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
