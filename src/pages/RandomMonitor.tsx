import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RandomMonitor() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Random Monitor
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Real-time monitoring and verification of randomness generation
            </p>
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">
                  Content coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
