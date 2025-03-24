
import * as z from 'zod';

export const maintenanceFormSchema = z.object({
  veiculo_id: z.string().min(1, "O veículo é obrigatório."),
  data_agendada: z.date({
    required_error: "A data é obrigatória.",
  }),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

export interface MaintenanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
