export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">VERITON</h3>
            <p className="text-gray-400 text-sm">
              Revolutionary blockchain randomness technology. Patent-pending TVRF solutions for gaming, AI, finance, and more.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Technology</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">TVRF Core</a></li>
              <li><a href="#" className="hover:text-white transition">Patent Portfolio</a></li>
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">Integration Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Markets</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Gaming & Lotteries</a></li>
              <li><a href="#" className="hover:text-white transition">AI & Machine Learning</a></li>
              <li><a href="#" className="hover:text-white transition">Financial Services</a></li>
              <li><a href="#" className="hover:text-white transition">NFTs & Digital Assets</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <a href="#/business-hub" className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-sm font-medium">
              Business Hub
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Veriton. All rights reserved. Patent-pending technology.</p>
        </div>
      </div>
    </footer>
  );
}
