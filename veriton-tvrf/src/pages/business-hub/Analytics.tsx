import { Link } from 'react-router-dom';
import { Download, BarChart3, Eye, FileText, FileSpreadsheet, TrendingUp, Users, Globe, Activity, ArrowUp, ArrowDown, Loader2, AlertCircle } from 'lucide-react';
import { usePage, usePageBlocks } from '../../hooks/usePages';
import { useBusinessHubArticles } from '../../hooks/useBusinessHub';

export default function Analytics() {
  const { page, loading: pageLoading, error: pageError } = usePage('analytics');
  const { blocks, loading: blocksLoading, error: blocksError } = usePageBlocks(page?.id || null);
  const { articles, loading: articlesLoading } = useBusinessHubArticles({ category: 'analytics', limit: 5 });

  const loading = pageLoading || blocksLoading;
  const error = pageError || blocksError;

  // Mock data for analytics (to be replaced with database content when available)
  const trafficData = [
    { month: 'Jan', visitors: 12500, pageViews: 45000 },
    { month: 'Feb', visitors: 15800, pageViews: 52000 },
    { month: 'Mar', visitors: 18200, pageViews: 61000 },
    { month: 'Apr', visitors: 22400, pageViews: 75000 },
    { month: 'May', visitors: 28600, pageViews: 89000 },
    { month: 'Jun', visitors: 35200, pageViews: 102000 },
  ];

  const engagementMetrics = [
    { label: 'Avg. Session Duration', value: '4:32', change: '+12%', trend: 'up' },
    { label: 'Bounce Rate', value: '32.4%', change: '-8%', trend: 'up' },
    { label: 'Pages per Session', value: '5.8', change: '+15%', trend: 'up' },
    { label: 'Conversion Rate', value: '3.2%', change: '+22%', trend: 'up' },
  ];

  const topPages = [
    { page: '/platforms/youlottery', views: 45200, rate: '28%' },
    { page: '/technology/tvrf', views: 38600, rate: '24%' },
    { page: '/platforms/gameforge', views: 32400, rate: '20%' },
    { page: '/business-hub', views: 28900, rate: '18%' },
    { page: '/contact', views: 16100, rate: '10%' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1a2b4a] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics dashboard...</p>
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
            <Link to="/" className="flex items-center gap-2 text-white hover:text-gray-200 transition">
              <span className="text-sm">← Back to Home</span>
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export Report</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">{page?.title || 'ANALYTICS DASHBOARD'}</h1>
          <p className="text-gray-300">{page?.meta_description || 'Track performance, engagement, and growth metrics'}</p>
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
          <Link to="/business-hub/analytics" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
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
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Visitors */}
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#1a2b4a]" />
              </div>
              <h3 className="font-semibold text-gray-900">TOTAL VISITORS</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">132,700</div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+24% from last period</span>
            </div>
          </div>

          {/* Page Views */}
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-[#1a2b4a]" />
              </div>
              <h3 className="font-semibold text-gray-900">PAGE VIEWS</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">424,000</div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+31% from last period</span>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#1a2b4a]" />
              </div>
              <h3 className="font-semibold text-gray-900">ACTIVE USERS</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">8,450</div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+18% from last period</span>
            </div>
          </div>

          {/* Global Reach */}
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#1a2b4a]" />
              </div>
              <h3 className="font-semibold text-gray-900">COUNTRIES</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">42</div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+5 new this period</span>
            </div>
          </div>
        </div>

        {/* Website Traffic Growth */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[#1a2b4a]" />
            <h2 className="text-2xl font-bold text-gray-900">Website Traffic Growth</h2>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {trafficData.map((data, index) => {
              const maxVisitors = Math.max(...trafficData.map(d => d.visitors));
              const visitorWidth = (data.visitors / maxVisitors) * 100;
              const pageViewWidth = (data.pageViews / 102000) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700 w-12">{data.month}</span>
                    <span className="text-gray-600">Visitors: {data.visitors.toLocaleString()}</span>
                    <span className="text-gray-600">Page Views: {data.pageViews.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded">
                        <div 
                          className="h-8 bg-gradient-to-r from-[#1a2b4a] to-purple-600 rounded transition-all duration-500"
                          style={{ width: `${visitorWidth}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded">
                        <div 
                          className="h-8 bg-gradient-to-r from-blue-500 to-blue-300 rounded transition-all duration-500"
                          style={{ width: `${pageViewWidth}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-6 mt-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-[#1a2b4a] to-purple-600 rounded"></div>
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-300 rounded"></div>
              <span className="text-sm text-gray-600">Page Views</span>
            </div>
          </div>
        </div>

        {/* User Engagement Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Engagement Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementMetrics.map((metric, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                <div className="text-3xl font-bold text-[#1a2b4a] mb-2">{metric.value}</div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Pages */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Performing Pages</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Page</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Share</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Visual</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-mono text-sm text-[#1a2b4a]">{page.page}</td>
                    <td className="py-4 px-4 text-gray-900">{page.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-900">{page.rate}</td>
                    <td className="py-4 px-4">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#1a2b4a] to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: page.rate }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
