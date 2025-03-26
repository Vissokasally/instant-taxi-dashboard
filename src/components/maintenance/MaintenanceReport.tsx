
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Maintenance } from '@/hooks/useMaintenanceData';

interface MaintenanceReportProps {
  maintenances: Maintenance[];
}

export function MaintenanceReport({ maintenances }: MaintenanceReportProps) {
  const { toast } = useToast();

  const exportMaintenanceReport = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Relatório de Manutenções', 14, 22);
      
      // Add generation date
      doc.setFontSize(10);
      doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
      
      // Prepare table data
      const tableColumn = ["Veículo", "Motorista", "Data Agendada", "Estado"];
      const tableRows = maintenances.map((maint) => [
        `${maint.veiculoInfo?.marca || ''} ${maint.veiculoInfo?.modelo || ''} - ${maint.veiculoInfo?.matricula || ''}`,
        maint.veiculoInfo?.motorista || 'Não atribuído',
        format(new Date(maint.data_agendada), 'dd/MM/yyyy'),
        maint.estado
      ]);
      
      // Add table to PDF
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255
        },
        // Color rows based on status
        rowStyles: maintenances.map(m => {
          if (m.estado === 'Realizada') return { textColor: [39, 174, 96] };
          if (m.estado === 'Atrasada') return { textColor: [192, 57, 43] };
          return { textColor: [243, 156, 18] };
        })
      });
      
      // Add footer with statistics
      const pendentes = maintenances.filter(m => m.estado === 'Pendente').length;
      const atrasadas = maintenances.filter(m => m.estado === 'Atrasada').length;
      const realizadas = maintenances.filter(m => m.estado === 'Realizada').length;
      
      doc.setFontSize(12);
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Manutenções Pendentes: ${pendentes}`, 14, finalY);
      doc.text(`Manutenções Atrasadas: ${atrasadas}`, 14, finalY + 8);
      doc.text(`Manutenções Realizadas: ${realizadas}`, 14, finalY + 16);
      doc.text(`Total de Manutenções: ${maintenances.length}`, 14, finalY + 24);
      
      // Save PDF
      const fileName = `relatorio_manutencoes_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
      doc.save(fileName);
      
      // Upload to Supabase Storage (optional)
      const pdfBlob = doc.output('blob');
      const uploadFile = async () => {
        try {
          const { error } = await supabase.storage
            .from('relatorios')
            .upload(fileName, pdfBlob);
            
          if (error) throw error;
        } catch (error) {
          console.error('Erro ao fazer upload do relatório:', error);
        }
      };
      
      uploadFile();
      
      toast({
        title: "Relatório exportado",
        description: "O relatório foi exportado com sucesso."
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

  return (
    <Button 
      variant="outline"
      className="flex items-center gap-2"
      onClick={exportMaintenanceReport}
    >
      <Download className="h-4 w-4" />
      <span>Exportar Relatório</span>
    </Button>
  );
}
