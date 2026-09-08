import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Subscription {
  user_email: string;
  plan: string;
  status: string;
  current_period_end: string;
}

interface Revenue {
  total_users: number;
  pro_subscribers: number;
  mrr: number;
  conversion_rate: number;
  canceled_subscriptions: number;
}

export default function AdminAnalytics() {
  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const response = await api.get<Subscription[]>('/api/admin/subscriptions/?status=active');
      return response.data;
    },
  });

  const { data: revenue, isLoading: revLoading } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const response = await api.get<Revenue>('/api/admin/revenue/');
      return response.data;
    },
  });

  // Prepare chart data
  const planDistribution = [
    { name: 'Pro', value: subscriptions?.filter(s => s.plan === 'Pro').length || 0, color: '#6366f1' },
    { name: 'Free', value: subscriptions?.filter(s => s.plan === 'Free').length || 0, color: '#a1a1aa' },
  ];

  const revenueData = [
    { name: 'MRR', value: revenue?.mrr || 0 },
    { name: 'Users', value: revenue?.total_users || 0 },
    { name: 'Pro', value: revenue?.pro_subscribers || 0 },
  ];

  const conversionData = [
    { name: 'Free', value: (revenue?.total_users || 0) - (revenue?.pro_subscribers || 0) },
    { name: 'Pro', value: revenue?.pro_subscribers || 0 },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Analytics</h1>
        <p className="text-text-muted mb-8">View subscription and user analytics</p>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Plan Distribution */}
          <div className="p-6 rounded-lg bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Plan Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Metrics */}
          <div className="p-6 rounded-lg bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Key Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f27" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141419',
                    border: '1px solid #1f1f27',
                    borderRadius: '8px',
                    color: '#f4f4f5',
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="p-6 rounded-lg bg-surface border border-border mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Conversion Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f27" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141419',
                  border: '1px solid #1f1f27',
                  borderRadius: '8px',
                  color: '#f4f4f5',
                }}
              />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subscriptions Table */}
        <div className="p-6 rounded-lg bg-surface border border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Active Subscriptions</h2>

          {subsLoading ? (
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sub.plan === 'Pro' ? 'bg-accent-admin/20 text-accent-admin' : 'bg-surface border border-border text-text-muted'
                        }`}>
                          {sub.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sub.status === 'active' ? 'bg-success/20 text-success' : 'bg-surface border border-border text-text-muted'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted text-sm">
                        {new Date(sub.current_period_end).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
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
