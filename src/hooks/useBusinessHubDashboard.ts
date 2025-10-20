import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Database schema interfaces
interface StatusCardDB {
  id: number;
  metric_key: string;
  metric_value: string;
  metric_label: string;
  metric_description: string | null;
  category: string | null;
  display_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

interface TimelineEventDB {
  id: number;
  event_title: string;
  event_description: string | null;
  event_date: string;
  status: string;
  category: string | null;
  display_order: number;
  visible: boolean;
  created_at: string;
}

interface DashboardContentDB {
  id: number;
  section_key: string;
  title: string;
  content: string;
  display_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// UI-friendly interfaces (what components expect)
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

// Mapping functions to transform database data to UI format
const mapStatusCard = (dbCard: StatusCardDB): StatusCard => {
  // Category-based styling
  const categoryStyles: Record<string, { icon: string; icon_color: string; gradient_from: string; gradient_to: string }> = {
    patent: { icon: 'Shield', icon_color: '#10b981', gradient_from: '#d1fae5', gradient_to: '#a7f3d0' },
    platform: { icon: 'TrendingUp', icon_color: '#3b82f6', gradient_from: '#dbeafe', gradient_to: '#bfdbfe' },
    market: { icon: 'Users', icon_color: '#f59e0b', gradient_from: '#fef3c7', gradient_to: '#fde68a' },
    technology: { icon: 'Globe', icon_color: '#8b5cf6', gradient_from: '#ede9fe', gradient_to: '#ddd6fe' },
  };

  const style = categoryStyles[dbCard.category || 'technology'] || categoryStyles.technology;

  return {
    id: dbCard.id,
    title: dbCard.metric_label,
    value: dbCard.metric_value,
    subtitle: dbCard.metric_description || '',
    icon: style.icon,
    icon_color: style.icon_color,
    gradient_from: style.gradient_from,
    gradient_to: style.gradient_to,
    details: dbCard.metric_description ? [dbCard.metric_description] : [],
    order: dbCard.display_order,
  };
};

const mapTimelineEvent = (dbEvent: TimelineEventDB): TimelineEvent => {
  // Status-based styling
  const statusStyles: Record<string, { status_color: string; icon: string; icon_color: string; bg_color: string }> = {
    Complete: { status_color: '#10b981', icon: 'CheckCircle', icon_color: '#ffffff', bg_color: '#10b981' },
    'In Progress': { status_color: '#f59e0b', icon: 'Clock', icon_color: '#ffffff', bg_color: '#f59e0b' },
    Planned: { status_color: '#6b7280', icon: 'FileText', icon_color: '#ffffff', bg_color: '#9ca3af' },
  };

  const style = statusStyles[dbEvent.status] || statusStyles.Planned;

  return {
    id: dbEvent.id,
    period: dbEvent.event_date,
    title: dbEvent.event_title,
    status: dbEvent.status,
    status_text: dbEvent.event_description || '',
    status_color: style.status_color,
    icon: style.icon,
    icon_color: style.icon_color,
    bg_color: style.bg_color,
    order: dbEvent.display_order,
  };
};

const mapDashboardContent = (dbContent: DashboardContentDB): DashboardContent => {
  return {
    id: dbContent.id,
    section_key: dbContent.section_key,
    title: dbContent.title,
    content: dbContent.content,
    order: dbContent.display_order,
  };
};

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
          .order('display_order', { ascending: true });

        if (cardsError) throw new Error(`Status cards: ${cardsError.message}`);

        // Fetch timeline events - CORRECTED TABLE NAME
        const { data: timelineData, error: timelineError } = await supabase
          .from('business_hub_timeline_events')
          .select('*')
          .eq('visible', true)
          .order('display_order', { ascending: true });

        if (timelineError) throw new Error(`Timeline: ${timelineError.message}`);

        // Fetch dashboard content sections
        const { data: contentData, error: contentError } = await supabase
          .from('business_hub_dashboard_content')
          .select('*')
          .eq('visible', true)
          .order('display_order', { ascending: true });

        if (contentError) throw new Error(`Content: ${contentError.message}`);

        // Map database format to UI format
        setStatusCards((cardsData || []).map(mapStatusCard));
        setTimeline((timelineData || []).map(mapTimelineEvent));
        setContent((contentData || []).map(mapDashboardContent));
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
