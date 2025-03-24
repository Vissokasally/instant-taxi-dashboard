
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '../vehicle-types';

interface LicensePlateFieldProps {
  form: UseFormReturn<VehicleFormValues>;
}

export function LicensePlateField({ form }: LicensePlateFieldProps) {
  return (
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
  );
}
