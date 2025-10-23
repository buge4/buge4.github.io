import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              VERITON
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#technology" className="text-gray-700 hover:text-gray-900 transition">
              Technology
            </a>
            <a href="#markets" className="text-gray-700 hover:text-gray-900 transition">
              Markets
            </a>
            <a href="#impact" className="text-gray-700 hover:text-gray-900 transition">
              Impact
            </a>
            <Link to="/chat" className="text-gray-700 hover:text-gray-900 transition">
              Chat
            </Link>
            <Link to="/random-monitor" className="text-gray-700 hover:text-gray-900 transition">
              Random Monitor
            </Link>
            <Link to="/veriton-genesis" className="text-gray-700 hover:text-gray-900 transition">
              Veriton Genesis
            </Link>
            <Link to="/saas" className="text-gray-700 hover:text-gray-900 transition">
              SaaS
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/chat"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Chat
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              AI Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
