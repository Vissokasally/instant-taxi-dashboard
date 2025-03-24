
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formSchema, TransactionFormValues, transactionCategories } from './transaction-types';
import { DateField } from './transaction-fields/DateField';
import { TypeField } from './transaction-fields/TypeField';
import { CategoryField } from './transaction-fields/CategoryField';
import { ValueField } from './transaction-fields/ValueField';
import { DescriptionField } from './transaction-fields/DescriptionField';
import { ReceiptField } from './transaction-fields/ReceiptField';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function TransactionForm({ open, onOpenChange, onSuccess }: TransactionFormProps) {
  const { toast } = useToast();
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: new Date(),
      tipo: 'Entrada',
      categoria: '',
      descricao: '',
      valor: '',
      recibo: false,
    },
  });

  const selectedTipo = form.watch('tipo') as 'Entrada' | 'Saída';

  async function onSubmit(values: TransactionFormValues) {
    try {
      const parsedValue = parseFloat(values.valor.replace(',', '.'));
      
      const { error } = await supabase
        .from('transacoes')
        .insert({
          data: format(values.data, 'yyyy-MM-dd'),
          tipo: values.tipo,
          categoria: values.categoria,
          descricao: values.descricao || null,
          valor: parsedValue,
          recibo: values.recibo,
        });

      if (error) throw error;

      toast({
        title: "Transação adicionada",
        description: "A transação foi registrada com sucesso.",
      });
      
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar a transação. Tente novamente.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova transação financeira ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DateField form={form} />
              <TypeField form={form} />
            </div>
            
            <CategoryField form={form} categorias={transactionCategories} selectedTipo={selectedTipo} />
            <ValueField form={form} />
            <DescriptionField form={form} />
            <ReceiptField form={form} />

            <DialogFooter>
              <Button type="submit" className="w-full">Adicionar Transação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
