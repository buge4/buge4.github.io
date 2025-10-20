import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { WebsiteSection } from '../lib/types';

interface UseSectionsResult {
  sections: WebsiteSection[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseSectionsOptions {
  visibleOnly?: boolean;
  sectionName?: string;
}

/**
 * Custom hook to fetch website sections from Supabase
 * @param options - Optional configuration for filtering sections
 * @returns Object containing sections data, loading state, error state, and refetch function
 */
export const useSections = (options: UseSectionsOptions = {}): UseSectionsResult => {
  const { visibleOnly = true, sectionName } = options;
  const [sections, setSections] = useState<WebsiteSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('website_sections')
          .select('*')
          .order('order', { ascending: true });

        if (visibleOnly) {
          query = query.eq('visible', true);
        }

        if (sectionName) {
          query = query.eq('section_name', sectionName);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setSections(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [visibleOnly, sectionName, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { sections, loading, error, refetch };
};

/**
 * Custom hook to fetch a single section by name
 * @param sectionName - Name of the section to fetch
 * @returns Object containing section data, loading state, error state, and refetch function
 */
export const useSection = (sectionName: string) => {
  const [section, setSection] = useState<WebsiteSection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    if (!sectionName) {
      setSection(null);
      setLoading(false);
      return;
    }

    const fetchSection = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('website_sections')
          .select('*')
          .eq('section_name', sectionName)
          .eq('visible', true)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setSection(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setSection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [sectionName, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { section, loading, error, refetch };
};
