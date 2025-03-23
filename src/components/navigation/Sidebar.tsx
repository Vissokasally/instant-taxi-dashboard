
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Hammer,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Motoristas', path: '/motoristas', icon: Users },
    { name: 'Veículos', path: '/veiculos', icon: Car },
    { name: 'Manutenção', path: '/manutencao', icon: Wrench },
    { name: 'Reparações', path: '/reparacoes', icon: Hammer },
    { name: 'Finanças', path: '/financas', icon: BarChart3 },
  ];

  const secondaryItems = [
    { name: 'Configurações', path: '/configuracoes', icon: Settings },
    { name: 'Sair', path: '/logout', icon: LogOut },
  ];

  return (
    <aside className="h-full flex flex-col border-r border-border bg-card animate-fade-in">
      <div className="p-4 flex items-center justify-center h-16 border-b border-border">
        <h1 className={cn(
          "font-display font-bold text-primary transition-all duration-300",
          collapsed ? "text-xl scale-0 w-0 opacity-0" : "text-xl w-auto opacity-100"
        )}>
          TaxiGest
        </h1>
        {collapsed && (
          <span className="text-2xl font-bold text-primary">T</span>
        )}
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "sidebar-item group transition-all duration-200 ease-in-out",
                  isActive ? "active" : "",
                  collapsed ? "justify-center" : ""
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110 duration-200",
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                )} />
                
                <span className={cn(
                  "transition-all duration-200",
                  collapsed ? "hidden" : "block"
                )}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="py-4 border-t border-border">
        <ul className="space-y-1 px-2">
          {secondaryItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "sidebar-item group",
                  isActive ? "active" : "",
                  collapsed ? "justify-center" : ""
                )}
              >
                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all duration-200" />
                
                <span className={cn(
                  "transition-opacity duration-200",
                  collapsed ? "hidden" : "block"
                )}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
