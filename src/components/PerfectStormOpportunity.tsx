import { Link2, Building2, BarChart3, FlaskConical, Bot, Clock } from 'lucide-react';
import type { WebsiteSection } from '../lib/types';

interface PerfectStormOpportunityProps {
  section?: WebsiteSection;
}

export default function PerfectStormOpportunity({ section }: PerfectStormOpportunityProps) {
  const title = section?.title || 'Why Now? Perfect Storm of Opportunity';

  const cards = [
    {
      icon: Link2,
      heading: 'Blockchain Maturity',
      description: 'Infrastructure finally ready for mass adoption. Gas fees manageable, speeds acceptable, UX is smooth'
    },
    {
      icon: Building2,
      heading: 'Regulatory Clarity',
      description: 'Governments embracing blockchain innovation. Clear guidelines emerging, institutional adoption accelerating'
    },
    {
      icon: BarChart3,
      heading: 'Market Demand',
      description: 'Users demanding transparency and true ownership. Traditional systems failing user trust, decentralized solutions sought'
    },
    {
      icon: FlaskConical,
      heading: 'Technical Breakthrough',
      description: 'We solved what others couldn\'t (oracle-free randomness). Years of research culminated in our patent-pending TVRF technology'
    },
    {
      icon: Bot,
      heading: 'AI Revolution',
      description: 'Every AI needs our solution desperately. AI growth creates massive demand for cost-effective random numbers'
    },
    {
      icon: Clock,
      heading: 'Perfect Timing',
      description: 'Before competitors realize what we\'ve built. First-mover advantage in a market that will be worth trillions'
    }
  ];

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#f59e0b]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.heading}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
