import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface StatusCard {
  id: number;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  icon_color: string;
  gradient_from: string;
  gradient_to: string;
  details?: string[];
  order: number;
}

export interface TimelineEvent {
  id: number;
  period: string;
  title: string;
  status: string;
  status_text: string;
  status_color: string;
  icon: string;
  icon_color: string;
  bg_color: string;
  order: number;
}

export interface DashboardContent {
  id: number;
  section_key: string;
  title: string;
  content: string;
  order: number;
}

interface UseDashboardResult {
  statusCards: StatusCard[];
  timeline: TimelineEvent[];
  content: DashboardContent[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch Business Hub Dashboard data from Supabase
 * Fetches status cards, timeline events, and other dashboard content
 */
export const useBusinessHubDashboard = (): UseDashboardResult => {
  const [statusCards, setStatusCards] = useState<StatusCard[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [content, setContent] = useState<DashboardContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch status cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('business_hub_status_cards')
          .select('*')
          .eq('visible', true)
          .order('order', { ascending: true });

        if (cardsError) throw new Error(`Status cards: ${cardsError.message}`);

        // Fetch timeline events
        const { data: timelineData, error: timelineError } = await supabase
          .from('business_hub_timeline')
          .select('*')
          .eq('visible', true)
          .order('order', { ascending: true });

        if (timelineError) throw new Error(`Timeline: ${timelineError.message}`);

        // Fetch dashboard content sections
        const { data: contentData, error: contentError } = await supabase
          .from('business_hub_dashboard_content')
          .select('*')
          .eq('visible', true)
          .order('order', { ascending: true });

        if (contentError) throw new Error(`Content: ${contentError.message}`);

        setStatusCards(cardsData || []);
        setTimeline(timelineData || []);
        setContent(contentData || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setStatusCards([]);
        setTimeline([]);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { statusCards, timeline, content, loading, error, refetch };
};
