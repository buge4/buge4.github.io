import { useState, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ChatChannel, ChatMessage } from '../../pages/ChatPage';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import AIAssistant from './AIAssistant';

interface ChatWindowProps {
  channel: ChatChannel;
  onBack: () => void;
}

const ChatWindow = ({ channel, onBack }: ChatWindowProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (channel) {
      loadMessages();
      subscribeToMessages();
    }
  }, [channel]);

  const loadMessages = async () => {
    if (!channel) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', channel.id)
        .eq('is_deleted', false)
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!channel) return;

    const subscription = supabase
      .channel(`chat_messages:${channel.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${channel.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !channel || sendingMessage) return;

    try {
      setSendingMessage(true);
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          channel_id: channel.id,
          sender_id: user.id,
          content,
        });

      if (error) {
        console.error('Error sending message:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatChannelName = (channel: ChatChannel) => {
    if (channel.type === 'dm') {
      // For DMs, we could show the other participant's name
      return `Direct Message`;
    }
    return `#${channel.name}`;
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {channel.type === 'dm' ? (
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  DM
                </div>
              ) : (
                <div className="h-8 w-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  #
                </div>
              )}
              <h1 className="text-lg font-semibold text-gray-900">
                {formatChannelName(channel)}
              </h1>
            </div>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} loading={loading} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={sendingMessage}
          placeholder={`Message ${formatChannelName(channel)}`}
        />
      </div>

      {/* AI Assistant */}
      <AIAssistant channelContext={`Chat channel: ${formatChannelName(channel)}`} />
    </div>
  );
};

export default ChatWindow;