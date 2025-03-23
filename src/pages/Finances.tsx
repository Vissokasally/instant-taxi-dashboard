
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPie,
  Pie,
  Legend
} from 'recharts';

// Mock data for finances
const transactionsMockData = [
  { 
    id: 1, 
    data: '10/04/2023', 
    tipo: 'Saída', 
    categoria: 'Reparação',
    descricao: 'Substituição das pastilhas de travão dianteiras', 
    valor: 35000,
    recibo: true
  },
  { 
    id: 2, 
    data: '05/04/2023', 
    tipo: 'Entrada', 
    categoria: 'Serviço de Táxi',
    descricao: 'Pagamento de serviços de táxi - semana 14', 
    valor: 125000,
    recibo: true
  },
  { 
    id: 3, 
    data: '25/05/2023', 
    tipo: 'Saída', 
    categoria: 'Reparação',
    descricao: 'Substituição da bateria', 
    valor: 28000,
    recibo: true
  },
  { 
    id: 4, 
    data: '20/05/2023', 
    tipo: 'Saída', 
    categoria: 'Gasolina',
    descricao: 'Abastecimento dos veículos da frota', 
    valor: 45000,
    recibo: true
  },
  { 
    id: 5, 
    data: '15/05/2023', 
    tipo: 'Entrada', 
    categoria: 'Serviço de Táxi',
    descricao: 'Pagamento de serviços de táxi - semana 19', 
    valor: 130000,
    recibo: true
  },
  { 
    id: 6, 
    data: '01/05/2023', 
    tipo: 'Saída', 
    categoria: 'Salários',
    descricao: 'Pagamento de salários - Abril 2023', 
    valor: 150000,
    recibo: false
  },
  { 
    id: 7, 
    data: '30/04/2023', 
    tipo: 'Entrada', 
    categoria: 'Serviço de Táxi',
    descricao: 'Pagamento de serviços de táxi - semana 17', 
    valor: 128000,
    recibo: true
  },
];

// Table columns
const transactionsColumns = [
  { header: 'Data', accessorKey: 'data' as const },
  { 
    header: 'Tipo', 
    accessorKey: 'tipo' as const,
    cell: (row: typeof transactionsMockData[0]) => (
      <div className="flex items-center gap-2">
        {row.tipo === 'Entrada' ? (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <TrendingUp className="h-4 w-4" />
            Entrada
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <TrendingDown className="h-4 w-4" />
            Saída
          </span>
        )}
      </div>
    )
  },
  { 
    header: 'Categoria', 
    accessorKey: 'categoria' as const,
    cell: (row: typeof transactionsMockData[0]) => {
      const categoryColors: Record<string, string> = {
        'Reparação': 'bg-blue-50 text-blue-600 border-blue-200',
        'Gasolina': 'bg-orange-50 text-orange-600 border-orange-200',
        'Salários': 'bg-purple-50 text-purple-600 border-purple-200',
        'Serviço de Táxi': 'bg-green-50 text-green-600 border-green-200',
        'Manutenção': 'bg-yellow-50 text-yellow-600 border-yellow-200',
        'Seguro': 'bg-indigo-50 text-indigo-600 border-indigo-200',
        'Outros': 'bg-gray-50 text-gray-600 border-gray-200',
      };
      
      const colorClass = categoryColors[row.categoria] || categoryColors['Outros'];
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
          {row.categoria}
        </span>
      );
    }
  },
  { header: 'Descrição', accessorKey: 'descricao' as const },
  { 
    header: 'Valor', 
    accessorKey: 'valor' as const,
    cell: (row: typeof transactionsMockData[0]) => (
      <span className={row.tipo === 'Entrada' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {row.tipo === 'Entrada' ? '+' : '-'} {row.valor.toLocaleString('pt-AO')} AOA
      </span>
    )
  },
  { 
    header: 'Recibo', 
    accessorKey: 'recibo' as const,
    cell: (row: typeof transactionsMockData[0]) => (
      <>
        {row.recibo ? (
          <Button variant="outline" size="sm" className="h-8 px-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Ver Recibo</span>
          </Button>
        ) : (
          <span className="text-muted-foreground text-sm">Não disponível</span>
        )}
      </>
    )
  },
];

// Chart data
const monthlyRevenueData = [
  { mes: 'Jan', entrada: 420000, saida: 315000 },
  { mes: 'Fev', entrada: 390000, saida: 320000 },
  { mes: 'Mar', entrada: 430000, saida: 300000 },
  { mes: 'Abr', entrada: 450000, saida: 345670 },
];

const expenseCategoryData = [
  { name: 'Reparação', value: 63000, color: '#3b82f6' },
  { name: 'Gasolina', value: 45000, color: '#f97316' },
  { name: 'Salários', value: 150000, color: '#8b5cf6' },
  { name: 'Manutenção', value: 32000, color: '#eab308' },
  { name: 'Seguro', value: 20000, color: '#6366f1' },
  { name: 'Outros', value: 35670, color: '#9ca3af' },
];

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#eab308', '#6366f1', '#9ca3af'];

const Finances = () => {
  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão Financeira</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Controle todas as transações financeiras da sua empresa de táxis.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Relatório</span>
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nova Transação</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Entradas (Mensal)" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-3xl font-semibold text-green-500 mb-2">383,000</div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Saídas (Mensal)" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-3xl font-semibold text-red-500 mb-2">345,670</div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Balanço (Mensal)" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-3xl font-semibold text-primary mb-2">+37,330</div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard title="Receitas vs Despesas (2023)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenueData}
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
                <Bar dataKey="entrada" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saida" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Despesas por Categoria (Abril 2023)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString('pt-AO')} AOA`} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Histórico de Transações">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Entradas</span>
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-red-600">Saídas</span>
            </Button>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={transactionsColumns} 
            data={transactionsMockData}
            rowClassName={(row) => {
              return row.tipo === 'Entrada' ? 'bg-green-50/30' : 'bg-red-50/30';
            }}
          />
        </div>
      </DashboardCard>
    </AppLayout>
  );
};

export default Finances;
