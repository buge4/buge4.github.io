import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { KingmakerAgent } from '../lib/types';

interface AgentOperation {
  id: string;
  operation_type: string;
  agent_id: string;
  status: string;
  started_at: string;
  completed_at: string;
  success_rate: number;
  metadata: {
    duration_ms: number;
    tokens_used: number;
  };
}

interface ArmyDashboardProps {
  agents: KingmakerAgent[];
}

export default function ArmyDashboard({ agents }: ArmyDashboardProps) {
  const [operations, setOperations] = useState<AgentOperation[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'working' | 'idle'>('all');

  useEffect(() => {
    fetchOperations();
    
    // Subscribe to real-time operations
    const channel = supabase
      .channel('operations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kingmaker_operations' },
        () => {
          fetchOperations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOperations = async () => {
    try {
      const { data, error } = await supabase
        .from('kingmaker_operations')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching operations:', error);
        return;
      }

      if (data) {
        setOperations(data as AgentOperation[]);
      }
    } catch (error) {
      console.error('Error fetching operations:', error);
    }
  };

  const getAgentById = (agentId: string) => {
    return agents.find(a => a.id === agentId);
  };

  const filteredAgents = agents.filter(agent => {
    if (filter === 'all') return true;
    if (filter === 'online') return agent.status === 'online' || agent.status === 'active';
    return agent.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'bg-[#00ff88]';
      case 'working':
        return 'bg-[#00d9ff]';
      case 'idle':
        return 'bg-[#ff9500]';
      case 'offline':
        return 'bg-[#7b8599]';
      default:
        return 'bg-[#7b8599]';
    }
  };

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'deployment':
        return 'text-[#00ff88]';
      case 'processing':
        return 'text-[#00d9ff]';
      case 'analysis':
        return 'text-[#ff9500]';
      case 'automation':
        return 'text-[#9d4edd]';
      default:
        return 'text-[#c8d0dd]';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const agentStats = {
    total: agents.length,
    online: agents.filter(a => a.status === 'online' || a.status === 'active').length,
    working: agents.filter(a => a.status === 'working').length,
    idle: agents.filter(a => a.status === 'idle').length,
  };

  return (
    <div className="space-y-6">
      {/* Army Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1f35] rounded-xl p-4 border border-[#3d4558]">
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">Total Agents</div>
          <div className="text-3xl font-mono font-bold text-[#f5f7fa]">{agentStats.total}</div>
        </div>
        <div className="bg-[#1a1f35] rounded-xl p-4 border border-[#3d4558]">
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">Online</div>
          <div className="text-3xl font-mono font-bold text-[#00ff88]">{agentStats.online}</div>
        </div>
        <div className="bg-[#1a1f35] rounded-xl p-4 border border-[#3d4558]">
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">Working</div>
          <div className="text-3xl font-mono font-bold text-[#00d9ff]">{agentStats.working}</div>
        </div>
        <div className="bg-[#1a1f35] rounded-xl p-4 border border-[#3d4558]">
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">Operations</div>
          <div className="text-3xl font-mono font-bold text-[#ff9500]">{operations.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1f35] rounded-xl border border-[#3d4558] overflow-hidden">
            <div className="p-6 border-b border-[#3d4558]">
              <h3 className="text-xl font-semibold text-[#f5f7fa] mb-4">AI Army Status</h3>
              <div className="flex gap-2">
                {(['all', 'online', 'working', 'idle'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      filter === status
                        ? 'bg-[#00d9ff] text-[#0a0e1a]'
                        : 'bg-[#2a3142] text-[#c8d0dd] hover:bg-[#3d4558]'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {filteredAgents.length > 0 ? (
                <div className="space-y-3">
                  {filteredAgents.map(agent => (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                      className="bg-[#0a0e1a] rounded-lg p-4 border border-[#3d4558] hover:border-[#00d9ff] cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} animate-pulse`} />
                          <div>
                            <div className="font-semibold text-[#f5f7fa]">{agent.service_name}</div>
                            <div className="text-xs text-[#7b8599]">{agent.model_name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono text-[#00ff88]">{agent.success_rate}%</div>
                          <div className="text-xs text-[#7b8599]">{agent.status}</div>
                        </div>
                      </div>
                      {agent.current_task && (
                        <div className="mt-2 text-sm text-[#c8d0dd] bg-[#1a1f35] rounded px-3 py-2">
                          <span className="text-[#7b8599]">Task:</span> {agent.current_task}
                        </div>
                      )}
                      {selectedAgent === agent.id && (
                        <div className="mt-3 pt-3 border-t border-[#3d4558] grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-[#7b8599]">Response Time</div>
                            <div className="font-mono text-[#f5f7fa]">{agent.response_time_ms}ms</div>
                          </div>
                          <div>
                            <div className="text-[#7b8599]">Calls Today</div>
                            <div className="font-mono text-[#f5f7fa]">{agent.api_calls_today}</div>
                          </div>
                          <div>
                            <div className="text-[#7b8599]">Total Calls</div>
                            <div className="font-mono text-[#f5f7fa]">{agent.total_api_calls}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[#7b8599] py-8">
                  No agents match the selected filter.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1f35] rounded-xl border border-[#3d4558] overflow-hidden">
            <div className="p-6 border-b border-[#3d4558]">
              <h3 className="text-xl font-semibold text-[#f5f7fa]">Live Activity Feed</h3>
              <p className="text-xs text-[#7b8599] mt-1">Real-time operations</p>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {operations.length > 0 ? (
                <div className="space-y-3">
                  {operations.map(op => {
                    const agent = getAgentById(op.agent_id);
                    return (
                      <div
                        key={op.id}
                        className="bg-[#0a0e1a] rounded-lg p-3 border border-[#3d4558]"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className={`text-sm font-semibold ${getOperationColor(op.operation_type)}`}>
                            {op.operation_type.toUpperCase()}
                          </div>
                          <div className="text-xs text-[#7b8599]">
                            {formatTimestamp(op.started_at)}
                          </div>
                        </div>
                        <div className="text-xs text-[#c8d0dd] mb-2">
                          {agent?.service_name || 'Unknown Agent'}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-[#7b8599]">
                            {op.metadata?.duration_ms}ms | {op.metadata?.tokens_used} tokens
                          </div>
                          <div className="text-[#00ff88]">
                            {op.success_rate?.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-[#7b8599] py-8">
                  No recent operations.
                  <div className="text-xs mt-2">Activity will appear here in real-time.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
