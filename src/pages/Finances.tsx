
import React, { useState, useEffect } from 'react';
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
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import TransactionForm from '@/components/finances/TransactionForm';
import { useToast } from '@/hooks/use-toast';
import { createPdfReport } from '@/utils/pdfGenerator';
import { viewDocument, downloadDocument } from '@/utils/documentUtils';

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#eab308', '#6366f1', '#9ca3af'];

const Finances = () => {
  const [openTransactionForm, setOpenTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    entradas: 0,
    saidas: 0,
    balanco: 0
  });
  const [expenseCategoryData, setExpenseCategoryData] = useState<any[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const { toast } = useToast();

  const transactionsColumns = [
    { header: 'Data', 
      accessorKey: 'data' as const,
      cell: (row: any) => format(parseISO(row.data), 'dd/MM/yyyy')
    },
    { 
      header: 'Tipo', 
      accessorKey: 'tipo' as const,
      cell: (row: any) => (
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
      cell: (row: any) => {
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
      cell: (row: any) => (
        <span className={row.tipo === 'Entrada' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {row.tipo === 'Entrada' ? '+' : '-'} {Number(row.valor).toLocaleString('pt-AO')} AOA
        </span>
      )
    },
    { 
      header: 'Recibo', 
      accessorKey: 'recibo_pdf_url' as const,
      cell: (row: any) => (
        <>
          {row.recibo_pdf_url ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => viewDocument(row.recibo_pdf_url)}
            >
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

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase.from('transacoes').select('*').order('data', { ascending: false });
      
      if (filterType) {
        query = query.eq('tipo', filterType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setTransactions(data || []);
      calculateSummary(data || []);
      calculateExpensesByCategory(data || []);
      calculateMonthlyRevenue(data || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as transações. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: any[]) => {
    const entradas = data
      .filter(t => t.tipo === 'Entrada')
      .reduce((sum, t) => sum + Number(t.valor), 0);
    
    const saidas = data
      .filter(t => t.tipo === 'Saída')
      .reduce((sum, t) => sum + Number(t.valor), 0);
    
    setSummaryData({
      entradas,
      saidas,
      balanco: entradas - saidas
    });
  };

  const calculateExpensesByCategory = (data: any[]) => {
    const expenses = data.filter(t => t.tipo === 'Saída');
    const categories: Record<string, number> = {};
    
    expenses.forEach(exp => {
      if (!categories[exp.categoria]) {
        categories[exp.categoria] = 0;
      }
      categories[exp.categoria] += Number(exp.valor);
    });
    
    const categoryData = Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
    
    setExpenseCategoryData(categoryData);
  };

  const calculateMonthlyRevenue = (data: any[]) => {
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
    
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const chartData = Object.entries(months).map(([monthYear, values]) => {
      const [year, month] = monthYear.split('-').map(Number);
      return {
        mes: monthNames[month - 1],
        entrada: values.entrada,
        saida: values.saida
      };
    });
    
    setMonthlyRevenueData(chartData);
  };

  const exportReport = () => {
    try {
      if (!transactions || transactions.length === 0) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não há transações para exportar."
        });
        return;
      }
      
      const headers = ["Data", "Tipo", "Categoria", "Descrição", "Valor"];
      
      const tableRows = transactions.map((t) => [
        format(parseISO(t.data), 'dd/MM/yyyy'),
        t.tipo,
        t.categoria,
        t.descricao || '-',
        `${t.tipo === 'Entrada' ? '+' : '-'} ${Number(t.valor).toLocaleString('pt-AO')} AOA`
      ]);
      
      const summaryItems = [
        { label: "Entradas Totais", value: `${summaryData.entradas.toLocaleString('pt-AO')} AOA` },
        { label: "Saídas Totais", value: `${summaryData.saidas.toLocaleString('pt-AO')} AOA` },
        { label: "Balanço", value: `${summaryData.balanco.toLocaleString('pt-AO')} AOA` }
      ];
      
      const result = createPdfReport(
        "Relatório Financeiro",
        headers,
        tableRows,
        summaryItems
      );
      
      toast({
        title: result.success ? "Relatório exportado" : "Erro",
        description: result.message
      });
      
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível exportar o relatório. Tente novamente."
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType]);

  return (
    <AppLayout>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Gestão Financeira</h1>
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            Controle todas as transações financeiras da sua empresa de táxis.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={exportReport}>
              <Download className="h-4 w-4" />
              <span>Relatório</span>
            </Button>
            <Button className="flex items-center gap-2" onClick={() => setOpenTransactionForm(true)}>
              <Plus className="h-4 w-4" />
              <span>Nova Transação</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Entradas (Mensal)" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-3xl font-semibold text-green-500 mb-2">
              {summaryData.entradas.toLocaleString('pt-AO')}
            </div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Saídas (Mensal)" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-3xl font-semibold text-red-500 mb-2">
              {summaryData.saidas.toLocaleString('pt-AO')}
            </div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Balanço (Mensal)" isGlass={true}>
          <div className="flex flex-col items-center justify-center py-4">
            <div className={`text-3xl font-semibold mb-2 ${
              summaryData.balanco >= 0 ? 'text-primary' : 'text-red-500'
            }`}>
              {summaryData.balanco >= 0 ? '+' : ''}
              {summaryData.balanco.toLocaleString('pt-AO')}
            </div>
            <p className="text-sm text-muted-foreground">AOA</p>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardCard title="Receitas vs Despesas (2023)">
          <div className="h-80">
            {monthlyRevenueData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Sem dados para exibir</p>
              </div>
            )}
          </div>
        </DashboardCard>
        
        <DashboardCard title="Despesas por Categoria">
          <div className="h-80">
            {expenseCategoryData.length > 0 ? (
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString('pt-AO')} AOA`} />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Sem dados para exibir</p>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Histórico de Transações">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => setFilterType(null)}
            >
              <Filter className="h-4 w-4" />
              <span>Todos</span>
            </Button>
            <Button
              size="sm"
              variant={filterType === 'Entrada' ? 'default' : 'outline'}
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => setFilterType('Entrada')}
            >
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className={filterType === 'Entrada' ? 'text-white' : 'text-green-600'}>
                Entradas
              </span>
            </Button>
            <Button
              size="sm"
              variant={filterType === 'Saída' ? 'default' : 'outline'}
              className="h-8 px-3 flex items-center gap-2"
              onClick={() => setFilterType('Saída')}
            >
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className={filterType === 'Saída' ? 'text-white' : 'text-red-600'}>
                Saídas
              </span>
            </Button>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <DataTable 
            columns={transactionsColumns} 
            data={transactions}
            loading={loading}
            rowClassName={(row) => {
              return row.tipo === 'Entrada' ? 'bg-green-50/30' : 'bg-red-50/30';
            }}
            emptyState={
              <div className="text-center py-10">
                <PieChart className="h-10 w-10 mx-auto text-muted-foreground/60" />
                <h3 className="mt-2 text-lg font-medium">Nenhuma transação encontrada</h3>
                <p className="mt-1 text-muted-foreground">
                  Adicione sua primeira transação para começar a acompanhar suas finanças.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setOpenTransactionForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            }
          />
        </div>
      </DashboardCard>

      <TransactionForm 
        open={openTransactionForm} 
        onOpenChange={setOpenTransactionForm} 
        onSuccess={fetchTransactions}
      />
    </AppLayout>
  );
};

export default Finances;
