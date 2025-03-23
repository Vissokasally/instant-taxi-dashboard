
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Criar cliente do Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar se o bucket já existe
    const { data: buckets } = await supabaseAdmin
      .storage
      .listBuckets()

    const motoristaBucketExists = buckets?.some(b => b.name === 'motoristas')
    if (!motoristaBucketExists) {
      // Criar o bucket para motoristas
      const { error: createError } = await supabaseAdmin
        .storage
        .createBucket('motoristas', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 5, // 5MB
        })

      if (createError) {
        throw createError
      }
    }

    // Verificar se o bucket de recibos já existe
    const reciboBucketExists = buckets?.some(b => b.name === 'recibos')
    if (!reciboBucketExists) {
      // Criar o bucket para recibos
      const { error: createError } = await supabaseAdmin
        .storage
        .createBucket('recibos', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 5, // 5MB
        })

      if (createError) {
        throw createError
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Buckets criados com sucesso' 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Erro ao configurar storage:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})
