import { useEffect, useRef } from 'react';
import { ChatMessage } from '../../pages/ChatPage';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
}

const MessageList = ({ messages, loading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Start the conversation by sending a message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-4">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const isFirstInGroup = !prevMessage || 
            prevMessage.sender_id !== message.sender_id ||
            new Date(message.sent_at).getTime() - new Date(prevMessage.sent_at).getTime() > 300000; // 5 minutes

          return (
            <MessageItem
              key={message.id}
              message={message}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={true} // Simplified for now
            />
          );
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;