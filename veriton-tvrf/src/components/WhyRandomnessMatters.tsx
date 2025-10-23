import { DollarSign, Lock, Bot, Gem } from 'lucide-react';
import type { WebsiteSection } from '../lib/types';

interface WhyRandomnessMattersProps {
  section?: WebsiteSection;
}

export default function WhyRandomnessMatters({ section }: WhyRandomnessMattersProps) {
  const title = section?.title || 'Why Randomness Matters';
  const description = section?.content || 'Randomness is the invisible foundation of trust in our digital world. Every fair lottery, secure transaction, and unbiased AI decision depends on truly random numbers.';

  const cards = [
    {
      icon: DollarSign,
      heading: 'Gaming',
      description: 'Fair lottery draws that players can verify',
      marketSize: '$400B Market'
    },
    {
      icon: Lock,
      heading: 'Security',
      description: "Cryptographic keys that can't be predicted",
      marketSize: '$200B Market'
    },
    {
      icon: Bot,
      heading: 'AI/ML',
      description: 'Unbiased AI training that produces fair results',
      marketSize: '$100B Market'
    },
    {
      icon: Gem,
      heading: 'NFTs',
      description: 'Transparent reveals that collectors can trust',
      marketSize: '$70B Market'
    }
  ];

  return (
    <section id="technology" className="bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-4xl mx-auto">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#f59e0b]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.heading}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <p className="text-sm font-semibold text-[#1a2b4a]">{card.marketSize}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
