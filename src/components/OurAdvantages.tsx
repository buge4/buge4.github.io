import { Lock, Trophy, DollarSign, Link } from 'lucide-react';
import type { WebsiteSection } from '../lib/types';

interface OurAdvantagesProps {
  section?: WebsiteSection;
}

export default function OurAdvantages({ section }: OurAdvantagesProps) {
  const title = section?.title || 'Our Advantages';

  const cards = [
    {
      icon: Lock,
      heading: 'Patent Pending Technology',
      description: 'Our TVRF extraction method is protected intellectual property. No one else can provide oracle-free blockchain randomness. We\'re the only ones who can do this'
    },
    {
      icon: Trophy,
      heading: 'No Competition',
      description: 'Years of research led to our breakthrough. Competitors are still trying to figure out what we\'ve already perfected. Nobody else has solved randomness without oracles'
    },
    {
      icon: DollarSign,
      heading: 'Immediate Revenue',
      description: 'No waiting for adoption. Every integration, every transaction, every use case generates revenue immediately. Every product generates income from day one'
    },
    {
      icon: Link,
      heading: 'Network Effects',
      description: 'Unlike linear growth, our ecosystem creates compound effects where success breeds more success exponentially. Each product strengthens the others'
    }
  ];

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-[#f59e0b]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.heading}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
