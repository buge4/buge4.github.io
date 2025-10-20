import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
            {user ? (
              <>
                <Link
                  to="/assistants"
                  className="text-gray-700 hover:text-gray-900 transition text-sm font-medium"
                >
                  My Assistants
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
              >
                Employee Login
              </Link>
            )}
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
