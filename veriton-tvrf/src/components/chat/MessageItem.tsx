import { useState, useEffect } from 'react';
import { ChatMessage } from '../../pages/ChatPage';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface MessageItemProps {
  message: ChatMessage;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

interface EmployeeProfile {
  full_name: string;
  email: string;
}

const MessageItem = ({ message, isFirstInGroup }: MessageItemProps) => {
  const [senderProfile, setSenderProfile] = useState<EmployeeProfile | null>(null);

  useEffect(() => {
    loadSenderProfile();
  }, [message.sender_id]);

  const loadSenderProfile = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('full_name, email')
      .eq('user_id', message.sender_id)
      .single();

    if (error) {
      console.error('Error loading sender profile:', error);
      return;
    }

    setSenderProfile(data);
  };

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-3 group">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isFirstInGroup ? (
          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {senderProfile ? getInitials(senderProfile.full_name) : 'U'}
          </div>
        ) : (
          <div className="h-8 w-8"></div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {isFirstInGroup && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {senderProfile?.full_name || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(message.sent_at)}
            </span>
          </div>
        )}
        
        <div className="text-sm text-gray-700 break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;