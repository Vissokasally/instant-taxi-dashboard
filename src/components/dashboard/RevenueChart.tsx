
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from './DashboardCard';

interface RevenueChartProps {
  data: any[];
  loading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading = false }) => {
  // Processar dados para o formato do gráfico
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Mockup data para quando não há dados
      return [
        { mes: 'Jan', entrada: 420000, saida: 315000 },
        { mes: 'Fev', entrada: 390000, saida: 320000 },
        { mes: 'Mar', entrada: 430000, saida: 300000 },
        { mes: 'Abr', entrada: 450000, saida: 345670 },
      ];
    }
    
    // Agrupa transações por mês
    const months: Record<string, { entrada: number, saida: number }> = {};
    
    data.forEach(t => {
      const date = new Date(t.data);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { entrada: 0, saida: 0 };
      }
      
      if (t.tipo === 'Entrada') {
        months[monthYear].entrada += Number(t.valor);
      } else {
        months[monthYear].saida += Number(t.valor);
      }
    });
    
    // Converte para formato para o gráfico
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return Object.entries(months).map(([monthYear, values]) => {
      const [year, month] = monthYear.split('-').map(Number);
      return {
        mes: `${monthNames[month - 1]}`,
        entrada: values.entrada,
        saida: values.saida
      };
    });
  }, [data]);

  return (
    <DashboardCard 
      title="Receitas vs Despesas (2023)" 
      className="lg:col-span-2"
    >
      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
        )}
      </div>
    </DashboardCard>
  );
};

export default RevenueChart;
