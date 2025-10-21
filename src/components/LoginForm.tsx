import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const { signIn, userRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        // Wait for auth state and user role to propagate
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            // Role-based redirect logic
            let destination = redirectTo;
            if (!destination) {
              switch (userRole) {
                case 'super_admin':
                  destination = '/veriton-genesis';
                  break;
                case 'ai_admin':
                  destination = '/admin';
                  break;
                case 'employee':
                  destination = '/assistants';
                  break;
                default:
                  destination = '/';
                  break;
              }
            }
            navigate(destination, { replace: true });
          }
        }, 500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#1a1f35] rounded-xl p-8 border border-[#3d4558]">
          <h2 className="text-3xl font-bold text-[#f5f7fa] mb-2 text-center">
            Veriton Genesis Access
          </h2>
          <p className="text-[#c8d0dd] text-center mb-8">
            Please sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#ff3355]/10 border border-[#ff3355] rounded-lg p-4">
                <p className="text-[#ff3355] text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#c8d0dd] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#252b45] border border-[#3d4558] rounded-lg text-[#f5f7fa] placeholder-[#7b8599] focus:outline-none focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff] transition-colors"
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#c8d0dd] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#252b45] border border-[#3d4558] rounded-lg text-[#f5f7fa] placeholder-[#7b8599] focus:outline-none focus:border-[#00d9ff] focus:ring-1 focus:ring-[#00d9ff] transition-colors"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#00d9ff] text-[#0a0e1a] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-[#00d9ff] hover:underline text-sm">
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
