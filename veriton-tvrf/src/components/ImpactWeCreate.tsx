import { Globe, Gamepad2, Bot, Lock } from 'lucide-react';
import type { WebsiteSection } from '../lib/types';

interface ImpactWeCreateProps {
  section?: WebsiteSection;
}

export default function ImpactWeCreate({ section }: ImpactWeCreateProps) {
  const title = section?.title || 'The Impact We\'ll Create';

  const impacts = [
    {
      icon: Globe,
      heading: 'Economic Impact',
      description: 'By eliminating oracle costs and enabling new use cases, TVRF will create massive economic value across industries.',
      statistic: '$50B+ in annual value creation'
    },
    {
      icon: Gamepad2,
      heading: 'Gaming Revolution',
      description: 'Every lottery draw, every game outcome, every prize drop becomes verifiable by anyone. $400B gaming industry transformed.',
      subDescription: 'Making gaming provably fair worldwide'
    },
    {
      icon: Bot,
      heading: 'AI Fairness',
      description: 'Remove bias from AI training and decision-making. Enable provably fair AI systems that anyone can verify.',
      subDescription: 'Unbiased AI for everyone'
    },
    {
      icon: Lock,
      heading: 'Security Enhancement',
      description: 'Better random numbers mean stronger encryption, more secure wallets, and safer digital assets for billions of users.',
      subDescription: 'Strengthening crypto security globally'
    }
  ];

  const largeStats = [
    { value: '1 Billion+', label: 'Users Impacted' },
    { value: '$2.5B', label: 'Annual Savings' },
    { value: '100,000+', label: 'Developers Enabled' },
    { value: 'Zero', label: 'Trust Required' }
  ];

  return (
    <section id="impact" className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div key={index} className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
                <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-[#f59e0b]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{impact.heading}</h3>
                <p className="text-gray-600 mb-3">{impact.description}</p>
                {impact.statistic && (
                  <p className="text-sm font-semibold text-[#1a2b4a]">{impact.statistic}</p>
                )}
                {impact.subDescription && (
                  <p className="text-sm italic text-gray-500">{impact.subDescription}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#1a2b4a] rounded-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {largeStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-200 text-lg">
            By 2027, TVRF will touch over 1 billion users across gaming, finance, AI, and digital assets.
          </p>
        </div>
      </div>
    </section>
  );
}
