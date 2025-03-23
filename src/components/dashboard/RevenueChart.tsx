
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from './DashboardCard';
import { revenueData } from '@/data/dashboardData';

const RevenueChart: React.FC = () => {
  return (
    <DashboardCard 
      title="Receitas vs Despesas (2023)" 
      className="lg:col-span-2"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenueData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip 
              formatter={(value) => `${Number(value).toLocaleString('pt-AO')} AOA`} 
              contentStyle={{ 
                borderRadius: '0.5rem', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              }}
            />
            <Bar dataKey="entrada" name="Receitas" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saida" name="Despesas" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default RevenueChart;
