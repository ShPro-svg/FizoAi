import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://mncplniryzvyggzuowoh.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uY3BsbmlyeXp2eWdnenVvd29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTI1NDMsImV4cCI6MjEwMzA2ODU0M30.9uNh8-BU60gVWdG2f3ZEBdQpXyvli_tR86XD0zHk4vY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
