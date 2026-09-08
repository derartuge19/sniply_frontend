import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Users, DollarSign, TrendingUp, Activity, XCircle } from 'lucide-react';

interface Revenue {
  total_users: number;
  pro_subscribers: number;
  mrr: number;
  conversion_rate: number;
  canceled_subscriptions: number;
}

export default function AdminRevenue() {
  const { data: revenue, isLoading } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const response = await api.get<Revenue>('/api/admin/revenue/');
      return response.data;
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Revenue</h1>
        <p className="text-text-muted mb-8">Track platform revenue and subscription metrics</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Total</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {isLoading ? '...' : revenue?.total_users || 0}
            </div>
            <p className="text-sm text-text-muted">Total Users</p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Subscribers</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {isLoading ? '...' : revenue?.pro_subscribers || 0}
            </div>
            <p className="text-sm text-text-muted">Pro Subscribers</p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Revenue</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {isLoading ? '...' : formatCurrency(revenue?.mrr || 0)}
            </div>
            <p className="text-sm text-text-muted">Monthly Recurring Revenue</p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Conversion</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {isLoading ? '...' : `${(revenue?.conversion_rate || 0).toFixed(1)}%`}
            </div>
            <p className="text-sm text-text-muted">Free to Pro Rate</p>
          </div>
        </div>

        {/* Canceled Subscriptions */}
        <div className="p-6 rounded-lg bg-surface border border-border">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-6 h-6 text-danger" />
            <h2 className="text-xl font-semibold text-text-primary">Canceled Subscriptions</h2>
          </div>
          <div className="text-4xl font-bold text-text-primary">
            {isLoading ? '...' : revenue?.canceled_subscriptions || 0}
          </div>
          <p className="text-sm text-text-muted mt-2">Total canceled subscriptions (last 30 days)</p>
        </div>
      </div>
    </div>
  );
}
