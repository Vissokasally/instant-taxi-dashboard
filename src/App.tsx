
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Drivers from "./pages/Drivers";
import Vehicles from "./pages/Vehicles";
import Maintenance from "./pages/Maintenance";
import Repairs from "./pages/Repairs";
import Finances from "./pages/Finances";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/motoristas" element={<Drivers />} />
          <Route path="/veiculos" element={<Vehicles />} />
          <Route path="/manutencao" element={<Maintenance />} />
          <Route path="/reparacoes" element={<Repairs />} />
          <Route path="/financas" element={<Finances />} />
          {/* Add a redirect for Brazilian Portuguese URL */}
          <Route path="/financas" element={<Navigate to="/financas" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
