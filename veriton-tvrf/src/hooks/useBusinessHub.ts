import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BusinessHubArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image_url: string;
  published: boolean;
  featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessHubCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  visible: boolean;
}

interface UseBusinessHubArticlesResult {
  articles: BusinessHubArticle[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseBusinessHubArticlesOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
  publishedOnly?: boolean;
}

/**
 * Custom hook to fetch business hub articles from Supabase
 * @param options - Optional configuration for filtering articles
 * @returns Object containing articles data, loading state, error state, and refetch function
 */
export const useBusinessHubArticles = (
  options: UseBusinessHubArticlesOptions = {}
): UseBusinessHubArticlesResult => {
  const { category, featured, limit, publishedOnly = true } = options;
  const [articles, setArticles] = useState<BusinessHubArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('business_hub_articles')
          .select('*')
          .order('published_at', { ascending: false });

        if (publishedOnly) {
          query = query.eq('published', true);
        }

        if (category) {
          query = query.eq('category', category);
        }

        if (featured !== undefined) {
          query = query.eq('featured', featured);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setArticles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, featured, limit, publishedOnly, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { articles, loading, error, refetch };
};

/**
 * Custom hook to fetch a single business hub article by slug
 * @param slug - Slug of the article to fetch
 * @returns Object containing article data, loading state, error state, and refetch function
 */
export const useBusinessHubArticle = (slug: string) => {
  const [article, setArticle] = useState<BusinessHubArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    if (!slug) {
      setArticle(null);
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('business_hub_articles')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { article, loading, error, refetch };
};

/**
 * Custom hook to fetch business hub categories from Supabase
 * @param visibleOnly - Whether to fetch only visible categories (default: true)
 * @returns Object containing categories data, loading state, error state, and refetch function
 */
export const useBusinessHubCategories = (visibleOnly: boolean = true) => {
  const [categories, setCategories] = useState<BusinessHubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('business_hub_categories')
          .select('*')
          .order('order', { ascending: true });

        if (visibleOnly) {
          query = query.eq('visible', true);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [visibleOnly, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { categories, loading, error, refetch };
};
