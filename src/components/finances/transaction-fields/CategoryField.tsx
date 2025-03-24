
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from '../transaction-types';

interface CategoryFieldProps {
  form: UseFormReturn<TransactionFormValues>;
  categorias: Record<'Entrada' | 'Saída', string[]>;
  selectedTipo: 'Entrada' | 'Saída';
}

export function CategoryField({ form, categorias, selectedTipo }: CategoryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="categoria"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoria</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categorias[selectedTipo].map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
