
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Car } from 'lucide-react';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MaintenanceFormValues } from '../maintenance-types';

interface VehicleSelectFieldProps {
  form: UseFormReturn<MaintenanceFormValues>;
  vehicles: any[];
  isLoading: boolean;
}

export function VehicleSelectField({ form, vehicles, isLoading }: VehicleSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="veiculo_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Veículo</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {vehicles.map((vehicle) => (
                // Make sure vehicle.id is not empty
                vehicle.id ? (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>{vehicle.marca} {vehicle.modelo} - {vehicle.matricula}</span>
                    </div>
                  </SelectItem>
                ) : null
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
