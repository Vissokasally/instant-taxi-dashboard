
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DriverFormValues } from '../driver-types';

interface BasicInfoFieldsProps {
  form: UseFormReturn<DriverFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo</FormLabel>
            <FormControl>
              <Input placeholder="Ex: João Martins" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do BI</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 12345678LA123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cartaConducao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carta de Condução</FormLabel>
              <FormControl>
                <Input placeholder="Ex: CC12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="morada"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Morada</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Rua das Acácias, 123, Luanda" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
