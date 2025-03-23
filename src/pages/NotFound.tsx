
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6 animate-fade-in">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl font-medium mb-6">Página não encontrada</p>
        <p className="text-muted-foreground mb-8">
          A página que você está tentando acessar não existe ou foi movida.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para o Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
