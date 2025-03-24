
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '../vehicle-types';

interface YearMileageFieldsProps {
  form: UseFormReturn<VehicleFormValues>;
}

export function YearMileageFields({ form }: YearMileageFieldsProps) {
  return (
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
  );
}
