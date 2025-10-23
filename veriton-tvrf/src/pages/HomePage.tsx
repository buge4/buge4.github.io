import { useSections } from '../hooks';
import HeroSection from '../components/HeroSection';
import WhyRandomnessMatters from '../components/WhyRandomnessMatters';
import PerfectStormOpportunity from '../components/PerfectStormOpportunity';
import PerfectStormBanner from '../components/PerfectStormBanner';
import OurAdvantages from '../components/OurAdvantages';
import NumbersThatMatter from '../components/NumbersThatMatter';
import CompetitiveAdvantage from '../components/CompetitiveAdvantage';
import ImpactWeCreate from '../components/ImpactWeCreate';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { WebsiteSection } from '../lib/types';

export default function HomePage() {
  const { sections, loading, error, refetch } = useSections();

  // Helper function to get section data by name
  const getSection = (sectionName: string): WebsiteSection | undefined => {
    return sections.find(section => section.section_name === sectionName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2b4a]"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Content</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection section={getSection('hero')} />
      <WhyRandomnessMatters section={getSection('why_randomness_matters')} />
      <PerfectStormOpportunity section={getSection('perfect_storm_opportunity')} />
      <PerfectStormBanner section={getSection('perfect_storm_banner')} />
      <OurAdvantages section={getSection('our_advantages')} />
      <NumbersThatMatter section={getSection('numbers_that_matter')} />
      <CompetitiveAdvantage section={getSection('competitive_advantage')} />
      <ImpactWeCreate section={getSection('impact_we_create')} />
      <Footer />
    </div>
  );
}
