
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DriverFormValues, formSchema } from './driver-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { BasicInfoFields } from './driver-fields/BasicInfoFields';
import { DocumentUploadFields } from './driver-fields/DocumentUploadFields';
import { PhotoUploadField } from './driver-fields/PhotoUploadField';

interface DriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  driverId?: string; // Added to support edit mode
}

export default function DriverForm({ open, onOpenChange, onSuccess, driverId }: DriverFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [biFile, setBiFile] = useState<File | null>(null);
  const [cartaFile, setCartaFile] = useState<File | null>(null);

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      bi: '',
      carta_conducao: '',
      morada: '',
      foto_url: '',
      bi_pdf_url: '',
      carta_pdf_url: '',
    },
  });

  // Fetch driver data if in edit mode
  useEffect(() => {
    const fetchDriverData = async () => {
      if (!driverId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('motoristas')
          .select('*')
          .eq('id', driverId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Populate form with driver data
          form.reset({
            nome: data.nome,
            bi: data.bi,
            carta_conducao: data.carta_conducao,
            morada: data.morada,
            foto_url: data.foto_url || '',
            bi_pdf_url: data.bi_pdf_url || '',
            carta_pdf_url: data.carta_pdf_url || '',
          });
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do motorista.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open && driverId) {
      fetchDriverData();
    } else {
      // Reset form when opening in add mode
      if (open) {
        form.reset({
          nome: '',
          bi: '',
          carta_conducao: '',
          morada: '',
          foto_url: '',
          bi_pdf_url: '',
          carta_pdf_url: '',
        });
      }
    }
  }, [driverId, open, form, toast]);

  async function onSubmit(values: DriverFormValues) {
    setIsSubmitting(true);
    
    try {
      // Upload photo if provided
      let photoUrl = values.foto_url;
      if (photoFile) {
        const photoFilePath = `drivers/${Date.now()}_${photoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(photoFilePath, photoFile);
          
        if (uploadError) throw uploadError;
        
        photoUrl = `${photoFilePath}`;
      }
      
      // Upload BI document if provided
      let biUrl = values.bi_pdf_url;
      if (biFile) {
        const biFilePath = `documents/${Date.now()}_${biFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(biFilePath, biFile);
          
        if (uploadError) throw uploadError;
        
        biUrl = `${biFilePath}`;
      }
      
      // Upload driver's license if provided
      let cartaUrl = values.carta_pdf_url;
      if (cartaFile) {
        const cartaFilePath = `documents/${Date.now()}_${cartaFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(cartaFilePath, cartaFile);
          
        if (uploadError) throw uploadError;
        
        cartaUrl = `${cartaFilePath}`;
      }
      
      const driverData = {
        nome: values.nome,
        bi: values.bi,
        carta_conducao: values.carta_conducao,
        morada: values.morada,
        foto_url: photoUrl,
        bi_pdf_url: biUrl,
        carta_pdf_url: cartaUrl,
      };
      
      let error;
      
      // Update or insert based on whether we're in edit mode
      if (driverId) {
        // Update existing driver
        const { error: updateError } = await supabase
          .from('motoristas')
          .update(driverData)
          .eq('id', driverId);
          
        error = updateError;
      } else {
        // Insert new driver
        const { error: insertError } = await supabase
          .from('motoristas')
          .insert([driverData]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: driverId ? "Motorista atualizado" : "Motorista adicionado",
        description: driverId 
          ? "Os dados do motorista foram atualizados com sucesso."
          : "O motorista foi adicionado com sucesso.",
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error('Error saving driver:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar os dados do motorista. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{driverId ? "Editar Motorista" : "Adicionar Motorista"}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1 space-y-6">
                  <BasicInfoFields form={form} />
                </div>
                
                <div className="md:col-span-1 space-y-6">
                  <PhotoUploadField 
                    form={form} 
                    onPhotoSelected={setPhotoFile}
                    initialPhotoUrl={form.getValues('foto_url')}
                  />
                  
                  <DocumentUploadFields 
                    form={form}
                    onBiSelected={setBiFile}
                    onCartaSelected={setCartaFile}
                    initialBiUrl={form.getValues('bi_pdf_url')}
                    initialCartaUrl={form.getValues('carta_pdf_url')}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {driverId ? "Atualizar Motorista" : "Adicionar Motorista"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
