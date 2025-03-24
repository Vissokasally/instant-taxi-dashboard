
import { supabase } from '@/integrations/supabase/client';

export async function uploadDriverPhoto(file: File): Promise<string | null> {
  if (!file) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `motoristas/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('motoristas')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }
  
  // Obter URL pública da imagem
  const { data: { publicUrl } } = supabase.storage
    .from('motoristas')
    .getPublicUrl(filePath);
    
  return publicUrl;
}

export async function uploadDriverDocument(file: File, prefix: string): Promise<string | null> {
  if (!file) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${prefix}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documentos_motoristas')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }
  
  // Obter URL pública do documento
  const { data: { publicUrl } } = supabase.storage
    .from('documentos_motoristas')
    .getPublicUrl(filePath);
    
  return publicUrl;
}
