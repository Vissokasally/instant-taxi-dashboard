
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { formSchema, VehicleFormValues } from './vehicle-types';
import { BrandModelFields } from './vehicle-fields/BrandModelFields';
import { LicensePlateField } from './vehicle-fields/LicensePlateField';
import { YearMileageFields } from './vehicle-fields/YearMileageFields';
import { DriverField } from './vehicle-fields/DriverField';

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function VehicleForm({ open, onOpenChange, onSuccess }: VehicleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: drivers = [], isLoading: isLoadingDrivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('motoristas')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marca: '',
      modelo: '',
      matricula: '',
      ano: '',
      quilometragem: '',
      motorista_id: '',
    },
  });

  async function onSubmit(values: VehicleFormValues) {
    try {
      setIsSubmitting(true);
      
      // Process the driver ID - if "none" is selected, set to null
      const driverId = values.motorista_id === 'none' ? null : values.motorista_id || null;
      
      // Inserir veículo no banco de dados
      const { error } = await supabase
        .from('veiculos')
        .insert({
          marca: values.marca,
          modelo: values.modelo,
          matricula: values.matricula,
          ano: parseInt(values.ano, 10),
          quilometragem: parseInt(values.quilometragem, 10),
          motorista_id: driverId,
        });

      if (error) throw error;

      toast({
        title: "Veículo adicionado",
        description: "O veículo foi registrado com sucesso.",
      });
      
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro ao adicionar veículo:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar o veículo. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Veículo</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BrandModelFields form={form} />
            <LicensePlateField form={form} />
            <YearMileageFields form={form} />
            <DriverField 
              form={form} 
              drivers={drivers} 
              isLoading={isLoadingDrivers} 
            />

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar Veículo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
