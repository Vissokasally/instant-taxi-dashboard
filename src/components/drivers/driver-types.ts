
import { z } from 'zod';

export const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  bi: z.string().min(5, "O BI é obrigatório."),
  carta_conducao: z.string().min(5, "A carta de condução é obrigatória."),
  morada: z.string().min(5, "A morada é obrigatória."),
  foto_url: z.string().optional(),
  bi_pdf_url: z.string().optional(),
  carta_pdf_url: z.string().optional(),
});

export type DriverFormValues = z.infer<typeof formSchema>;
