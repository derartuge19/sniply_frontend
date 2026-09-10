import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Copy, Download, Lock, Edit2, ExternalLink, BarChart2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LinkDetail {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  created_at: string;
  click_count: number;
  is_active: boolean;
}

interface Analytics {
  total_clicks: number;
  clicks_over_time: { day: string; count: number }[];
  top_referrers: { referrer: string; count: number }[];
}

export default function LinkDetail() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [qrError, setQrError] = useState('');
  const [editError, setEditError] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: link, isLoading: linkLoading } = useQuery({
    queryKey: ['link', id],
    queryFn: async () => {
      const response = await api.get<LinkDetail>(`/api/links/${id}/`);
      return response.data;
    },
  });

  // Update newUrl when link data changes
  useEffect(() => {
    if (link) {
      setNewUrl(link.original_url);
    }
  }, [link]);

  // Fetch QR code image
  useEffect(() => {
    let currentUrl: string | null = null;

    const fetchQrCode = async () => {
      try {
        const response = await api.get(`/api/links/${id}/qr/`, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(response.data);
        currentUrl = url;
        setQrImageUrl(url);
        setQrError('');
      } catch (error: any) {
        if (error.response?.status === 403) {
          setQrError('QR code generation is a Pro feature');
        } else {
          setQrError('Failed to load QR code');
        }
      }
    };

    fetchQrCode();

    // Cleanup: revoke object URL on unmount or when id changes
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [id]);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', id],
    queryFn: async () => {
      const response = await api.get<Analytics>(`/api/analytics/${id}/?days=30`);
      return response.data;
    },
  });

  const updateUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await api.patch<LinkDetail>(`/api/links/${id}/`, { original_url: url });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['link', id] });
      setEditingUrl(false);
      setEditError('');
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        setEditError('Editing destination URL is a Pro feature');
      } else {
        setEditError('Failed to update URL');
      }
    },
  });

  const handleCopy = () => {
    if (link) {
      const shortUrl = `${window.location.origin}/${link.short_code}`;
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQr = async () => {
    setQrError('');
    try {
      const response = await api.get(`/api/links/${id}/qr/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.setAttribute('download', `qr-${link?.short_code}.png`);
      document.body.appendChild(linkElement);
      linkElement.click();
      linkElement.remove();
    } catch (error: any) {
      if (error.response?.status === 403) {
        setQrError('QR code generation is a Pro feature');
      } else {
        setQrError('Failed to download QR code');
      }
    }
  };

  const handleSaveUrl = () => {
    if (newUrl.trim()) {
      updateUrlMutation.mutate(newUrl.trim());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatChartDate = (dateString: any) => {
    if (typeof dateString === 'string') {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
    return dateString;
  };

  if (linkLoading || analyticsLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface rounded w-1/4" />
            <div className="h-32 bg-surface rounded" />
            <div className="h-64 bg-surface rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center py-16">
          <p className="text-text-muted">Link not found</p>
        </div>
      </div>
    );
  }

  const shortUrl = link.short_url;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Links
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Link Info Card */}
          <div className="lg:col-span-2 p-6 rounded-lg bg-surface border border-border">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-accent text-lg">
                    {shortUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-surface/50 rounded transition-colors"
                  >
                    {copied ? (
                      <span className="text-success text-sm font-medium">Copied!</span>
                    ) : (
                      <Copy className="w-5 h-5 text-text-muted" />
                    )}
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-surface/50 rounded transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-text-muted" />
                  </a>
                </div>

                {editingUrl ? (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="flex-1 px-3 py-2 bg-bg border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={handleSaveUrl}
                      disabled={updateUrlMutation.isPending}
                      className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white text-sm font-medium rounded transition-colors"
                    >
                      {updateUrlMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingUrl(false);
                        setNewUrl(link.original_url);
                        setEditError('');
                      }}
                      className="px-4 py-2 bg-surface border border-border text-text-primary text-sm font-medium rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-text-muted text-sm truncate">
                      {link.original_url}
                    </p>
                    <button
                      onClick={() => setEditingUrl(true)}
                      className="p-1 hover:bg-surface/50 rounded transition-colors"
                      title="Edit destination (Pro)"
                    >
                      <Edit2 className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                )}
                {editError && (
                  <p className="text-warning text-sm mb-2">{editError}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4" />
                    {analytics?.total_clicks || 0} total clicks
                  </span>
                  <span>•</span>
                  <span>Created {formatDate(link.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="p-6 rounded-lg bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">QR Code</h3>
            <div className="aspect-square bg-bg rounded-lg flex items-center justify-center mb-4 border border-border">
              {qrError ? (
                <div className="text-center p-4">
                  <Lock className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted mb-2">{qrError}</p>
                  <Link to="/billing" className="text-accent text-sm hover:underline">
                    Upgrade to Pro
                  </Link>
                </div>
              ) : qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain rounded"
                />
              ) : (
                <div className="animate-pulse w-full h-full bg-surface rounded" />
              )}
            </div>
            <button
              onClick={handleDownloadQr}
              disabled={!!qrError}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border hover:border-accent disabled:border-border disabled:text-text-muted text-text-primary font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download QR
            </button>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="p-6 rounded-lg bg-surface border border-border mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Clicks Over Time (30 Days)</h3>
          {analytics && analytics.clicks_over_time.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.clicks_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f27" />
                <XAxis
                  dataKey="day"
                  tickFormatter={formatChartDate}
                  stroke="#a1a1aa"
                  fontSize={12}
                />
                <YAxis stroke="#a1a1aa" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141419',
                    border: '1px solid #1f1f27',
                    borderRadius: '8px',
                    color: '#f4f4f5',
                  }}
                  labelFormatter={formatChartDate}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-text-muted">
              No click data available yet
            </div>
          )}
        </div>

        {/* Top Referrers */}
        {analytics && analytics.top_referrers.length > 0 && (
          <div className="p-6 rounded-lg bg-surface border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Top Referrers</h3>
            <div className="space-y-3">
              {analytics.top_referrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-text-muted" />
                    <span className="text-text-primary">
                      {referrer.referrer || 'Direct'}
                    </span>
                  </div>
                  <span className="text-text-muted font-mono">{referrer.count} clicks</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
