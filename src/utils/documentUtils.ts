
import { supabase, getStorageUrl } from '@/integrations/supabase/client';

// Function to get the URL for a document in Supabase storage
export const getDocumentUrl = (bucket: string, path: string) => {
  if (!path) return null;
  return getStorageUrl(bucket, path);
};

// Function to download a document from a URL
export const downloadDocument = async (url: string, filename: string) => {
  try {
    if (!url) {
      return { success: false, message: 'URL inválida' };
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Falha ao baixar o arquivo');
    }
    
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(objectUrl);
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading document:', error);
    return { success: false, error };
  }
};

// Function to view a document in a new tab
export const viewDocument = (url: string) => {
  if (!url) return { success: false, message: 'URL inválida' };
  
  try {
    window.open(url, '_blank');
    return { success: true };
  } catch (error) {
    console.error('Error viewing document:', error);
    return { success: false, error };
  }
};
