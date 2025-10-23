import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import BusinessHubPage from './pages/BusinessHubPage';
import InvestorView from './pages/business-hub/InvestorView';
import Analytics from './pages/business-hub/Analytics';
import Documents from './pages/business-hub/Documents';
import Overview from './pages/business-hub/Overview';
import RandomMonitor from './pages/RandomMonitor';
import VeritonGenesis from './pages/VeritonGenesis';
import SaaS from './pages/SaaS';
import ChatPage from './pages/ChatPage';
import ChatSystemTest from './components/ChatSystemTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/business-hub" element={<BusinessHubPage />} />
        <Route path="/business-hub/investor-view" element={<InvestorView />} />
        <Route path="/business-hub/analytics" element={<Analytics />} />
        <Route path="/business-hub/documents" element={<Documents />} />
        <Route path="/business-hub/overview" element={<Overview />} />
        <Route path="/random-monitor" element={<RandomMonitor />} />
        <Route path="/veriton-genesis" element={<VeritonGenesis />} />
        <Route path="/saas" element={<SaaS />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat-test" element={<ChatSystemTest />} />
      </Routes>
    </Router>
  );
}

export default App;
