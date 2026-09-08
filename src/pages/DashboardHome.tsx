import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Copy, Trash2, ExternalLink, BarChart2, ToggleLeft, ToggleRight, Link2 } from 'lucide-react';

interface LinkItem {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  created_at: string;
  click_count: number;
  is_active: boolean;
}

interface Usage {
  used: number;
  limit: number | null;
  remaining: number | null;
}

export default function DashboardHome() {
  const [newUrl, setNewUrl] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [upgradePrompt, setUpgradePrompt] = useState('');
  const queryClient = useQueryClient();

  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await api.get<LinkItem[]>('/api/links/');
      return response.data;
    },
  });

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const response = await api.get<Usage>('/api/usage/current/');
      return response.data;
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await api.post<LinkItem>('/api/links/', { original_url: url });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
      setNewUrl('');
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        setUpgradePrompt(error.response?.data?.detail || 'Upgrade to Pro to create more links');
      }
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/links/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
    },
  });

  const toggleLinkMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      const response = await api.patch<LinkItem>(`/api/links/${id}/`, { is_active: !is_active });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim()) {
      setUpgradePrompt('');
      createLinkMutation.mutate(newUrl.trim());
    }
  };

  const handleCopy = (shortUrl: string, id: number) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteLinkMutation.mutate(id);
    }
  };

  const handleToggle = (id: number, is_active: boolean) => {
    toggleLinkMutation.mutate({ id, is_active });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateUrl = (url: string, maxLength: number) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + '...';
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Links</h1>

        {/* Create Link Form */}
        <form onSubmit={handleCreateLink} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Paste your URL here..."
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors pr-12"
              />
              <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            </div>
            <button
              type="submit"
              disabled={createLinkMutation.isPending}
              className="px-6 py-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {createLinkMutation.isPending ? 'Creating...' : 'Shorten'}
            </button>
          </div>

          {upgradePrompt && (
            <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/20 text-warning">
              <p className="font-medium mb-2">{upgradePrompt}</p>
              <Link to="/billing" className="text-accent hover:underline font-medium">
                Upgrade to Pro →
              </Link>
            </div>
          )}
        </form>

        {/* Usage Bar */}
        {usage && (
          <div className="mb-8 p-4 rounded-lg bg-surface border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">
                {usage.limit === null ? 'Unlimited' : `${usage.used} of ${usage.limit} links used this month`}
              </span>
              <span className="text-sm font-medium text-text-primary">
                {usage.limit === null ? 'Pro Plan' : `${usage.remaining} remaining`}
              </span>
            </div>
            {usage.limit !== null && (
              <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(usage.used / usage.limit) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Links List */}
        {linksLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-lg bg-surface border border-border animate-pulse">
                <div className="h-6 bg-bg rounded w-1/3 mb-4" />
                <div className="h-4 bg-bg rounded w-1/2 mb-2" />
                <div className="h-4 bg-bg rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : links && links.length > 0 ? (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className={`p-6 rounded-lg bg-surface border border-border transition-all ${
                  !link.is_active ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-accent text-sm">
                        {link.short_url}
                      </span>
                      <button
                        onClick={() => handleCopy(link.short_url, link.id)}
                        className="p-1.5 hover:bg-surface/50 rounded transition-colors group relative"
                      >
                        {copiedId === link.id ? (
                          <span className="text-success text-xs font-medium">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4 text-text-muted group-hover:text-text-primary" />
                        )}
                      </button>
                      <a
                        href={link.short_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-surface/50 rounded transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-text-muted hover:text-text-primary" />
                      </a>
                    </div>
                    
                    <p className="text-text-muted text-sm mb-3 truncate">
                      {truncateUrl(link.original_url, 60)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4" />
                        {link.click_count} clicks
                      </span>
                      <span>•</span>
                      <span>{formatDate(link.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(link.id, link.is_active)}
                      className="p-2 hover:bg-surface/50 rounded transition-colors"
                      title={link.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {link.is_active ? (
                        <ToggleRight className="w-5 h-5 text-success" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-text-muted" />
                      )}
                    </button>
                    
                    <Link
                      to={`/links/${link.id}`}
                      className="p-2 hover:bg-surface/50 rounded transition-colors"
                      title="View Analytics"
                    >
                      <BarChart2 className="w-5 h-5 text-text-muted hover:text-text-primary" />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 hover:bg-danger/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-text-muted hover:text-danger" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-border mb-4">
              <Link2 className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No links yet</h3>
            <p className="text-text-muted mb-6">Create your first shortened link to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
