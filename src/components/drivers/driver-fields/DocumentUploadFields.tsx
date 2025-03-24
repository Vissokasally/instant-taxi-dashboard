
import React, { useRef } from 'react';
import { FileText } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormSetValue } from 'react-hook-form';
import { DriverFormValues } from '../driver-types';

interface DocumentUploadFieldsProps {
  biFileName: string | null;
  setBiFileName: React.Dispatch<React.SetStateAction<string | null>>;
  cartaFileName: string | null;
  setCartaFileName: React.Dispatch<React.SetStateAction<string | null>>;
  setValue: UseFormSetValue<DriverFormValues>;
}

export function DocumentUploadFields({ 
  biFileName, 
  setBiFileName, 
  cartaFileName, 
  setCartaFileName, 
  setValue 
}: DocumentUploadFieldsProps) {
  const biFileInputRef = useRef<HTMLInputElement>(null);
  const cartaFileInputRef = useRef<HTMLInputElement>(null);

  const handleBiPdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('bi_pdf', file);
      setBiFileName(file.name);
    }
  };

  const handleCartaPdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('carta_pdf', file);
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
