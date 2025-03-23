
import { Users, Car, Wrench, CreditCard, BarChart3 } from 'lucide-react';

// Mock data for dashboard
export const statsMockData = [
  { title: 'Total de Motoristas', value: '12', icon: Users },
  { title: 'Total de Veículos', value: '8', icon: Car },
  { title: 'Manutenções Pendentes', value: '3', icon: Wrench, trend: { value: 2, positive: false } },
  { title: 'Despesas (Mensal)', value: '345,670 AOA', icon: CreditCard },
  { title: 'Lucro (Mensal)', value: '450,000 AOA', icon: BarChart3, trend: { value: 12, positive: true } },
];

export const revenueData = [
  { mes: 'Jan', entrada: 420000, saida: 315000 },
  { mes: 'Fev', entrada: 390000, saida: 320000 },
  { mes: 'Mar', entrada: 430000, saida: 300000 },
  { mes: 'Abr', entrada: 450000, saida: 345670 },
];

export const maintenanceData = [
  { veiculo: 'Toyota Corolla - LD-23-45-AB', data: '12/05/2023', proximaData: '12/07/2023', estado: 'Realizada' },
  { veiculo: 'Hyundai Accent - LD-67-89-CD', data: '15/06/2023', proximaData: '15/08/2023', estado: 'Pendente' },
  { veiculo: 'Toyota Camry - LD-10-11-EF', data: '01/04/2023', proximaData: '01/06/2023', estado: 'Atrasada' },
];

export const recentActivityData = [
  { acao: 'Manutenção agendada', veiculo: 'Toyota Corolla - LD-23-45-AB', data: 'Hoje, 10:23' },
  { acao: 'Novo motorista adicionado', veiculo: 'Manuel Silva', data: 'Ontem, 15:30' },
  { acao: 'Reparação registrada', veiculo: 'Hyundai Accent - LD-67-89-CD', data: '23/04/2023' },
];
