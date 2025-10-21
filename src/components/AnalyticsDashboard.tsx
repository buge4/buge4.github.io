import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SystemMetrics, KingmakerAgent } from '../lib/types';

interface AnalyticsDashboardProps {
  metrics: SystemMetrics;
}

interface Operation {
  id: string;
  operation_type: string;
  agent_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  success_rate: number;
  metadata: {
    duration_ms: number;
    tokens_used: number;
  };
}

interface Project {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  metadata: {
    operations_count?: number;
  };
}

export default function AnalyticsDashboard({ metrics }: AnalyticsDashboardProps) {
  const [agents, setAgents] = useState<KingmakerAgent[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
    
    // Subscribe to real-time updates
    const agentsChannel = supabase
      .channel('agents_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kingmaker_agents' },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    const operationsChannel = supabase
      .channel('operations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kingmaker_operations' },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kingmaker_projects' },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(agentsChannel);
      supabase.removeChannel(operationsChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch agents
      const { data: agentsData, error: agentsError } = await supabase
        .from('kingmaker_agents')
        .select('*');

      if (agentsError) throw agentsError;

      // Fetch operations from last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: operationsData, error: operationsError } = await supabase
        .from('kingmaker_operations')
        .select('*')
        .gte('started_at', twentyFourHoursAgo.toISOString())
        .order('started_at', { ascending: false });

      if (operationsError) throw operationsError;

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('kingmaker_projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (projectsError) throw projectsError;

      setAgents(agentsData || []);
      setOperations(operationsData || []);
      setProjects(projectsData || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from real data
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'online').length;
  const totalOperations = operations.length;
  const completedOperations = operations.filter(op => op.status === 'completed').length;
  const avgSuccessRate = operations.length > 0
    ? operations.reduce((sum, op) => sum + (op.success_rate || 0), 0) / operations.length
    : 0;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  
  // Calculate average response time
  const avgResponseTime = operations.length > 0
    ? operations.reduce((sum, op) => sum + (op.metadata?.duration_ms || 0), 0) / operations.length
    : 0;

  // Calculate total tokens used
  const totalTokens = operations.reduce((sum, op) => sum + (op.metadata?.tokens_used || 0), 0);

  // Calculate uptime (percentage of agents that are active)
  const uptime = totalAgents > 0 ? (activeAgents / totalAgents) * 100 : 0;

  // Calculate error rate
  const failedOperations = operations.filter(op => op.status === 'failed').length;
  const errorRate = totalOperations > 0 ? (failedOperations / totalOperations) * 100 : 0;

  // Calculate throughput (operations per hour in last 24h)
  const throughput = operations.length > 0 ? (operations.length / 24).toFixed(1) : '0';

  const metricCards = [
    {
      label: 'Active Agents',
      value: `${activeAgents}/${totalAgents}`,
      trend: `${uptime.toFixed(1)}%`,
      isPositive: uptime >= 80,
    },
    {
      label: 'Operations (24h)',
      value: totalOperations.toString(),
      trend: `${completedOperations} completed`,
      isPositive: completedOperations > 0,
    },
    {
      label: 'Success Rate',
      value: `${avgSuccessRate.toFixed(1)}%`,
      trend: failedOperations > 0 ? `${failedOperations} failed` : 'All successful',
      isPositive: avgSuccessRate >= 90,
    },
    {
      label: 'Active Projects',
      value: `${activeProjects}/${totalProjects}`,
      trend: `${((activeProjects / Math.max(totalProjects, 1)) * 100).toFixed(0)}%`,
      isPositive: activeProjects > 0,
    },
  ];

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-[#00ff88]';
    if (health >= 70) return 'text-[#00d9ff]';
    if (health >= 50) return 'text-[#ff9500]';
    return 'text-[#ff3355]';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-[#1a1f35] rounded-xl p-8 border border-[#3d4558] text-center">
          <div className="animate-pulse">
            <div className="text-[#00d9ff] text-lg">Loading analytics data...</div>
            <div className="text-[#7b8599] text-sm mt-2">Fetching real-time metrics from Supabase</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-[#1a1f35] rounded-xl p-8 border border-[#ff3355] text-center">
          <div className="text-[#ff3355] text-lg mb-2">Error loading analytics</div>
          <div className="text-[#7b8599] text-sm">{error}</div>
          <button
            onClick={fetchAllData}
            className="mt-4 px-4 py-2 bg-[#00d9ff] text-[#0a0e1a] rounded-lg hover:bg-[#00b8d4] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricCards.map((metric, idx) => (
          <div
            key={idx}
            className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]"
          >
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              {metric.label}
            </div>
            <div className="text-2xl font-mono font-bold text-[#f5f7fa] mb-1">
              {metric.value}
            </div>
            <div
              className={`text-sm flex items-center gap-1 ${
                metric.isPositive ? 'text-[#00ff88]' : 'text-[#ff3355]'
              }`}
            >
              <span>{metric.isPositive ? '↑' : '↓'}</span>
              <span>{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
          <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
            Recent Operations (24h)
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {operations.slice(0, 10).map((op) => {
              const agent = agents.find(a => a.id === op.agent_id);
              return (
                <div key={op.id} className="bg-[#0a0e1a] rounded-lg p-3 border border-[#3d4558]">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-[#f5f7fa]">
                        {op.operation_type}
                      </div>
                      <div className="text-xs text-[#7b8599]">
                        {agent?.service_name || 'Unknown Agent'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${
                        op.status === 'completed' ? 'text-[#00ff88]' : 
                        op.status === 'failed' ? 'text-[#ff3355]' : 'text-[#ff9500]'
                      }`}>
                        {op.status}
                      </div>
                      <div className="text-xs text-[#7b8599]">
                        {op.metadata?.duration_ms || 0}ms
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {operations.length === 0 && (
              <div className="text-center text-[#7b8599] py-8">
                No operations in the last 24 hours
              </div>
            )}
          </div>
        </div>

        {/* Agent Distribution */}
        <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
          <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
            Agent Status Distribution
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Active', count: agents.filter(a => a.status === 'active' || a.status === 'online').length, color: 'bg-[#00ff88]' },
              { label: 'Working', count: agents.filter(a => a.status === 'working').length, color: 'bg-[#00d9ff]' },
              { label: 'Idle', count: agents.filter(a => a.status === 'idle').length, color: 'bg-[#ff9500]' },
              { label: 'Offline', count: agents.filter(a => a.status === 'offline').length, color: 'bg-[#7b8599]' },
            ].map(status => {
              const percentage = totalAgents > 0 ? (status.count / totalAgents) * 100 : 0;
              return (
                <div key={status.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#c8d0dd]">{status.label}</span>
                    <span className="text-[#f5f7fa] font-mono">{status.count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-[#0a0e1a] rounded-full h-2">
                    <div
                      className={`${status.color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {totalAgents === 0 && (
              <div className="text-center text-[#7b8599] py-8">
                No agents found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
        <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
          Performance Summary (24h)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              System Uptime
            </div>
            <div className={`text-3xl font-mono font-bold ${getHealthColor(uptime)}`}>
              {uptime.toFixed(1)}%
            </div>
            <div className="text-xs text-[#7b8599] mt-1">
              {activeAgents}/{totalAgents} agents active
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Avg Response Time
            </div>
            <div className={`text-3xl font-mono font-bold ${avgResponseTime < 1000 ? 'text-[#00ff88]' : avgResponseTime < 3000 ? 'text-[#ff9500]' : 'text-[#ff3355]'}`}>
              {avgResponseTime.toFixed(0)}ms
            </div>
            <div className="text-xs text-[#7b8599] mt-1">
              {totalOperations} operations
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Error Rate
            </div>
            <div className={`text-3xl font-mono font-bold ${errorRate < 5 ? 'text-[#00ff88]' : errorRate < 15 ? 'text-[#ff9500]' : 'text-[#ff3355]'}`}>
              {errorRate.toFixed(1)}%
            </div>
            <div className="text-xs text-[#7b8599] mt-1">
              {failedOperations} failed
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Throughput
            </div>
            <div className="text-3xl font-mono font-bold text-[#00d9ff]">
              {throughput}/h
            </div>
            <div className="text-xs text-[#7b8599] mt-1">
              {totalTokens.toLocaleString()} tokens
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
