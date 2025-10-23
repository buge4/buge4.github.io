import { Link } from 'react-router-dom';
import { FileText, Download, BarChart3, FileSpreadsheet, Eye, CheckCircle, Clock, FileCheck, File, Loader2, AlertCircle } from 'lucide-react';
import { usePage, usePageBlocks } from '../../hooks/usePages';
import { useBusinessHubArticles } from '../../hooks/useBusinessHub';

export default function Documents() {
  const { page, loading: pageLoading, error: pageError } = usePage('documents');
  const { blocks, loading: blocksLoading, error: blocksError } = usePageBlocks(page?.id || null);
  const { articles, loading: articlesLoading } = useBusinessHubArticles({ category: 'documents', limit: 10 });

  const loading = pageLoading || blocksLoading;
  const error = pageError || blocksError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1a2b4a] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading documents library...</p>
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
              <span className="text-sm">Download All</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">{page?.title || 'Documents Library'}</h1>
          <p className="text-gray-300">{page?.meta_description || 'Patent filings, technical documentation, and research papers'}</p>
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
          <Link to="/business-hub/documents" className="flex items-center gap-2 px-4 py-2 bg-[#1a2b4a] text-white rounded-lg hover:bg-[#2a3b5a] transition">
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
        {/* Document Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Patents */}
          <div className="bg-gradient-to-br from-[#1a2b4a] to-[#2a4b7a] text-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">PATENT DOCUMENTS</h3>
            </div>
            <div className="text-3xl font-bold mb-1">2 Pending</div>
            <p className="text-sm text-gray-200">+4 more in development</p>
          </div>

          {/* Whitepapers */}
          <div className="bg-gradient-to-br from-[#1a2b4a] to-[#2a4b7a] text-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">WHITEPAPERS</h3>
            </div>
            <div className="text-3xl font-bold mb-1">1 Published</div>
            <p className="text-sm text-gray-200">TVRF Technical Specification</p>
          </div>

          {/* Technical Docs */}
          <div className="bg-gradient-to-br from-[#1a2b4a] to-[#2a4b7a] text-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <File className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold">TECHNICAL DOCS</h3>
            </div>
            <div className="text-3xl font-bold mb-1">{articles.length || 12} Available</div>
            <p className="text-sm text-gray-200">Implementation guides & APIs</p>
          </div>
        </div>

        {/* Patent Documents Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1a2b4a] mb-6">Patent Documents</h2>
          
          {/* Pending Patents */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Pending Applications (2)
            </h3>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">TVRF Core Algorithm</h4>
                    <p className="text-sm text-gray-600">Application No.: US-2024-XXXXX1</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1 bg-[#1a2b4a] text-white text-sm rounded hover:bg-[#2a3b5a] transition">
                    <Download className="w-3 h-3" />
                    View
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-2">Method and system for time-verifiable random function generation using blockchain consensus</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Under Review</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Filed: Q1 2024</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Multi-Party Verification Protocol</h4>
                    <p className="text-sm text-gray-600">Application No.: US-2024-XXXXX2</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1 bg-[#1a2b4a] text-white text-sm rounded hover:bg-[#2a3b5a] transition">
                    <Download className="w-3 h-3" />
                    View
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-2">Distributed consensus mechanism for verifiable random number generation</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Under Review</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Filed: Q2 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* In Development */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              In Development (4)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Quantum-Resistant Entropy Source</h4>
                <p className="text-xs text-gray-600 mb-2">Post-quantum cryptographic randomness generation</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Research Phase</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Cross-Chain RNG Bridge</h4>
                <p className="text-xs text-gray-600 mb-2">Interoperability protocol for multi-chain randomness</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Development</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">AI-Powered Bias Detection</h4>
                <p className="text-xs text-gray-600 mb-2">Machine learning system for randomness quality assurance</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Prototyping</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Zero-Knowledge Proof Integration</h4>
                <p className="text-xs text-gray-600 mb-2">Privacy-preserving randomness verification</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Conceptual</span>
              </div>
            </div>
          </div>
        </div>

        {/* Whitepapers Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1a2b4a] mb-6">Whitepapers</h2>
          <div className="border border-gray-200 rounded-lg p-6 hover:border-[#1a2b4a] transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 bg-gradient-to-br from-[#1a2b4a] to-[#2a4b7a] rounded flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">TVRF: Time-Verifiable Random Function</h3>
                  <p className="text-sm text-gray-600 mb-2">Technical Specification v2.1</p>
                  <p className="text-sm text-gray-700 mb-3">
                    A comprehensive technical overview of the TVRF protocol, including cryptographic foundations, 
                    consensus mechanisms, and implementation guidelines for decentralized random number generation.
                  </p>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Published</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">45 pages</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Updated: Oct 2024</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2b4a] text-white rounded hover:bg-[#2a3b5a] transition">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Technical Documentation Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#1a2b4a] mb-6">Technical Documentation</h2>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{article.title}</h4>
                      <p className="text-sm text-gray-600">{article.excerpt}</p>
                    </div>
                    <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Technical Doc</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">API Reference Guide</h4>
                    <p className="text-sm text-gray-600">Complete API documentation and examples</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">12 pages</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Integration Guide</h4>
                    <p className="text-sm text-gray-600">Step-by-step platform integration</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">18 pages</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Security Audit Report</h4>
                    <p className="text-sm text-gray-600">Third-party security assessment</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">24 pages</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Contract Documentation</h4>
                    <p className="text-sm text-gray-600">Contract specifications and deployment</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">16 pages</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Performance Benchmarks</h4>
                    <p className="text-sm text-gray-600">System performance and scalability tests</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">8 pages</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Developer Quick Start</h4>
                    <p className="text-sm text-gray-600">Getting started with TVRF development</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">6 pages</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Use Case Examples</h4>
                    <p className="text-sm text-gray-600">Real-world implementation scenarios</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">14 pages</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1a2b4a] transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Troubleshooting Guide</h4>
                    <p className="text-sm text-gray-600">Common issues and solutions</p>
                  </div>
                  <Download className="w-4 h-4 text-[#1a2b4a] cursor-pointer" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">10 pages</span>
              </div>
            </div>
          )}
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
