import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xprtzodwutgskpdvyxwn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcnR6b2R3dXRnc2twZHZ5eHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzIyNzEsImV4cCI6MjA3NjM0ODI3MX0.ovFBpCZeA3X4qxM8um_iaEejhp8zQYGPZVUGC3RbRlw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
