import { SystemMetrics } from '../lib/types';

interface AnalyticsDashboardProps {
  metrics: SystemMetrics;
}

export default function AnalyticsDashboard({ metrics }: AnalyticsDashboardProps) {
  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-[#00ff88]';
    if (health >= 70) return 'text-[#00d9ff]';
    if (health >= 50) return 'text-[#ff9500]';
    return 'text-[#ff3355]';
  };

  const metricCards = [
    {
      label: 'Total Requests',
      value: '12,547',
      trend: '+12.5%',
      isPositive: true,
    },
    {
      label: 'Avg Response Time',
      value: '245ms',
      trend: '-8.3%',
      isPositive: true,
    },
    {
      label: 'Success Rate',
      value: '98.4%',
      trend: '+2.1%',
      isPositive: true,
    },
    {
      label: 'Total Cost',
      value: '$127.43',
      trend: '+15.2%',
      isPositive: false,
    },
  ];

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
        {/* Activity Chart Placeholder */}
        <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
          <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
            Request Activity
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 82, 71, 93, 78, 88, 95, 72, 85, 90, 77, 84].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end">
                <div
                  className="bg-gradient-to-t from-[#00d9ff] to-[#00ff88] rounded-t transition-all duration-350 hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-[#7b8599]">
            <span>12h ago</span>
            <span>Now</span>
          </div>
        </div>

        {/* Agent Distribution */}
        <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
          <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
            Agent Distribution
          </h3>
          <div className="space-y-4">
            {[
              { name: 'OpenAI', percentage: 35, color: '#00d9ff' },
              { name: 'Claude', percentage: 28, color: '#ff9500' },
              { name: 'Gemini', percentage: 22, color: '#00ff88' },
              { name: 'Minimax', percentage: 15, color: '#ff3355' },
            ].map((agent, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#c8d0dd]">{agent.name}</span>
                  <span className="text-sm font-mono text-[#f5f7fa]">
                    {agent.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-[#252b45] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-350"
                    style={{
                      width: `${agent.percentage}%`,
                      backgroundColor: agent.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
        <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Uptime
            </div>
            <div className="text-3xl font-mono font-bold text-[#00ff88]">
              99.9%
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Avg Latency
            </div>
            <div className="text-3xl font-mono font-bold text-[#00d9ff]">
              248ms
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Error Rate
            </div>
            <div className="text-3xl font-mono font-bold text-[#ff9500]">
              0.3%
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Throughput
            </div>
            <div className="text-3xl font-mono font-bold text-[#f5f7fa]">
              847/s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
