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

  // Real metrics would be fetched from actual system data
  const metricCards: { label: string; value: string; trend: string; isPositive: boolean }[] = [];

  return (
    <div className="space-y-6">
      {/* System Metrics Grid */}
      {metricCards.length > 0 ? (
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
      ) : (
        <div className="bg-[#1a1f35] rounded-xl p-8 border border-[#3d4558] text-center">
          <p className="text-[#7b8599]">No metrics data available. Connect real analytics service to populate metrics.</p>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart Placeholder */}
        <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
          <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
            Request Activity
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-[#7b8599]">No activity data available</p>
          </div>
        </div>

        {/* Agent Distribution */}
        <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
          <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">
            Agent Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-[#7b8599]">No agent distribution data available</p>
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
            <div className="text-3xl font-mono font-bold text-[#7b8599]">
              -
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Avg Latency
            </div>
            <div className="text-3xl font-mono font-bold text-[#7b8599]">
              -
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Error Rate
            </div>
            <div className="text-3xl font-mono font-bold text-[#7b8599]">
              -
            </div>
          </div>
          <div>
            <div className="text-xs text-[#c8d0dd] uppercase tracking-wide mb-2">
              Throughput
            </div>
            <div className="text-3xl font-mono font-bold text-[#7b8599]">
              -
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
