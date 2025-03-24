
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from '../transaction-types';

interface ReceiptFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export function ReceiptField({ form }: ReceiptFieldProps) {
  return (
    <FormField
      control={form.control}
      name="recibo"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <div className="flex items-center space-x-2">
              <Input 
                type="checkbox" 
                className="w-4 h-4" 
                checked={field.value}
                onChange={field.onChange}
              />
              <div className="space-y-1 leading-none">
                <FormLabel>Tem recibo</FormLabel>
              </div>
              {field.value && (
                <Button type="button" variant="outline" size="sm" className="ml-4">
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Anexar recibo</span>
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
