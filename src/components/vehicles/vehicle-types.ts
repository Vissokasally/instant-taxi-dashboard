
import { z } from 'zod';

export const formSchema = z.object({
  marca: z.string().min(1, "A marca é obrigatória."),
  modelo: z.string().min(1, "O modelo é obrigatório."),
  matricula: z.string().min(5, "A matrícula é obrigatória."),
  ano: z.string().min(4, "O ano é obrigatório.").refine((val) => {
    const year = parseInt(val, 10);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, {
    message: `O ano deve ser válido (entre 1900 e ${new Date().getFullYear() + 1}).`,
  }),
  quilometragem: z.string().min(1, "A quilometragem é obrigatória.").refine((val) => {
    const km = parseInt(val, 10);
    return !isNaN(km) && km >= 0;
  }, {
    message: "A quilometragem deve ser um número válido maior ou igual a zero.",
  }),
  motorista_id: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof formSchema>;
