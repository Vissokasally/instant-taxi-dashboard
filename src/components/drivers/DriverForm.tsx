
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera } from 'lucide-react';

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  bi: z.string().min(5, "O BI é obrigatório."),
  cartaConducao: z.string().min(5, "A carta de condução é obrigatória."),
  morada: z.string().min(5, "A morada é obrigatória."),
  foto: z.instanceof(File).optional(),
});

type DriverFormValues = z.infer<typeof formSchema>;

interface DriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DriverForm({ open, onOpenChange, onSuccess }: DriverFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      bi: '',
      cartaConducao: '',
      morada: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('foto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values: DriverFormValues) {
    try {
      setIsSubmitting(true);
      let fotoUrl = null;

      // Upload da foto se existir
      if (values.foto) {
        const fileExt = values.foto.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `motoristas/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('motoristas')
          .upload(filePath, values.foto);

        if (uploadError) {
          throw uploadError;
        }
        
        // Obter URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('motoristas')
          .getPublicUrl(filePath);
          
        fotoUrl = publicUrl;
      }
      
      // Inserir motorista no banco de dados
      const { error } = await supabase
        .from('motoristas')
        .insert({
          nome: values.nome,
          bi: values.bi,
          carta_conducao: values.cartaConducao,
          morada: values.morada,
          foto_url: fotoUrl,
        });

      if (error) throw error;

      toast({
        title: "Motorista adicionado",
        description: "O motorista foi registrado com sucesso.",
      });
      
      form.reset();
      setImagePreview(null);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro ao adicionar motorista:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar o motorista. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Motorista</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div 
                className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 overflow-hidden cursor-pointer"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                <Upload className="h-4 w-4 mr-2" />
                <span>Carregar foto</span>
              </Button>
            </div>
            
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

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar Motorista"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
