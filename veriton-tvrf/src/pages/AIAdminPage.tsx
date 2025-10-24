import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AdminAuthGuard from '../components/AdminAuthGuard';
import {
  Shield, Users, Database, BarChart3, MessageSquare, Settings,
  Eye, Lock, UserCheck, Activity, Brain, AlertTriangle,
  Search, Filter, Download, Upload, Trash2, Edit, Plus,
  Bell, TrendingUp, Monitor, Globe, Calendar, Clock
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at: string;
}

interface Employee {
  id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  access_level: string;
  is_active: boolean;
  created_at: string;
}

interface SystemMetrics {
  total_users: number;
  active_users: number;
  total_messages: number;
  today_messages: number;
  total_employees: number;
  system_uptime: string;
}

interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  is_deleted: boolean;
  sender_email?: string;
  channel_name?: string;
}

function AIAdminPageComponent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    total_users: 0,
    active_users: 0,
    total_messages: 0,
    today_messages: 0,
    total_employees: 0,
    system_uptime: '0h'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [adminCommand, setAdminCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      checkAdminAccess();
      loadSystemData();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (!userRole || !['ai_admin', 'super_admin'].includes(userRole.role)) {
        alert('Access denied. AI Admin privileges required.');
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const loadSystemData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadEmployees(),
        loadMessages(),
        loadSystemMetrics()
      ]);
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('auth.users')
      .select('id, email, created_at, last_sign_in_at, email_confirmed_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
  };

  const loadEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEmployees(data);
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        auth.users!chat_messages_sender_id_fkey(email),
        chat_channels!inner(name)
      `)
      .order('sent_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        channel_id: msg.channel_id,
        sender_id: msg.sender_id,
        content: msg.content,
        sent_at: msg.sent_at,
        is_deleted: false
      }));
      setMessages(formattedMessages);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-system-metrics');
      
      if (!error && data) {
        setSystemMetrics(data);
      }
    } catch (error) {
      console.error('Error loading system metrics:', error);
    }
  };

  const handleUserRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
      
      alert('User role updated successfully');
      loadSystemData();
    } catch (error: any) {
      alert('Error updating user role: ' + error.message);
    }
  };

  const handleEmployeeUpdate = async (employeeId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', employeeId);

      if (error) throw error;
      
      alert('Employee updated successfully');
      loadEmployees();
    } catch (error: any) {
      alert('Error updating employee: ' + error.message);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (confirm('Are you sure you want to delete these users?')) {
            for (const userId of selectedUsers) {
              await supabase.from('user_roles').delete().eq('user_id', userId);
              await supabase.from('auth.users').delete().eq('id', userId);
            }
            alert('Users deleted successfully');
          }
          break;
        case 'activate':
          for (const userId of selectedUsers) {
            await handleUserRoleUpdate(userId, 'authenticated');
          }
          break;
        case 'deactivate':
          for (const userId of selectedUsers) {
            await handleUserRoleUpdate(userId, 'basic_user');
          }
          break;
      }
      setSelectedUsers([]);
      loadSystemData();
    } catch (error: any) {
      alert('Error performing bulk action: ' + error.message);
    }
  };

  const handleAICommand = async () => {
    if (!adminCommand.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('ai-admin-command', {
        body: {
          command: adminCommand,
          userId: user?.id,
          context: {
            activeTab,
            selectedUsers,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) throw error;

      setCommandHistory(prev => [...prev, {
        command: adminCommand,
        response: data?.response || 'Command executed successfully',
        timestamp: new Date().toISOString(),
        success: true
      }]);

      setAdminCommand('');
      
      // Refresh relevant data based on command
      if (data?.shouldRefresh) {
        loadSystemData();
      }
    } catch (error: any) {
      setCommandHistory(prev => [...prev, {
        command: adminCommand,
        response: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        success: false
      }]);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Administrator</h1>
                <p className="text-sm text-gray-600">Advanced System Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Dashboard
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'employees', label: 'Employee Management', icon: UserCheck },
              { id: 'messages', label: 'Message Monitor', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'ai-config', label: 'AI Configuration', icon: Brain },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Command Interface */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Administrator Command Interface
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={adminCommand}
              onChange={(e) => setAdminCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAICommand()}
              placeholder="Enter AI admin command (e.g., 'Show system statistics', 'Manage user roles')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAICommand}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Execute
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemMetrics.total_users}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{systemMetrics.active_users}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{systemMetrics.total_messages}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{systemMetrics.total_employees}</p>
                </div>
                <UserCheck className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Activate Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Deactivate Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input type="checkbox" onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Sign In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">User</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleUserRoleUpdate(user.id, 'ai_admin')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() => handleUserRoleUpdate(user.id, 'super_admin')}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Make Super Admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Employee Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Access Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.access_level}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEmployeeUpdate(employee.id, { is_active: !employee.is_active })}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {employee.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Message Monitoring</h3>
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <tr key={message.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{message.sender_email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{message.channel_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                        {message.content}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(message.sent_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          message.is_deleted
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {message.is_deleted ? 'Deleted' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ai-config' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Assistant Configuration</h3>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">AI Response Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Response Confidence Threshold</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.8"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Auto-approve Actions</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="none">None</option>
                      <option value="minor">Minor Changes Only</option>
                      <option value="moderate">Moderate Changes</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">System Monitoring</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Real-time Analytics</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Automated Reports</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Anomaly Detection</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Command History Sidebar */}
      {commandHistory.length > 0 && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Commands</h3>
          </div>
          <div className="p-4 space-y-3">
            {commandHistory.slice(-5).map((cmd, index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <p className="text-sm font-medium text-gray-900">{cmd.command}</p>
                <p className={`text-xs mt-1 ${cmd.success ? 'text-green-600' : 'text-red-600'}`}>
                  {cmd.response}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(cmd.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIAdminPage() {
  return (
    <AdminAuthGuard requiredRole="ai_admin">
      <AIAdminPageComponent />
    </AdminAuthGuard>
  );
}