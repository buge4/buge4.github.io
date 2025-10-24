export interface WebsiteSection {
  id: number;
  section_name: string;
  title: string;
  content: string;
  order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: number;
  section_id: number;
  type: string;
  content: any;
  order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  full_name: string;
  active: boolean;
  last_login: string;
}

export interface AIConversation {
  id: number;
  user_id: number;
  session_id: string;
  message: string;
  response: string;
  intent: string;
  confidence: number;
  tokens_used: number;
  response_time_ms: number;
  timestamp: string;
}

// Kingmaker Army types
export type AgentStatus = 'online' | 'working' | 'idle' | 'offline';

export interface KingmakerAgent {
  id: string;
  service_name: string;
  model_name?: string;
  status: AgentStatus;
  current_task: string | null;
  response_time_ms: number;
  success_rate: number;
  api_calls_today?: number;
  total_api_calls?: number;
  last_updated: string;
  api_usage_count?: number;
  cost_today?: number;
  tokens_used?: number;
  created_at?: string;
}

export type ProjectStatus = 'planning' | 'building' | 'testing' | 'deployed' | 'failed';

export interface KingmakerProject {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  progress_percentage: number;
  assigned_agents: string[];
  deployment_url: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export interface KingmakerConversation {
  id: string;
  project_id: string | null;
  user_message: string;
  ai_response: string | null;
  agent_used: string | null;
  created_at: string;
}

export interface SystemMetrics {
  engines_online: number;
  active_projects: number;
  consensus_rate: number;
  system_health: number;
}
