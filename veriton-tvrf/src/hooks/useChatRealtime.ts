import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface OnlineUser {
  user_id: string;
  is_online: boolean;
  last_seen: string;
}

export const useChatRealtime = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to online status changes
    const subscription = supabase
      .channel('online_users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channel_members',
        },
        (payload) => {
          // Handle online status updates
          console.log('Online status changed:', payload);
        }
      )
      .subscribe();

    // Set user as online when they connect
    const setUserOnline = async () => {
      // This would require updating the channel_members table
      // For now, we'll just log the action
      console.log('User is now online:', user.id);
    };

    setUserOnline();

    // Set user as offline when they disconnect
    const handleBeforeUnload = () => {
      console.log('User is now offline:', user.id);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    onlineUsers,
  };
};

export const useChannelSubscription = (channelId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId) return;

    // Load initial messages
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', channelId)
        .eq('is_deleted', false)
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat_messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as any]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new as any : msg))
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [channelId]);

  return { messages, loading };
};