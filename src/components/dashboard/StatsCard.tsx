
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl p-6 border border-border bg-card hover:shadow-sm transition-all duration-300 animate-slide-in",
        className
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="p-2 rounded-full bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
        
        {(description || trend) && (
          <div className="flex items-center space-x-2">
            {trend && (
              <span 
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.positive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
