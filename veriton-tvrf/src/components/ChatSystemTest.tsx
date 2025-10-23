import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { seedChatData, createDirectMessageChannel } from '../lib/chatHelpers';

const ChatSystemTest = () => {
  const { user, signIn, signOut } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');

  const handleTestSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(testEmail, testPassword);
    if (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSeedData = async () => {
    await seedChatData();
    alert('Chat data seeded! Check your Supabase dashboard.');
  };

  const handleCreateDM = async () => {
    if (!user) return;
    
    // This is a placeholder - you'd need a second user ID
    const otherUserId = '00000000-0000-0000-0000-000000000000';
    const channel = await createDirectMessageChannel(user.id, otherUserId);
    
    if (channel) {
      alert(`Created DM channel: ${channel.id}`);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Test Chat System</h2>
        <form onSubmit={handleTestSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Chat System Test</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Signed in as: {user.email}
          </span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Database Setup</h3>
          <p className="text-gray-600 mb-4">
            Before using the chat system, ensure your Supabase database has the required tables:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>chat_channels</li>
            <li>chat_messages</li>
            <li>chat_channel_members</li>
            <li>employees</li>
          </ul>
        </div>

        <div>
          <button
            onClick={handleSeedData}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mr-4"
          >
            Seed Test Data
          </button>
          <button
            onClick={handleCreateDM}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Test DM Channel
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Navigation</h3>
          <p className="text-gray-600 mb-2">
            You can now navigate to the chat system:
          </p>
          <div className="flex gap-4">
            <a
              href="/chat"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Go to Chat
            </a>
            <a
              href="/"
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Back to Home
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Database Connection</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Supabase URL:</strong> {supabase.supabaseUrl}
            </p>
            <p className="text-sm text-gray-700">
              <strong>User ID:</strong> {user.id}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Status:</strong> Connected ✅
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSystemTest;