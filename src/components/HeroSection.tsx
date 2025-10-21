import { Info, Check } from 'lucide-react';
import type { WebsiteSection } from '../lib/types';

interface HeroSectionProps {
  section?: WebsiteSection;
}

export default function HeroSection({ section }: HeroSectionProps) {
  const title = section?.title || 'The Moment Everything Changes';
  const content = section?.content || 'For the first time, pure randomness without compromise.';

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-2xl text-gray-700 mb-4">
          {content}
        </p>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          No oracles. No trust required. Just pure mathematics. TVRF is the breakthrough everyone has been waiting for.
        </p>
        <p className="text-md text-gray-500 mb-8">
          Gaming. AI. Finance. NFTs. Security. One technology. $800B in applications.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="px-8 py-3 bg-[#1a2b4a] text-white rounded-lg hover:bg-[#243654] transition font-medium">
            See the Technology →
          </button>
          <a href="#/business-hub" className="px-8 py-3 border-2 border-[#1a2b4a] text-[#1a2b4a] rounded-lg hover:bg-gray-50 transition font-medium text-center">
            View Business Hub →
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#f59e0b]" />
            <span className="text-gray-700">Patent-pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-[#f59e0b]" />
            <span className="text-gray-700">99.9% cheaper</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-[#f59e0b]" />
            <span className="text-gray-700">Zero trust needed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
