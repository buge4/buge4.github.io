import { MessageSquare, Users, Hash, User } from 'lucide-react';
import { ChatChannel } from '../../pages/ChatPage';

interface ChatSidebarProps {
  channels: ChatChannel[];
  activeChannel: ChatChannel | null;
  onChannelSelect: (channel: ChatChannel) => void;
  onShowEmployeeDirectory: () => void;
  showEmployeeDirectory: boolean;
}

const ChatSidebar = ({
  channels,
  activeChannel,
  onChannelSelect,
  onShowEmployeeDirectory,
  showEmployeeDirectory,
}: ChatSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Navigation */}
      <div className="px-4 py-2 border-b border-gray-200">
        <button
          onClick={onShowEmployeeDirectory}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            showEmployeeDirectory
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Employee Directory</span>
        </button>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Channels
          </h3>
          <div className="space-y-1">
            {channels.length > 0 ? (
              channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeChannel?.id === channel.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {channel.type === 'dm' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Hash className="h-5 w-5" />
                  )}
                  <span className="truncate">{channel.name}</span>
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No channels yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <MessageSquare className="h-4 w-4 inline mr-1" />
          Veriton Chat System
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;