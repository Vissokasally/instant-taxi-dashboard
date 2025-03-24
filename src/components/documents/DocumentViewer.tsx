
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, FileText } from 'lucide-react';
import { viewDocument, downloadDocument } from '@/utils/documentUtils';
import { useToast } from '@/hooks/use-toast';

interface DocumentViewerProps {
  url: string | null;
  filename: string;
  label?: string;
  showDownload?: boolean;
  showView?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const DocumentViewer = ({
  url,
  filename,
  label = "Documento",
  showDownload = true,
  showView = true,
  variant = 'outline',
  size = 'sm'
}: DocumentViewerProps) => {
  const { toast } = useToast();

  if (!url) {
    return (
      <span className="text-muted-foreground text-sm">Não disponível</span>
    );
  }

  const handleView = () => {
    const result = viewDocument(url);
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível visualizar o documento. Tente novamente."
      });
    }
  };

  const handleDownload = async () => {
    const result = await downloadDocument(url, filename);
    if (result.success) {
      toast({
        title: "Download concluído",
        description: "O documento foi baixado com sucesso."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível baixar o documento. Tente novamente."
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showView && (
        <Button
          variant={variant}
          size={size}
          className="flex items-center gap-2"
          onClick={handleView}
        >
          <Eye className="h-4 w-4" />
          {size !== 'icon' && <span>Ver {label}</span>}
        </Button>
      )}
      
      {showDownload && (
        <Button
          variant={variant}
          size={size}
          className="flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          {size !== 'icon' && <span>Baixar {label}</span>}
        </Button>
      )}
    </div>
  );
};

export default DocumentViewer;
