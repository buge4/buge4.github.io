import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AgentCard from '../components/AgentCard';
import CommandTerminal from '../components/CommandTerminal';
import ProjectPipeline from '../components/ProjectPipeline';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { supabase } from '../lib/supabase';
import { KingmakerAgent, KingmakerProject, SystemMetrics } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';

export default function VeritonGenesis() {
  const { user, signOut } = useAuth();
  const [agents, setAgents] = useState<KingmakerAgent[]>([]);
  const [projects, setProjects] = useState<KingmakerProject[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    engines_online: 0,
    active_projects: 0,
    consensus_rate: 0,
    system_health: 0,
  });

  // Fetch initial data
  useEffect(() => {
    fetchAgents();
    fetchProjects();
  }, []);

  // Calculate system metrics when agents or projects change
  useEffect(() => {
    const enginesOnline = agents.filter(
      (a) => a.status === 'online' || a.status === 'working'
    ).length;
    const activeProjects = projects.filter(
      (p) => p.status === 'building' || p.status === 'testing'
    ).length;
    const avgSuccessRate =
      agents.length > 0
        ? agents.reduce((sum, a) => sum + a.success_rate, 0) / agents.length
        : 0;
    const health = enginesOnline === agents.length ? 100 : (enginesOnline / agents.length) * 100;

    setSystemMetrics({
      engines_online: enginesOnline,
      active_projects: activeProjects,
      consensus_rate: Math.round(avgSuccessRate),
      system_health: Math.round(health),
    });
  }, [agents, projects]);

  // Subscribe to real-time agent updates
  useEffect(() => {
    const channel = supabase
      .channel('kingmaker_agents_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kingmaker_agents' },
        () => {
          fetchAgents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Subscribe to real-time project updates
  useEffect(() => {
    const channel = supabase
      .channel('kingmaker_projects_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kingmaker_projects' },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('kingmaker_agents')
        .select('*')
        .order('service_name', { ascending: true });

      if (error) {
        console.error('Error fetching agents:', error);
        return;
      }

      if (data && data.length > 0) {
        setAgents(data as KingmakerAgent[]);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('kingmaker_projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      if (data && data.length > 0) {
        setProjects(data as KingmakerProject[]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-[#00ff88]';
    if (health >= 70) return 'text-[#00d9ff]';
    if (health >= 50) return 'text-[#ff9500]';
    return 'text-[#ff3355]';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e1a]">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-[#f5f7fa]">Veriton Genesis</h1>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-[#c8d0dd]">Signed in as</div>
                  <div className="text-sm font-semibold text-[#00d9ff]">{user?.email}</div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-[#ff3355] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(255,51,85,0.3)] transition-all duration-150"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <p className="text-[#c8d0dd]">
              AI Orchestra Command Center - Real-time Monitoring & Control
            </p>
          </div>

          {/* System Status Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
              <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
                Engines Online
              </div>
              <div className="text-4xl font-mono font-bold text-[#f5f7fa]">
                {systemMetrics.engines_online}/{agents.length || 4}
              </div>
            </div>
            <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
              <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
                Active Projects
              </div>
              <div className="text-4xl font-mono font-bold text-[#00d9ff]">
                {systemMetrics.active_projects}
              </div>
            </div>
            <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
              <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
                Consensus Rate
              </div>
              <div className="text-4xl font-mono font-bold text-[#00ff88]">
                {systemMetrics.consensus_rate}%
              </div>
            </div>
            <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
              <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
                System Health
              </div>
              <div className={`text-4xl font-mono font-bold ${getHealthColor(systemMetrics.system_health)}`}>
                {systemMetrics.system_health}%
              </div>
            </div>
          </div>

          {/* Agent Status Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#f5f7fa] mb-4">AI Agents Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.length > 0 ? (
                agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
              ) : (
                <div className="col-span-full text-center text-[#7b8599] py-8">
                  No AI agents found. Initialize agents in the database.
                </div>
              )}
            </div>
          </div>

          {/* Command Terminal */}
          <div className="mb-8">
            <CommandTerminal />
          </div>

          {/* Project Pipeline */}
          <div className="mb-8">
            <ProjectPipeline projects={projects} />
          </div>

          {/* Analytics Dashboard */}
          <div>
            <h2 className="text-2xl font-semibold text-[#f5f7fa] mb-4">Analytics</h2>
            <AnalyticsDashboard metrics={systemMetrics} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
