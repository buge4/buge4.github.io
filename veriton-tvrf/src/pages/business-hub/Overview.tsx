import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, Target, CheckCircle, AlertCircle, Download, BarChart3, FileSpreadsheet, Eye, FileText, Zap, Clock, Shield, Loader2 } from 'lucide-react';
import { usePage, usePageBlocks } from '../../hooks/usePages';
import { useBusinessHubArticles } from '../../hooks/useBusinessHub';

export default function Overview() {
  const { page, loading: pageLoading, error: pageError } = usePage('overview');
  const { blocks, loading: blocksLoading, error: blocksError } = usePageBlocks(page?.id || null);
  const { articles, loading: articlesLoading } = useBusinessHubArticles({ category: 'overview', limit: 5 });

  const loading = pageLoading || blocksLoading;
  const error = pageError || blocksError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1a2b4a] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading executive overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Page</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link to="/business-hub" className="text-[#1a2b4a] hover:underline">← Back to Business Hub</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a2b4a] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to="/business-hub" className="flex items-center gap-2 text-white hover:text-gray-200 transition">
              <span className="text-sm">← Back to Business Hub</span>
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition">
              <Download className="w-4 h-4" />
              <span className="text-sm">Download Report</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">{page?.title || 'EXECUTIVE OVERVIEW'}</h1>
          <p className="text-gray-300">{page?.meta_description || 'High-level business intelligence and strategic metrics'}</p>
        </div>
      </header>

      {/* Secondary Navigation */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex gap-4 flex-wrap">
          <Link to="/business-hub" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/business-hub/investor-view" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <Eye className="w-4 h-4" />
            Investor View
          </Link>
          <Link to="/business-hub/analytics" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <Link to="/business-hub/documents" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <FileText className="w-4 h-4" />
            Documents
          </Link>
          <Link to="/business-hub/overview" className="flex items-center gap-2 px-4 py-2 bg-[#1a2b4a] text-white rounded-lg hover:bg-opacity-90 transition">
            <FileSpreadsheet className="w-4 h-4" />
            Overview
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Business Summary */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-[#1a2b4a] mb-4">Business Summary</h2>
          <p className="text-lg text-gray-700 mb-6">
            {page?.content || "VERITON is pioneering Trustless Verifiable Random Functions (TVRF), a revolutionary blockchain-based technology that delivers truly random, verifiable numbers without requiring trust in third parties. Our patent-pending solution addresses critical needs across gaming, AI, lotteries, and digital assets."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-[#1a2b4a]">
              <h3 className="font-bold text-[#1a2b4a] mb-2">Vision</h3>
              <p className="text-sm text-gray-700">Become the global standard for verifiable randomness in decentralized systems</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-[#1a2b4a]">
              <h3 className="font-bold text-[#1a2b4a] mb-2">Mission</h3>
              <p className="text-sm text-gray-700">Eliminate trust dependencies in digital randomness through blockchain innovation</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-[#1a2b4a]">
              <h3 className="font-bold text-[#1a2b4a] mb-2">Advantage</h3>
              <p className="text-sm text-gray-700">Patent-pending technology with first-mover advantage in trustless RNG</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#1a2b4a] mb-6">Key Metrics Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue Projection */}
            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#1a2b4a]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">REVENUE TARGET</h3>
              </div>
              <div className="text-3xl font-bold text-[#1a2b4a] mb-1">$50M+</div>
              <p className="text-sm text-gray-600">Year 3 Projection</p>
              <div className="mt-3 flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Conservative estimate
              </div>
            </div>

            {/* Market Size */}
            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#1a2b4a]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">MARKET SIZE</h3>
              </div>
              <div className="text-3xl font-bold text-[#1a2b4a] mb-1">$800B+</div>
              <p className="text-sm text-gray-600">Total Addressable Market</p>
              <div className="mt-3 flex items-center text-purple-600 text-sm">
                <Zap className="w-4 h-4 mr-1" />
                Multi-industry reach
              </div>
            </div>

            {/* Platform Status */}
            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#1a2b4a]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">PLATFORMS</h3>
              </div>
              <div className="text-3xl font-bold text-[#1a2b4a] mb-1">4 Active</div>
              <p className="text-sm text-gray-600">In Development</p>
              <div className="mt-3 flex items-center text-blue-600 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                On track for Q1 2025
              </div>
            </div>

            {/* IP Portfolio */}
            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-[#1a2b4a]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">IP PORTFOLIO</h3>
              </div>
              <div className="text-3xl font-bold text-[#1a2b4a] mb-1">2 Patents</div>
              <p className="text-sm text-gray-600">Pending + 4 More</p>
              <div className="mt-3 flex items-center text-orange-600 text-sm">
                <Shield className="w-4 h-4 mr-1" />
                Strong protection
              </div>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#1a2b4a] mb-6">Recent Updates</h2>
          <div className="space-y-4">
            {/* Update 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">Patent Applications Submitted</h3>
                    <span className="text-sm text-gray-500">October 2024</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Successfully filed 2 core patent applications covering TVRF technology and blockchain implementation. Initial review feedback has been positive.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">COMPLETED</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">IP PROTECTION</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">Platform Development Milestone</h3>
                    <span className="text-sm text-gray-500">October 2024</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    YouLottery and GameForge platforms reached 60% completion. Smart contract testing shows excellent performance metrics with sub-second verification times.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">IN PROGRESS</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">DEVELOPMENT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">Market Analysis Completed</h3>
                    <span className="text-sm text-gray-500">September 2024</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Comprehensive market research identifies $800B+ opportunity across gaming, DeFi, and AI sectors. Early partnership discussions underway with tier-1 blockchain projects.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">COMPLETED</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">STRATEGY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">Team Expansion Initiative</h3>
                    <span className="text-sm text-gray-500">Ongoing</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    Recruiting additional blockchain developers and business development professionals to accelerate platform launches. Target to grow team by 40% in Q4 2024.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">ACTIVE</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">HIRING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Priorities */}
        <div className="bg-gradient-to-br from-[#1a2b4a] to-[#2d4263] rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Strategic Priorities Q4 2024</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">Platform Launch</h3>
              <p className="text-gray-200 text-sm">
                Complete development of YouLottery and GameForge platforms. Begin beta testing with select partners.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">Partnership Development</h3>
              <p className="text-gray-200 text-sm">
                Establish strategic partnerships with major blockchain platforms and gaming companies.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">IP Expansion</h3>
              <p className="text-gray-200 text-sm">
                File 4 additional patent applications to strengthen our intellectual property portfolio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400">VERITON Executive Overview - Last Updated: October 18, 2025</p>
        </div>
      </footer>
    </div>
  );
}
