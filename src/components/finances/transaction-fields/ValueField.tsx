
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from '../transaction-types';

interface ValueFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function ValueField({ form }: ValueFieldProps) {
  return (
    <FormField
      control={form.control}
      name="valor"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor (AOA)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Ex: 50000" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
