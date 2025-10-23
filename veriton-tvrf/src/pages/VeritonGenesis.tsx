import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AgentCard from '../components/AgentCard';
import CommandTerminal from '../components/CommandTerminal';
import ProjectPipeline from '../components/ProjectPipeline';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { db } from '../lib/firebase';
import { collection, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { KingmakerAgent, KingmakerProject, SystemMetrics } from '../lib/types';

export default function VeritonGenesis() {
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
    const agentsQuery = collection(db, 'kingmaker_agents');
    const unsubscribe = onSnapshot(agentsQuery, (snapshot) => {
      fetchAgents();
    }, (error) => {
      console.error('Error in agent subscription:', error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Subscribe to real-time project updates
  useEffect(() => {
    const projectsQuery = collection(db, 'kingmaker_projects');
    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      fetchProjects();
    }, (error) => {
      console.error('Error in project subscription:', error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchAgents = async () => {
    try {
      const agentsQuery = query(
        collection(db, 'kingmaker_agents'),
        orderBy('id', 'asc')
      );
      const querySnapshot = await getDocs(agentsQuery);
      
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as KingmakerAgent[];
        setAgents(data);
      } else {
        // Use mock data if no data exists
        setAgents(getMockAgents());
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      // Use mock data if collection doesn't exist
      setAgents(getMockAgents());
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsQuery = query(
        collection(db, 'kingmaker_projects'),
        orderBy('updated_at', 'desc')
      );
      const querySnapshot = await getDocs(projectsQuery);
      
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as KingmakerProject[];
        setProjects(data);
      } else {
        // Use mock data if no data exists
        setProjects(getMockProjects());
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Use mock data if collection doesn't exist
      setProjects(getMockProjects());
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
            <h1 className="text-4xl font-bold text-[#f5f7fa] mb-2">Veriton Genesis</h1>
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
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
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

// Mock data functions (fallback when Supabase tables are empty or don't exist)
function getMockAgents(): KingmakerAgent[] {
  return [
    {
      id: 1,
      service_name: 'OpenAI',
      status: 'working',
      current_task: 'Generating API documentation',
      response_time_ms: 245,
      success_rate: 98.5,
      api_usage_count: 1547,
      cost_today: 12.45,
      tokens_used: 245780,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      service_name: 'Claude',
      status: 'online',
      current_task: null,
      response_time_ms: 312,
      success_rate: 99.2,
      api_usage_count: 892,
      cost_today: 8.73,
      tokens_used: 187340,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      service_name: 'Gemini',
      status: 'idle',
      current_task: null,
      response_time_ms: 278,
      success_rate: 97.8,
      api_usage_count: 634,
      cost_today: 5.21,
      tokens_used: 134250,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      service_name: 'Minimax',
      status: 'working',
      current_task: 'Video generation pipeline',
      response_time_ms: 523,
      success_rate: 96.4,
      api_usage_count: 423,
      cost_today: 15.87,
      tokens_used: 98760,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ];
}

function getMockProjects(): KingmakerProject[] {
  return [
    {
      id: 1,
      project_name: 'E-commerce Dashboard',
      status: 'building',
      progress_percentage: 67,
      assigned_agents: ['OpenAI', 'Claude'],
      deployment_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    },
    {
      id: 2,
      project_name: 'Analytics Platform',
      status: 'testing',
      progress_percentage: 89,
      assigned_agents: ['Gemini', 'Minimax'],
      deployment_url: 'https://analytics.example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    },
    {
      id: 3,
      project_name: 'Content Generator',
      status: 'deployed',
      progress_percentage: 100,
      assigned_agents: ['OpenAI'],
      deployment_url: 'https://content.example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    },
    {
      id: 4,
      project_name: 'API Gateway',
      status: 'planning',
      progress_percentage: 15,
      assigned_agents: ['Claude', 'Gemini'],
      deployment_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    },
  ];
}
