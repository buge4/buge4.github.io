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
import AssistantsPage from './pages/AssistantsPage';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/assistants"
          element={
            <ProtectedRoute>
              <AssistantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-hub"
          element={
            <ProtectedRoute allowedRoles={['employee', 'ai_admin', 'super_admin']}>
              <BusinessHubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-hub/investor-view"
          element={
            <ProtectedRoute allowedRoles={['employee', 'ai_admin', 'super_admin']}>
              <InvestorView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-hub/analytics"
          element={
            <ProtectedRoute allowedRoles={['employee', 'ai_admin', 'super_admin']}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-hub/documents"
          element={
            <ProtectedRoute allowedRoles={['employee', 'ai_admin', 'super_admin']}>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-hub/overview"
          element={
            <ProtectedRoute allowedRoles={['employee', 'ai_admin', 'super_admin']}>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route path="/random-monitor" element={<RandomMonitor />} />
        <Route
          path="/veriton-genesis"
          element={
            <ProtectedRoute requiredRole="super_admin">
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
