
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formSchema, DriverFormValues } from './driver-types';
import { PhotoUploadField } from './driver-fields/PhotoUploadField';
import { BasicInfoFields } from './driver-fields/BasicInfoFields';
import { DocumentUploadFields } from './driver-fields/DocumentUploadFields';
import { uploadDriverPhoto, uploadDriverDocument } from './driver-fields/FileUploader';

interface DriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DriverForm({ open, onOpenChange, onSuccess }: DriverFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biFileName, setBiFileName] = useState<string | null>(null);
  const [cartaFileName, setCartaFileName] = useState<string | null>(null);
  
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      bi: '',
      cartaConducao: '',
      morada: '',
    },
  });

  async function onSubmit(values: DriverFormValues) {
    try {
      setIsSubmitting(true);
      let fotoUrl = null;
      let biPdfUrl = null;
      let cartaPdfUrl = null;

      // Upload da foto se existir
      if (values.foto) {
        fotoUrl = await uploadDriverPhoto(values.foto);
      }
      
      // Upload do PDF do BI se existir
      if (values.bi_pdf) {
        biPdfUrl = await uploadDriverDocument(values.bi_pdf, 'bi');
      }
      
      // Upload do PDF da Carta de Condução se existir
      if (values.carta_pdf) {
        cartaPdfUrl = await uploadDriverDocument(values.carta_pdf, 'carta');
      }
      
      // Inserir motorista no banco de dados
      const { error } = await supabase
        .from('motoristas')
        .insert({
          nome: values.nome,
          bi: values.bi,
          carta_conducao: values.cartaConducao,
          morada: values.morada,
          foto_url: fotoUrl,
          bi_pdf_url: biPdfUrl,
          carta_pdf_url: cartaPdfUrl
        });

      if (error) throw error;

      toast({
        title: "Motorista adicionado",
        description: "O motorista foi registrado com sucesso.",
      });
      
      form.reset();
      setImagePreview(null);
      setBiFileName(null);
      setCartaFileName(null);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro ao adicionar motorista:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar o motorista. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Motorista</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PhotoUploadField 
              imagePreview={imagePreview} 
              setImagePreview={setImagePreview} 
              setValue={form.setValue}
            />
            
            <BasicInfoFields form={form} />
            
            <DocumentUploadFields 
              biFileName={biFileName}
              setBiFileName={setBiFileName}
              cartaFileName={cartaFileName}
              setCartaFileName={setCartaFileName}
              setValue={form.setValue}
            />

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar Motorista"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
