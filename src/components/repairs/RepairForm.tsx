
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Upload, Car } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
  veiculo_id: z.string().min(1, "O veículo é obrigatório."),
  peca: z.string().min(1, "A peça é obrigatória."),
  data: z.date({
    required_error: "A data é obrigatória.",
  }),
  preco: z.string().min(1, "O preço é obrigatório.").refine(val => !isNaN(Number(val.replace(',', '.'))), {
    message: "O preço deve ser um número válido.",
  }),
  descricao: z.string().optional(),
  hasReceipt: z.boolean().default(false),
});

type RepairFormValues = z.infer<typeof formSchema>;

interface RepairFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function RepairForm({ open, onOpenChange, onSuccess }: RepairFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const form = useForm<RepairFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      veiculo_id: '',
      peca: '',
      data: new Date(),
      preco: '',
      descricao: '',
      hasReceipt: false,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values: RepairFormValues) {
    try {
      setIsSubmitting(true);
      let receiptUrl = null;

      // Upload do recibo se existir
      if (values.hasReceipt && receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('recibos_reparacoes')
          .upload(filePath, receiptFile);

        if (uploadError) {
          throw uploadError;
        }
        
        // Obter URL pública do recibo
        const { data: { publicUrl } } = supabase.storage
          .from('recibos_reparacoes')
          .getPublicUrl(filePath);
          
        receiptUrl = publicUrl;
      }
      
      const parsedValue = parseFloat(values.preco.replace(',', '.'));
      
      // Inserir reparação no banco de dados
      const { error } = await supabase
        .from('reparacoes')
        .insert({
          veiculo_id: values.veiculo_id,
          peca: values.peca,
          data: format(values.data, 'yyyy-MM-dd'),
          preco: parsedValue,
          descricao: values.descricao || null,
          recibo_pdf_url: receiptUrl,
        });

      if (error) throw error;

      toast({
        title: "Reparação registrada",
        description: "A reparação foi registrada com sucesso.",
      });
      
      form.reset();
      setReceiptFile(null);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro ao registrar reparação:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível registrar a reparação. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Reparação</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="veiculo_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veículo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoadingVehicles}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o veículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span>{vehicle.marca} {vehicle.modelo} - {vehicle.matricula}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="peca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peça</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Travões" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (AOA)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 35000" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição detalhada da reparação" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasReceipt"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="checkbox" 
                        className="w-4 h-4" 
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <div className="space-y-1 leading-none">
                        <FormLabel>Tem recibo</FormLabel>
                      </div>
                    </div>
                  </FormControl>
                  {field.value && (
                    <div className="ml-auto">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="application/pdf"
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={triggerFileInput}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{receiptFile ? receiptFile.name : "Anexar recibo (PDF)"}</span>
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Reparação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
