import type { WebsiteSection } from '../lib/types';

interface PerfectStormBannerProps {
  section?: WebsiteSection;
}

export default function PerfectStormBanner({ section }: PerfectStormBannerProps) {
  const title = section?.title || 'The Perfect Storm';
  const content = section?.content || 'All conditions have aligned. The technology is ready. The market is ready. The timing will never be better.';

  return (
    <section className="bg-[#1a2b4a] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-gray-200">
          {content}
        </p>
      </div>
    </section>
  );
}
