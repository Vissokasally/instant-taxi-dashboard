
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
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
import { Loader2 } from 'lucide-react';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  transactionId?: string; // Added to support edit mode
}

export default function TransactionForm({ open, onOpenChange, onSuccess, transactionId }: TransactionFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Fetch transaction data if in edit mode
  useEffect(() => {
    const fetchTransactionData = async () => {
      if (!transactionId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transacoes')
          .select('*')
          .eq('id', transactionId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Populate form with transaction data
          form.reset({
            data: parseISO(data.data),
            tipo: data.tipo as 'Entrada' | 'Saída',
            categoria: data.categoria,
            descricao: data.descricao || '',
            valor: data.valor.toString(),
            recibo: data.recibo_pdf_url ? true : false,
          });
        }
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados da transação.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open && transactionId) {
      fetchTransactionData();
    } else if (open) {
      // Reset form when opening in add mode
      form.reset({
        data: new Date(),
        tipo: 'Entrada',
        categoria: '',
        descricao: '',
        valor: '',
        recibo: false,
      });
    }
  }, [transactionId, open, form, toast]);

  async function onSubmit(values: TransactionFormValues) {
    try {
      setIsSubmitting(true);
      const parsedValue = parseFloat(values.valor.replace(',', '.'));
      
      const transactionData = {
        data: format(values.data, 'yyyy-MM-dd'),
        tipo: values.tipo,
        categoria: values.categoria,
        descricao: values.descricao || null,
        valor: parsedValue,
        recibo: values.recibo,
      };
      
      let error;
      
      if (transactionId) {
        // Update existing transaction
        const { error: updateError } = await supabase
          .from('transacoes')
          .update(transactionData)
          .eq('id', transactionId);
          
        error = updateError;
      } else {
        // Insert new transaction
        const { error: insertError } = await supabase
          .from('transacoes')
          .insert(transactionData);
          
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: transactionId ? "Transação atualizada" : "Transação adicionada",
        description: transactionId 
          ? "A transação foi atualizada com sucesso."
          : "A transação foi registrada com sucesso.",
      });
      
      form.reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a transação. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transactionId ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {transactionId ? 'Edite os dados da transação financeira.' : 'Adicione uma nova transação financeira ao sistema.'}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando...</span>
          </div>
        ) : (
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {transactionId ? 'Atualizar Transação' : 'Adicionar Transação'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
