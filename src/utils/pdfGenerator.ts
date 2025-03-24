
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const createPdfReport = (
  title: string,
  headers: string[],
  data: string[][],
  summaryData?: { label: string; value: string }[],
  orientation: 'portrait' | 'landscape' = 'portrait'
) => {
  try {
    // Create PDF document
    const doc = new jsPDF({ orientation });
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
    
    // Add table
    autoTable(doc, {
      head: [headers],
      body: data,
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
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Add summary if provided
    if (summaryData && summaryData.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text('Resumo:', 14, finalY);
      
      doc.setFontSize(10);
      summaryData.forEach((item, index) => {
        doc.text(`${item.label}: ${item.value}`, 14, finalY + (7 * (index + 1)));
      });
    }
    
    // Generate filename
    const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    return { success: true, message: "Relatório exportado com sucesso." };
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return { success: false, message: "Falha ao gerar o relatório. Tente novamente." };
  }
};
