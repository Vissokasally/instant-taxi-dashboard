
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from '../transaction-types';

interface DescriptionFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function DescriptionField({ form }: DescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="descricao"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descrição detalhada da transação" 
              className="resize-none" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
