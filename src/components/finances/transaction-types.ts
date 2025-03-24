
import { z } from 'zod';

export const formSchema = z.object({
  data: z.date({
    required_error: "A data é obrigatória.",
  }),
  tipo: z.enum(['Entrada', 'Saída'], {
    required_error: "O tipo é obrigatório.",
  }),
  categoria: z.string().min(1, "A categoria é obrigatória."),
  descricao: z.string().optional(),
  valor: z.string().min(1, "O valor é obrigatório.").refine(val => !isNaN(Number(val.replace(',', '.'))), {
    message: "O valor deve ser um número válido.",
  }),
  recibo: z.boolean().default(false),
});

export type TransactionFormValues = z.infer<typeof formSchema>;

export const transactionCategories = {
  Entrada: [
    'Serviço de Táxi', 
    'Aluguel de Veículo', 
    'Vendas', 
    'Investimentos', 
    'Outros'
  ],
  Saída: [
    'Reparação', 
    'Gasolina', 
    'Salários', 
    'Manutenção', 
    'Seguro', 
    'Impostos', 
    'Outros'
  ]
};
