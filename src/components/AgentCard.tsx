import { KingmakerAgent } from '../lib/types';

interface AgentCardProps {
  agent: KingmakerAgent;
}

const statusColors = {
  online: 'border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  working: 'border-[#00d9ff] shadow-[0_0_20px_rgba(0,217,255,0.3)]',
  idle: 'border-[#3d4558]',
  offline: 'border-[#ff3355] shadow-[0_0_20px_rgba(255,51,85,0.3)] opacity-70',
};

const statusDotColors = {
  online: 'bg-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  working: 'bg-[#00d9ff] shadow-[0_0_20px_rgba(0,217,255,0.3)]',
  idle: 'bg-[#7b8599]',
  offline: 'bg-[#ff3355] shadow-[0_0_20px_rgba(255,51,85,0.3)]',
};

const formatNumber = (num?: number): string => {
  if (!num && num !== 0) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function AgentCard({ agent }: AgentCardProps) {
  const isPulsing = agent.status === 'working' || agent.status === 'online';

  return (
    <div
      className={`
        bg-[#1a1f35] rounded-xl p-6 border-2 transition-all duration-250
        hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        ${statusColors[agent.status]}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#f5f7fa]">{agent.service_name}</h3>
        <div className="flex items-center gap-2">
          <div
            className={`
              w-3 h-3 rounded-full
              ${statusDotColors[agent.status]}
              ${isPulsing ? 'animate-pulse' : ''}
            `}
          />
          <span className="text-sm text-[#c8d0dd] capitalize">{agent.status}</span>
        </div>
      </div>

      {/* Current Task */}
      {agent.current_task && (
        <div className="mb-4 p-2 bg-[#252b45] rounded text-sm text-[#c8d0dd] truncate">
          {agent.current_task}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">
            Response Time
          </div>
          <div className="text-lg font-mono font-bold text-[#f5f7fa]">
            {agent.response_time_ms || 0}ms
          </div>
        </div>
        <div>
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">
            Success Rate
          </div>
          <div className="text-lg font-mono font-bold text-[#f5f7fa]">
            {agent.success_rate || 0}%
          </div>
        </div>
        <div>
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">
            API Calls Today
          </div>
          <div className="text-lg font-mono font-bold text-[#f5f7fa]">
            {formatNumber(agent.api_calls_today || 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-1">
            Total Calls
          </div>
          <div className="text-lg font-mono font-bold text-[#f5f7fa]">
            {formatNumber(agent.total_api_calls || 0)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[#3d4558]">
        <div className="text-xs text-[#7b8599]">
          Last updated: {new Date(agent.last_updated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
