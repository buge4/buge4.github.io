import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BarChart3, FileText, PlusCircle, Users, Database, Send, Sparkles } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId] = useState(crypto.randomUUID());

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      setUser(data.user);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  }

  async function sendCommand() {
    if (!message.trim() || !user) return;

    const userMessage = message;
    setMessage('');
    setIsProcessing(true);

    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-admin-command', {
        body: {
          command: userMessage,
          userId: user.id,
          sessionId
        }
      });

      if (error) throw error;

      const aiResponse = data?.data || data;
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse.response || 'Command processed successfully',
        action: aiResponse.action,
        confidence: aiResponse.confidence
      }]);
    } catch (error: any) {
      setChatMessages(prev => [...prev, { 
        role: 'error', 
        content: `Error: ${error.message}` 
      }]);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleQuickAction(action: string) {
    let command = '';
    switch (action) {
      case 'statistics':
        command = 'Show me website statistics and analytics';
        break;
      case 'new_post':
        command = 'Help me create a new blog post about TVRF technology';
        break;
      case 'new_page':
        command = 'Create a new page for developer documentation';
        break;
      case 'users':
        command = 'Show me user analytics and engagement metrics';
        break;
      case 'backup':
        command = 'Create a backup of all website content';
        break;
    }
    setMessage(command);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Administrator</h1>
            <p className="text-gray-600">Sign in to manage your website with AI</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="admin@veriton.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">AI Administrator</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{user.email}</span>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition"
              >
                View Website
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                <h2 className="text-2xl font-bold text-white">AI Chat Interface</h2>
                <p className="text-purple-100 mt-1">Manage your website with natural language commands</p>
              </div>

              <div className="h-96 overflow-y-auto p-6 bg-gray-50">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                    <p>Start a conversation with your AI Administrator</p>
                    <p className="text-sm mt-2">Try: "Update the hero section title" or "Show analytics"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-lg px-4 py-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-purple-600 text-white'
                              : msg.role === 'error'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-white shadow-md text-gray-900'
                          }`}
                        >
                          <p>{msg.content}</p>
                          {msg.action && (
                            <p className="text-xs mt-2 opacity-75">Action: {msg.action}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isProcessing && sendCommand()}
                    placeholder="Type your command... (e.g., 'Update hero section title')"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isProcessing}
                  />
                  <button
                    onClick={sendCommand}
                    disabled={isProcessing || !message.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleQuickAction('statistics')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition text-left"
                >
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">View Statistics</span>
                </button>
                <button
                  onClick={() => handleQuickAction('new_post')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition text-left"
                >
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">New Blog Post</span>
                </button>
                <button
                  onClick={() => handleQuickAction('new_page')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition text-left"
                >
                  <PlusCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">New Page</span>
                </button>
                <button
                  onClick={() => handleQuickAction('users')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition text-left"
                >
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">User Analytics</span>
                </button>
                <button
                  onClick={() => handleQuickAction('backup')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition text-left"
                >
                  <Database className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">Create Backup</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">AI Commands</h3>
              <p className="text-sm text-purple-100 mb-4">
                Use natural language to manage your website
              </p>
              <ul className="text-sm space-y-2 text-purple-100">
                <li>"Update the hero section title to [text]"</li>
                <li>"Change statistics in section 6"</li>
                <li>"Edit the comparison table"</li>
                <li>"Show me website analytics"</li>
                <li>"Generate new content for [section]"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
