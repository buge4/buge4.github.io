import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aclarjebppirybmjasld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbGFyamVicHBpcnlibWphc2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMTQwNjgsImV4cCI6MjA3NDY5MDA2OH0.PQ8w4AgyCMANHh6Ve2juBKVq9SW43ovcDCSRXkislFc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
