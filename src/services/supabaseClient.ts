import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://iiospycdcnwlejmmkjso.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpb3NweWNkY253bGVqbW1ranNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDc2MTEsImV4cCI6MjEwMjkyMzYxMX0.BvJKVC0rody4iGfo4y1MoC5etNwW-0au_8EHfZ8ew2Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
