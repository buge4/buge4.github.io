import type { WebsiteSection } from '../lib/types';

interface NumbersThatMatterProps {
  section?: WebsiteSection;
}

export default function NumbersThatMatter({ section }: NumbersThatMatterProps) {
  const title = section?.title || 'The Numbers That Matter';

  const statistics = [
    { value: '$800B+', label: 'Market Opportunity', description: 'Total addressable market across all sectors' },
    { value: '99.9%', label: 'Cost Reduction', description: 'vs Chainlink VRF ($0.005 vs $4-25 per call)' },
    { value: 'Instant', label: 'Processing Speed', description: 'Immediate randomness generation' },
    { value: '0%', label: 'Trust Required', description: 'Pure mathematical verification' },
    { value: '$400B', label: 'Gaming Market', description: 'Gaming and lottery opportunity' },
    { value: '$150B', label: 'AI Market', description: 'AI and machine learning opportunity' },
    { value: '$200B', label: 'Finance Market', description: 'Financial services opportunity' },
    { value: '1', label: 'Adoption Barrier', description: 'line of code to integrate' }
  ];

  return (
    <section id="markets" className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:border-[#1a2b4a] transition">
              <div className="text-4xl font-bold text-[#1a2b4a] mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
