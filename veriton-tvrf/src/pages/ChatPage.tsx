import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AuthGuard from '../components/AuthGuard';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import EmployeeDirectory from '../components/chat/EmployeeDirectory';

export interface ChatChannel {
  id: string;
  name: string;
  type: 'dm' | 'group';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  edited_at?: string;
  is_deleted: boolean;
}

export interface Employee {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  access_level: string;
  created_at: string;
  is_active: boolean;
}

export interface UserProfile extends Employee {
  is_online?: boolean;
  last_read_at?: string;
}

const ChatPage = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showEmployeeDirectory, setShowEmployeeDirectory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load user's channels
      await loadChannels();
      
      // Load employees
      await loadEmployees();
      
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChannels = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('channel_members')
      .select(`
        channel_id,
        chat_channels!inner (
          id,
          name,
          type,
          created_by,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading channels:', error);
      return;
    }

    const channelData = data?.map(item => item.chat_channels) || [];
    setChannels(channelData);
    
    // Set the first channel as active if none selected
    if (!activeChannel && channelData.length > 0) {
      setActiveChannel(channelData[0]);
    }
  };

  const loadEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('is_active', true)
      .order('full_name');

    if (error) {
      console.error('Error loading employees:', error);
      return;
    }

    setEmployees(data || []);
  };

  const handleChannelSelect = (channel: ChatChannel) => {
    setActiveChannel(channel);
    setShowEmployeeDirectory(false);
  };

  const handleShowEmployeeDirectory = () => {
    setShowEmployeeDirectory(true);
    setActiveChannel(null);
  };

  const handleBackToChat = () => {
    setShowEmployeeDirectory(false);
    if (channels.length > 0) {
      setActiveChannel(channels[0]);
    }
  };

  const handleStartDirectMessage = (employee: Employee) => {
    // TODO: Implement direct message creation
    console.log('Starting DM with:', employee);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <ChatSidebar
          channels={channels}
          activeChannel={activeChannel}
          onChannelSelect={handleChannelSelect}
          onShowEmployeeDirectory={handleShowEmployeeDirectory}
          showEmployeeDirectory={showEmployeeDirectory}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showEmployeeDirectory ? (
          <EmployeeDirectory
            employees={employees}
            onBack={handleBackToChat}
            onStartDirectMessage={handleStartDirectMessage}
          />
        ) : activeChannel ? (
          <ChatWindow
            channel={activeChannel}
            onBack={handleBackToChat}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to the Chat
              </h3>
              <p className="text-gray-500 mb-4">
                Select a channel to start messaging
              </p>
              <button
                onClick={handleShowEmployeeDirectory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Employee Directory
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
};

export default ChatPage;