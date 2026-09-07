import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Check, Zap, BarChart3, Shield, Globe, ArrowRight, QrCode } from 'lucide-react';

export default function Billing() {
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<{ checkout_url: string }>('/api/billing/checkout/');
      return response.data.checkout_url;
    },
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
    },
  });

  const handleUpgrade = () => {
    checkoutMutation.mutate();
  };

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Instant redirects with global CDN' },
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Track clicks, referrers, and trends' },
    { icon: QrCode, title: 'QR Code Generation', description: 'Generate downloadable QR codes for any link' },
    { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security' },
    { icon: Globe, title: 'Custom Domains', description: 'Use your own branded domains' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Billing</h1>
        <p className="text-text-muted mb-8">Manage your subscription and plan</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="p-8 rounded-xl bg-surface border border-border">
            <h3 className="text-2xl font-semibold text-text-primary mb-2">Free</h3>
            <div className="text-4xl font-bold text-text-primary mb-6">$0<span className="text-lg text-text-muted font-normal">/month</span></div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-text-muted">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
                100 links per month
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
                Basic analytics
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
                Link management
              </li>
            </ul>
            
            <button
              disabled
              className="w-full px-6 py-3 bg-surface border border-border text-text-muted font-semibold rounded-lg cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>
          
          {/* Pro Plan */}
          <div className="p-8 rounded-xl bg-surface border-2 border-accent relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full">
              Upgrade
            </div>
            
            <h3 className="text-2xl font-semibold text-text-primary mb-2">Pro</h3>
            <div className="text-4xl font-bold text-text-primary mb-6">$9<span className="text-lg text-text-muted font-normal">/month</span></div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-text-muted">
                <Check className="w-5 h-5 text-success" />
                Unlimited links
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <Check className="w-5 h-5 text-success" />
                Advanced analytics
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <Check className="w-5 h-5 text-success" />
                QR code generation
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <Check className="w-5 h-5 text-success" />
                Edit destination URLs
              </li>
              <li className="flex items-center gap-3 text-text-muted">
                <Check className="w-5 h-5 text-success" />
                Custom domains
              </li>
            </ul>
            
            <button
              onClick={handleUpgrade}
              disabled={checkoutMutation.isPending}
              className="w-full px-6 py-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {checkoutMutation.isPending ? 'Processing...' : (
                <>
                  Upgrade to Pro
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Why Go Pro?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-6 rounded-lg bg-surface border border-border">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
