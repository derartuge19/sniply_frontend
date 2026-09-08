import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface User {
  id: number;
  email: string;
  username: string;
  date_joined: string;
  is_staff: boolean;
  plan_name: string | null;
  subscription_status: string | null;
}

export default function AdminUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/api/admin/users/');
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

  const getPlanColor = (plan: string | null) => {
    if (!plan) return 'bg-surface border border-border text-text-muted';
    switch (plan.toLowerCase()) {
      case 'pro':
        return 'bg-accent-admin/20 text-accent-admin';
      case 'free':
        return 'bg-surface border border-border text-text-muted';
      default:
        return 'bg-surface border border-border text-text-muted';
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-surface border border-border text-text-muted';
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
        <h1 className="text-3xl font-bold text-text-primary mb-2">Users</h1>
        <p className="text-text-muted mb-8">Manage all platform users</p>

        <div className="p-6 rounded-lg bg-surface border border-border">
          {isLoading ? (
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Staff</th>
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
                          {user.plan_name || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.subscription_status)}`}>
                          {user.subscription_status || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.is_staff ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-admin/20 text-accent-admin">
                            Yes
                          </span>
                        ) : (
                          <span className="text-text-muted">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-text-muted text-sm">{formatDate(user.date_joined)}</td>
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
