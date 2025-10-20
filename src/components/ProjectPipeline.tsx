import { KingmakerProject } from '../lib/types';

interface ProjectPipelineProps {
  projects: KingmakerProject[];
}

const statusConfig = {
  planning: {
    bg: 'bg-[#7b8599]',
    text: 'text-[#f5f7fa]',
    label: 'Planning',
    glow: '',
  },
  building: {
    bg: 'bg-[#00d9ff]',
    text: 'text-white',
    label: 'Building',
    glow: 'shadow-[0_0_20px_rgba(0,217,255,0.3)]',
  },
  testing: {
    bg: 'bg-[#ff9500]',
    text: 'text-white',
    label: 'Testing',
    glow: '',
  },
  deployed: {
    bg: 'bg-[#00ff88]',
    text: 'text-[#0a0e1a]',
    label: 'Deployed',
    glow: '',
  },
  failed: {
    bg: 'bg-[#ff3355]',
    text: 'text-white',
    label: 'Failed',
    glow: '',
  },
};

const agentColors: Record<string, string> = {
  OpenAI: 'bg-[#00d9ff]',
  Claude: 'bg-[#ff9500]',
  Gemini: 'bg-[#00ff88]',
  Minimax: 'bg-[#ff3355]',
};

export default function ProjectPipeline({ projects }: ProjectPipelineProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
        <h3 className="text-lg font-semibold text-[#f5f7fa] mb-4">Project Pipeline</h3>
        <div className="text-center py-12 text-[#7b8599]">
          No active projects
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f35] rounded-xl p-6 border border-[#3d4558]">
      <h3 className="text-lg font-semibold text-[#f5f7fa] mb-6">Project Pipeline</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          const config = statusConfig[project.status];

          return (
            <div
              key={project.id}
              className="bg-[#252b45] rounded-lg p-4 border border-[#3d4558] hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-250 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-base font-semibold text-[#f5f7fa] flex-1">
                  {project.name}
                </h4>
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${config.bg} ${config.text} ${config.glow}
                  `}
                >
                  {config.label}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#c8d0dd]">Progress</span>
                  <span className="text-xs font-mono text-[#f5f7fa]">
                    {project.progress_percentage}%
                  </span>
                </div>
                <div className="h-2 bg-[#3d4558] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00d9ff] to-[#00ff88] transition-all duration-350"
                    style={{ width: `${project.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Assigned Agents */}
              {project.assigned_agents && project.assigned_agents.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-[#c8d0dd] mb-2">Assigned Agents</div>
                  <div className="flex gap-2">
                    {project.assigned_agents.map((agent, idx) => (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${agentColors[agent] || 'bg-[#7b8599]'}`}
                        title={agent}
                      >
                        {agent[0]}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-[#3d4558] space-y-1">
                {project.deployment_url && (
                  <div className="text-xs text-[#00d9ff] truncate hover:underline">
                    {project.deployment_url}
                  </div>
                )}
                <div className="text-xs text-[#7b8599]">
                  Updated: {new Date(project.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
