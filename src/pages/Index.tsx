
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatsCard from '@/components/dashboard/StatsCard';
import DataTable from '@/components/ui/DataTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  Car, 
  Wrench, 
  CreditCard, 
  BarChart3,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Mock data for dashboard
const statsMockData = [
  { title: 'Total de Motoristas', value: '12', icon: Users },
  { title: 'Total de Veículos', value: '8', icon: Car },
  { title: 'Manutenções Pendentes', value: '3', icon: Wrench, trend: { value: 2, positive: false } },
  { title: 'Despesas (Mensal)', value: '345,670 AOA', icon: CreditCard },
  { title: 'Lucro (Mensal)', value: '450,000 AOA', icon: BarChart3, trend: { value: 12, positive: true } },
];

const revenueData = [
  { mes: 'Jan', entrada: 420000, saida: 315000 },
  { mes: 'Fev', entrada: 390000, saida: 320000 },
  { mes: 'Mar', entrada: 430000, saida: 300000 },
  { mes: 'Abr', entrada: 450000, saida: 345670 },
];

const maintenanceData = [
  { veiculo: 'Toyota Corolla - LD-23-45-AB', data: '12/05/2023', proximaData: '12/07/2023', estado: 'Realizada' },
  { veiculo: 'Hyundai Accent - LD-67-89-CD', data: '15/06/2023', proximaData: '15/08/2023', estado: 'Pendente' },
  { veiculo: 'Toyota Camry - LD-10-11-EF', data: '01/04/2023', proximaData: '01/06/2023', estado: 'Atrasada' },
];

// Table columns
const maintenanceColumns = [
  { header: 'Veículo', accessorKey: 'veiculo' as const },
  { header: 'Última Manutenção', accessorKey: 'data' as const },
  { header: 'Próxima Manutenção', accessorKey: 'proximaData' as const },
  { 
    header: 'Estado', 
    accessorKey: 'estado' as const,
    cell: (row: { estado: string }) => {
      const statusClasses = {
        'Realizada': 'bg-green-50 text-green-600 border-green-200',
        'Pendente': 'bg-yellow-50 text-yellow-600 border-yellow-200',
        'Atrasada': 'bg-red-50 text-red-600 border-red-200',
      };
      
      const status = row.estado as keyof typeof statusClasses;
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
          {row.estado}
        </span>
      );
    }
  },
];

const recentActivityData = [
  { acao: 'Manutenção agendada', veiculo: 'Toyota Corolla - LD-23-45-AB', data: 'Hoje, 10:23' },
  { acao: 'Novo motorista adicionado', veiculo: 'Manuel Silva', data: 'Ontem, 15:30' },
  { acao: 'Reparação registrada', veiculo: 'Hyundai Accent - LD-67-89-CD', data: '23/04/2023' },
];

const activityColumns = [
  { header: 'Ação', accessorKey: 'acao' as const },
  { header: 'Detalhes', accessorKey: 'veiculo' as const },
  { header: 'Data', accessorKey: 'data' as const },
];

const Index = () => {
  return (
    <AppLayout>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
      </div>
      
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
    </AppLayout>
  );
};

export default Index;
