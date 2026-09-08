import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, CreditCard, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Usage {
  used: number;
  limit: number | null;
  remaining: number | null;
}

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const response = await api.get<Usage>('/api/usage/current/');
      return response.data;
    },
  });

  const isPro = usage?.limit === null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="p-6 rounded-lg bg-surface border border-border mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Profile</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">{user?.username}</h3>
                <p className="text-text-muted">{user?.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-3 text-text-muted">
                <User className="w-5 h-5" />
                <span className="font-medium">Username:</span>
                <span>{user?.username}</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Member since:</span>
                <span>{formatDate()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Section */}
        <div className="p-6 rounded-lg bg-surface border border-border mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Subscription</h2>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-text-primary">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </p>
                <p className="text-sm text-text-muted">
                  {isPro ? 'Unlimited links' : `${usage?.limit || 100} links per month`}
                </p>
              </div>
            </div>
            {!isPro && (
              <button
                onClick={() => navigate('/billing')}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Upgrade to Pro
              </button>
            )}
            {isPro && (
              <div className="flex items-center gap-2 px-3 py-2 bg-success/10 rounded-lg">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-lg bg-surface border border-danger/30">
          <h2 className="text-lg font-semibold text-danger mb-4">Danger Zone</h2>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger font-medium rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
