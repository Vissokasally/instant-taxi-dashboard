
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isGlass?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  children, 
  className,
  isGlass = false
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl border border-border p-6 transition-all duration-200 animate-scale-in",
        isGlass ? "glassmorphism" : "bg-card",
        className
      )}
    >
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default DashboardCard;
