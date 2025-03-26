
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormValues } from '../vehicle-types';

interface Driver {
  id: string;
  nome: string;
  foto_url?: string;
}

interface DriverFieldProps {
  form: UseFormReturn<VehicleFormValues>;
  drivers: Driver[];
  isLoading: boolean;
}

export function DriverField({ form, drivers, isLoading }: DriverFieldProps) {
  return (
    <FormField
      control={form.control}
      name="motorista_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Motorista (opcional)</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motorista (opcional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">
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
  );
}
