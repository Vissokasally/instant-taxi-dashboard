// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ccbzldrnywpfsstiksdi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjYnpsZHJueXdwZnNzdGlrc2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MzQwNTEsImV4cCI6MjA1ODMxMDA1MX0.Pt9uSz61ag_MC6px_bem0xOFzGZAZkCwtenN9bk7PvE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);