import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/business-hub" element={<BusinessHubPage />} />
        <Route path="/business-hub/investor-view" element={<InvestorView />} />
        <Route path="/business-hub/analytics" element={<Analytics />} />
        <Route path="/business-hub/documents" element={<Documents />} />
        <Route path="/business-hub/overview" element={<Overview />} />
        <Route path="/random-monitor" element={<RandomMonitor />} />
        <Route
          path="/veriton-genesis"
          element={
            <ProtectedRoute requiredRole="veriton_genesis_access">
              <VeritonGenesis />
            </ProtectedRoute>
          }
        />
        <Route path="/saas" element={<SaaS />} />
      </Routes>
    </Router>
  );
}

export default App;
