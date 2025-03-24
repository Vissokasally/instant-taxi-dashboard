
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Users, Car } from 'lucide-react';

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
  marca: z.string().min(1, "A marca é obrigatória."),
  modelo: z.string().min(1, "O modelo é obrigatório."),
  matricula: z.string().min(5, "A matrícula é obrigatória."),
  ano: z.string().min(4, "O ano é obrigatório.").refine((val) => {
    const year = parseInt(val, 10);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, {
    message: `O ano deve ser válido (entre 1900 e ${new Date().getFullYear() + 1}).`,
  }),
  quilometragem: z.string().min(1, "A quilometragem é obrigatória.").refine((val) => {
    const km = parseInt(val, 10);
    return !isNaN(km) && km >= 0;
  }, {
    message: "A quilometragem deve ser um número válido maior ou igual a zero.",
  }),
  motorista_id: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof formSchema>;

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
      
      // Inserir veículo no banco de dados
      const { error } = await supabase
        .from('veiculos')
        .insert({
          marca: values.marca,
          modelo: values.modelo,
          matricula: values.matricula,
          ano: parseInt(values.ano, 10),
          quilometragem: parseInt(values.quilometragem, 10),
          motorista_id: values.motorista_id || null,
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: LD-12-34-AB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2020" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quilometragem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 50000" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="motorista_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motorista (opcional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoadingDrivers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motorista (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">
                        <span className="text-muted-foreground">Nenhum motorista</span>
                      </SelectItem>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{driver.nome}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
