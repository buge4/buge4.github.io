import { supabase } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Custom hook to access the Supabase client
 * @returns Supabase client instance
 */
export const useSupabase = (): SupabaseClient => {
  return supabase;
};
