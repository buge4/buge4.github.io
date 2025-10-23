import { Check, X } from 'lucide-react';
import type { WebsiteSection } from '../lib/types';

interface CompetitiveAdvantageProps {
  section?: WebsiteSection;
}

export default function CompetitiveAdvantage({ section }: CompetitiveAdvantageProps) {
  const title = section?.title || 'The Competitive Advantage';

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          {title}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Solution</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cost per Call</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Speed</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trust Required</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Verification</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-6 py-4 font-medium text-gray-900">Chainlink VRF</td>
                <td className="px-6 py-4 text-gray-600">$4-25</td>
                <td className="px-6 py-4 text-gray-600">3-block wait</td>
                <td className="px-6 py-4 text-gray-600">Oracle trust</td>
                <td className="px-6 py-4 text-gray-600">Limited</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-6 py-4 font-medium text-gray-900">Traditional RNG</td>
                <td className="px-6 py-4 text-gray-600">Variable</td>
                <td className="px-6 py-4 text-gray-600">Fast</td>
                <td className="px-6 py-4 text-gray-600">Complete trust</td>
                <td className="px-6 py-4 text-gray-600">Not verifiable</td>
              </tr>
              <tr className="bg-green-50 border-b border-green-100">
                <td className="px-6 py-4 font-bold text-[#1a2b4a]">Veriton TVRF</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">$0.005</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Instant</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Zero trust</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">Verifiable forever</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xl font-bold text-gray-900">
            We're not 10% better. We're 99.9% cheaper AND infinitely more trustworthy.
          </p>
        </div>
      </div>
    </section>
  );
}
