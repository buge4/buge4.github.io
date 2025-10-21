import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RandomMonitor() {
  useEffect(() => {
    // Redirect to the standalone TVRF monitor HTML
    window.location.href = '/tvrf-monitor.html';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-400 text-lg">Loading TVRF Monitor...</p>
          <p className="text-gray-500 text-sm mt-2">Redirecting to complete system...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
