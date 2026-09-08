import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    try {
      setIsLoading(true);
      setError('');
      await loginWithGoogle(response.credential);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // @ts-ignore - Google global
  window.handleGoogleSignIn = handleGoogleSignIn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
            <UserPlus className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create account</h1>
          <p className="text-text-muted">Start shortening links for free</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold rounded-lg transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-bg text-text-muted">Or continue with</span>
            </div>
          </div>

          <div className="mt-4">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
              <>
                <div
                  id="g_id_onload"
                  data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  data-callback="handleGoogleSignIn"
                  data-auto_prompt="false"
                ></div>
                <div
                  className="g_id_signin"
                  data-type="standard"
                  data-size="large"
                  data-theme="outline"
                  data-text="sign_up_with"
                  data-shape="rectangular"
                  data-logo_alignment="left"
                ></div>
              </>
            ) : (
              <div className="text-center text-text-muted text-sm">
                Google login is not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
