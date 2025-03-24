
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { 
  maintenanceFormSchema,
  MaintenanceFormValues,
  MaintenanceFormProps 
} from './maintenance-types';
import { VehicleSelectField } from './maintenance-fields/VehicleSelectField';
import { DateField } from './maintenance-fields/DateField';

export default function MaintenanceForm({ open, onOpenChange, onSuccess }: MaintenanceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('marca', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      veiculo_id: '',
      data_agendada: new Date(),
    },
  });

  async function onSubmit(values: MaintenanceFormValues) {
    try {
      setIsSubmitting(true);
      
      // Inserir agendamento de manutenção no banco de dados
      const { error } = await supabase
        .from('manutencoes')
        .insert({
          veiculo_id: values.veiculo_id,
          data_agendada: format(values.data_agendada, 'yyyy-MM-dd'),
          realizada: false,
        });

      if (error) throw error;

      toast({
        title: "Manutenção agendada",
        description: "A manutenção foi agendada com sucesso.",
      });
      
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro ao agendar manutenção:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível agendar a manutenção. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agendar Manutenção</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <VehicleSelectField 
              form={form} 
              vehicles={vehicles} 
              isLoading={isLoadingVehicles} 
            />
            
            <DateField form={form} />

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Agendando..." : "Agendar Manutenção"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
