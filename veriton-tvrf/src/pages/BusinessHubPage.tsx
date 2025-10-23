import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Users, Globe, CheckCircle, Clock, FileText, Download, BarChart3, FileSpreadsheet, Eye, Loader2, AlertCircle } from 'lucide-react';
import { useBusinessHubDashboard } from '../hooks';

// Icon mapping helper
const iconMap: Record<string, any> = {
  Shield,
  TrendingUp,
  Users,
  Globe,
  CheckCircle,
  Clock,
  FileText,
};

export default function BusinessHubPage() {
  const { statusCards, timeline, content, loading, error } = useBusinessHubDashboard();

  // Get content sections
  const whyRandomnessTitle = content.find(c => c.section_key === 'why_randomness_title')?.title || 'Why Randomness Matters';
  const whyRandomnessContent = content.find(c => c.section_key === 'why_randomness_content')?.content || 'Random numbers are the foundation of trust in digital systems. Every fair lottery, secure transaction, and unbiased AI decision depends on truly random numbers.';
  const whyRandomnessProblem = content.find(c => c.section_key === 'why_randomness_problem')?.content || 'Current solutions either require trusting third parties (oracles) or can\'t be verified (traditional RNG). This creates vulnerability and limits adoption.';
  const timelineTitle = content.find(c => c.section_key === 'timeline_title')?.title || 'Technology Development Timeline';

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
          <h1 className="text-4xl font-bold mb-2">VERITON BUSINESS HUB</h1>
          <p className="text-gray-300">Comprehensive business intelligence and documentation</p>
        </div>
      </header>

      {/* Secondary Navigation */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex gap-4 flex-wrap">
          <Link to="/business-hub" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
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
          <Link to="/business-hub/overview" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <FileSpreadsheet className="w-4 h-4" />
            Overview
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">Loading dashboard...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error Loading Dashboard</h3>
                <p className="text-red-700">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && (
          <>
            {/* Why Randomness Matters */}
            <div className="mb-12 bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{whyRandomnessTitle}</h2>
              <p className="text-lg text-gray-700 mb-4">
                {whyRandomnessContent}
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="font-semibold text-gray-900 mb-2">The Problem:</p>
                <p className="text-gray-700">
                  {whyRandomnessProblem}
                </p>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statusCards.map((card) => {
                const IconComponent = iconMap[card.icon] || Shield;
                return (
                  <div
                    key={card.id}
                    className="rounded-lg p-6 shadow-md"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${card.gradient_from}, ${card.gradient_to})`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6" style={{ color: card.icon_color }} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                    <div className="text-sm text-gray-600">
                      {card.details && card.details.length > 0 ? (
                        <div className="space-y-1">
                          {card.details.map((detail, idx) => (
                            <p key={idx}>• {detail}</p>
                          ))}
                        </div>
                      ) : (
                        <p>{card.subtitle}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Technology Development Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{timelineTitle}</h2>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 hidden md:block"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  {timeline.map((event) => {
                    const EventIcon = iconMap[event.icon] || Clock;
                    return (
                      <div key={event.id} className="text-center">
                        <div
                          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 relative z-10"
                          style={{ backgroundColor: event.bg_color }}
                        >
                          <EventIcon className="w-12 h-12" style={{ color: event.icon_color }} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{event.period}</h3>
                        <p className="text-sm font-semibold mb-1" style={{ color: event.status_color }}>
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-600">{event.status_text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
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
