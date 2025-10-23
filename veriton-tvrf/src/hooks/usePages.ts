import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DynamicPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords: string[];
  template: string;
  published: boolean;
  show_in_nav: boolean;
  nav_order: number;
  parent_page_id: number | null;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface PageBlock {
  id: number;
  page_id: number;
  block_type: string;
  content: any;
  order: number;
  visible: boolean;
  settings: any;
  created_at: string;
  updated_at: string;
}

interface UsePagesResult {
  pages: DynamicPage[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UsePagesOptions {
  publishedOnly?: boolean;
  showInNavOnly?: boolean;
  parentPageId?: number | null;
}

/**
 * Custom hook to fetch dynamic pages from Supabase
 * @param options - Optional configuration for filtering pages
 * @returns Object containing pages data, loading state, error state, and refetch function
 */
export const usePages = (options: UsePagesOptions = {}): UsePagesResult => {
  const { publishedOnly = true, showInNavOnly = false, parentPageId } = options;
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('dynamic_pages')
          .select('*')
          .order('nav_order', { ascending: true });

        if (publishedOnly) {
          query = query.eq('published', true);
        }

        if (showInNavOnly) {
          query = query.eq('show_in_nav', true);
        }

        if (parentPageId !== undefined) {
          query = query.eq('parent_page_id', parentPageId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setPages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [publishedOnly, showInNavOnly, parentPageId, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { pages, loading, error, refetch };
};

/**
 * Custom hook to fetch a single page by slug
 * @param slug - Slug of the page to fetch
 * @returns Object containing page data, loading state, error state, and refetch function
 */
export const usePage = (slug: string) => {
  const [page, setPage] = useState<DynamicPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    if (!slug) {
      setPage(null);
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('dynamic_pages')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setPage(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { page, loading, error, refetch };
};

/**
 * Custom hook to fetch page blocks for a specific page
 * @param pageId - ID of the page to fetch blocks for
 * @returns Object containing blocks data, loading state, error state, and refetch function
 */
export const usePageBlocks = (pageId: number | null) => {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    if (!pageId) {
      setBlocks([]);
      setLoading(false);
      return;
    }

    const fetchBlocks = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('page_blocks')
          .select('*')
          .eq('page_id', pageId)
          .eq('visible', true)
          .order('order', { ascending: true });

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setBlocks(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [pageId, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { blocks, loading, error, refetch };
};
