import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Target, Users, Globe, Shield, Zap, BarChart3, FileText, Download, Eye, FileSpreadsheet, PieChart, Award, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { usePage, usePageBlocks } from '../../hooks/usePages';
import { useBusinessHubArticles } from '../../hooks/useBusinessHub';

export default function InvestorView() {
  const { page, loading: pageLoading, error: pageError } = usePage('investor-view');
  const { blocks, loading: blocksLoading, error: blocksError } = usePageBlocks(page?.id || null);
  const { articles, loading: articlesLoading } = useBusinessHubArticles({ category: 'investor', limit: 5 });

  const loading = pageLoading || blocksLoading;
  const error = pageError || blocksError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1a2b4a] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading investor view...</p>
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

  // Parse content blocks for dynamic data
  const getBlockContent = (type: string) => {
    return blocks?.find(block => block.block_type === type)?.content || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a2b4a] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-200 transition">
              <span className="text-sm">← Back to Home</span>
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition">
              <Download className="w-4 h-4" />
              <span className="text-sm">Download All</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">{page?.title || 'INVESTOR VIEW'}</h1>
          <p className="text-gray-300">{page?.meta_description || 'Financial projections, market opportunity, and investment highlights'}</p>
        </div>
      </header>

      {/* Secondary Navigation */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex gap-4 flex-wrap">
          <Link to="/business-hub" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/business-hub/investor-view" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
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
          <Link to="/business-hub/overview" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <FileSpreadsheet className="w-4 h-4" />
            Overview
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Investment Opportunity Overview */}
        <div className="mb-12 bg-gradient-to-br from-[#1a2b4a] to-[#2d4263] rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Investment Opportunity</h2>
          <p className="text-lg text-gray-200 mb-4">
            {page?.content || "VERITON is pioneering the next generation of truly verifiable random number generation through our patent-pending TVRF technology. We're positioned to capture significant market share in an $800B+ addressable market across gaming, AI, blockchain, and digital lottery sectors."}
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">2 Patents Pending</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Proprietary Technology</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">First-Mover Advantage</span>
            </div>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Market Opportunity */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-[#1a2b4a]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1a2b4a] rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">MARKET SIZE</h3>
            </div>
            <div className="text-4xl font-bold text-[#1a2b4a] mb-1">$800B+</div>
            <p className="text-sm text-gray-600">Total Addressable Market</p>
          </div>

          {/* Projected ROI */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">PROJECTED ROI</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-1">250%+</div>
            <p className="text-sm text-gray-600">5-Year Projection</p>
          </div>

          {/* Target Revenue */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">TARGET REVENUE</h3>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-1">$50M</div>
            <p className="text-sm text-gray-600">Year 3 Target</p>
          </div>

          {/* Platform Reach */}
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">USER TARGET</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-1">10M+</div>
            <p className="text-sm text-gray-600">Users by Year 3</p>
          </div>
        </div>

        {/* Investment Highlights */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Investment Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#1a2b4a] rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Proprietary Patent-Pending Technology</h3>
                <p className="text-gray-700">TVRF (Truly Verifiable Random Function) offers unprecedented transparency and security, creating strong barriers to entry and competitive advantage.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#1a2b4a] rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Multi-Platform Strategy</h3>
                <p className="text-gray-700">Four platforms in development (YouLottery, GameForge, AgentRand, Digital Assets) targeting diverse high-growth markets.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#1a2b4a] rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Massive Market Opportunity</h3>
                <p className="text-gray-700">$800B+ addressable market across online gaming ($200B), AI fairness ($150B), blockchain ($300B), and digital lotteries ($150B).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#1a2b4a] rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">First-Mover Advantage</h3>
                <p className="text-gray-700">Early entry into emerging verifiable randomness market positions us as the industry standard before competitors establish presence.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Projections */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Financial Projections</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#1a2b4a]">
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Metric</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">Year 1</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">Year 2</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">Year 3</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-900">Year 5</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-900">Revenue</td>
                  <td className="text-right py-3 px-4 text-gray-700">$2M</td>
                  <td className="text-right py-3 px-4 text-gray-700">$12M</td>
                  <td className="text-right py-3 px-4 text-gray-700">$50M</td>
                  <td className="text-right py-3 px-4 text-gray-700">$180M</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-900">Active Users</td>
                  <td className="text-right py-3 px-4 text-gray-700">100K</td>
                  <td className="text-right py-3 px-4 text-gray-700">1.5M</td>
                  <td className="text-right py-3 px-4 text-gray-700">10M</td>
                  <td className="text-right py-3 px-4 text-gray-700">50M</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-900">EBITDA Margin</td>
                  <td className="text-right py-3 px-4 text-gray-700">-50%</td>
                  <td className="text-right py-3 px-4 text-gray-700">15%</td>
                  <td className="text-right py-3 px-4 text-gray-700">35%</td>
                  <td className="text-right py-3 px-4 text-gray-700">45%</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-semibold text-gray-900">Platform Partners</td>
                  <td className="text-right py-3 px-4 text-gray-700">5</td>
                  <td className="text-right py-3 px-4 text-gray-700">25</td>
                  <td className="text-right py-3 px-4 text-gray-700">100</td>
                  <td className="text-right py-3 px-4 text-gray-700">500+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-start gap-3">
              <ArrowUpRight className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Strong Growth Trajectory</p>
                <p className="text-sm text-gray-700 mt-1">
                  Conservative estimates show 400%+ annual growth in Years 1-3, with path to profitability by Year 2.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Revenue Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
              <PieChart className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Platform Fees</h3>
              <p className="text-3xl font-bold text-purple-600 mb-1">40%</p>
              <p className="text-sm text-gray-600">Transaction-based revenue</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Subscriptions</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">30%</p>
              <p className="text-sm text-gray-600">Enterprise & API access</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Licensing</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">20%</p>
              <p className="text-sm text-gray-600">Technology licensing</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <DollarSign className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Premium Features</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-1">10%</p>
              <p className="text-sm text-gray-600">Advanced analytics & tools</p>
            </div>
          </div>
        </div>

        {/* Use of Funds */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Use of Funds</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Product Development</span>
                <span className="font-bold text-[#1a2b4a]">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#1a2b4a] h-3 rounded-full" style={{width: '40%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Marketing & User Acquisition</span>
                <span className="font-bold text-purple-600">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-600 h-3 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Team Expansion</span>
                <span className="font-bold text-blue-600">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{width: '20%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Legal & IP Protection</span>
                <span className="font-bold text-green-600">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{width: '10%'}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Operations & Infrastructure</span>
                <span className="font-bold text-orange-600">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-orange-600 h-3 rounded-full" style={{width: '5%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400">Created by MiniMax Agent</p>
        </div>
      </footer>
    </div>
  );
}
