import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Users, DollarSign, TrendingUp, Percent, Activity } from 'lucide-react';

interface Revenue {
  total_users: number;
  pro_subscribers: number;
  mrr: number;
  conversion_rate: number;
  canceled_subscriptions: number;
}

interface User {
  id: number;
  email: string;
  username: string;
  date_joined: string;
  is_staff: boolean;
  plan_name: string;
  subscription_status: string;
}

interface Subscription {
  user_email: string;
  plan: string;
  status: string;
  current_period_end: string;
}

export default function AdminDashboard() {
  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const response = await api.get<Revenue>('/api/admin/revenue/');
      return response.data;
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/api/admin/users/');
      return response.data;
    },
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const response = await api.get<Subscription[]>('/api/admin/subscriptions/?status=active');
      return response.data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return 'bg-accent-admin/20 text-accent-admin';
      case 'free':
        return 'bg-surface border border-border text-text-muted';
      default:
        return 'bg-surface border border-border text-text-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'canceled':
        return 'bg-danger/20 text-danger';
      case 'trialing':
        return 'bg-accent/20 text-accent';
      default:
        return 'bg-surface border border-border text-text-muted';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
        <p className="text-text-muted mb-8">Overview of platform performance and user activity</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Total</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {revenueLoading ? '...' : revenue?.total_users || 0}
            </div>
            <p className="text-sm text-text-muted">Total Users</p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Subscribers</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {revenueLoading ? '...' : revenue?.pro_subscribers || 0}
            </div>
            <p className="text-sm text-text-muted">Pro Subscribers</p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Revenue</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {revenueLoading ? '...' : formatCurrency(revenue?.mrr || 0)}
            </div>
            <p className="text-sm text-text-muted">Monthly Recurring Revenue</p>
          </div>

          <div className="p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-accent-admin" />
              <span className="text-sm text-text-muted">Conversion</span>
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">
              {revenueLoading ? '...' : `${(revenue?.conversion_rate || 0).toFixed(1)}%`}
            </div>
            <p className="text-sm text-text-muted">Free to Pro Rate</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="p-6 rounded-lg bg-surface border border-border mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Users</h2>
          
          {usersLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-bg rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Username</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-bg/50">
                      <td className="py-3 px-4 text-text-primary">{user.email}</td>
                      <td className="py-3 px-4 text-text-primary">{user.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan_name)}`}>
                          {user.plan_name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.subscription_status)}`}>
                          {user.subscription_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted text-sm">{formatDate(user.date_joined)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Subscriptions Table */}
        <div className="p-6 rounded-lg bg-surface border border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Active Subscriptions</h2>
          
          {subscriptionsLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-bg rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">User Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Period End</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions?.map((sub, index) => (
                    <tr key={index} className="border-b border-border hover:bg-bg/50">
                      <td className="py-3 px-4 text-text-primary">{sub.user_email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(sub.plan)}`}>
                          {sub.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted text-sm">{formatDate(sub.current_period_end)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
