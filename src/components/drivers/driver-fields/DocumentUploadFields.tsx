
import React, { useState, useRef } from 'react';
import { FileText } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { DriverFormValues } from '../driver-types';

interface DocumentUploadFieldsProps {
  form: UseFormReturn<DriverFormValues>;
  onBiSelected: React.Dispatch<React.SetStateAction<File | null>>;
  onCartaSelected: React.Dispatch<React.SetStateAction<File | null>>;
  initialBiUrl?: string;
  initialCartaUrl?: string;
}

export function DocumentUploadFields({ 
  form, 
  onBiSelected, 
  onCartaSelected,
  initialBiUrl,
  initialCartaUrl
}: DocumentUploadFieldsProps) {
  const [biFileName, setBiFileName] = useState<string | null>(initialBiUrl ? 'Documento carregado' : null);
  const [cartaFileName, setCartaFileName] = useState<string | null>(initialCartaUrl ? 'Documento carregado' : null);
  const biFileInputRef = useRef<HTMLInputElement>(null);
  const cartaFileInputRef = useRef<HTMLInputElement>(null);

  const handleBiPdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onBiSelected(file);
      setBiFileName(file.name);
    }
  };

  const handleCartaPdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCartaSelected(file);
      setCartaFileName(file.name);
    }
  };

  const triggerBiFileInput = () => {
    biFileInputRef.current?.click();
  };

  const triggerCartaFileInput = () => {
    cartaFileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <FormLabel>Documento do BI (PDF)</FormLabel>
        <div className="mt-1">
          <input
            type="file"
            ref={biFileInputRef}
            onChange={handleBiPdfChange}
            accept="application/pdf"
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={triggerBiFileInput}
            className="w-full flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="truncate">
              {biFileName ? biFileName : "Anexar BI (PDF)"}
            </span>
          </Button>
        </div>
      </div>
      
      <div>
        <FormLabel>Carta de Condução (PDF)</FormLabel>
        <div className="mt-1">
          <input
            type="file"
            ref={cartaFileInputRef}
            onChange={handleCartaPdfChange}
            accept="application/pdf"
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={triggerCartaFileInput}
            className="w-full flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="truncate">
              {cartaFileName ? cartaFileName : "Anexar Carta (PDF)"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
