import { Link } from 'react-router-dom';
import { ArrowRight, Link2, BarChart3, Zap, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border mb-8">
            <Link2 className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-muted">The modern link shortener</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">
            Shorten links.
            <br />
            <span className="text-accent">Track clicks.</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Professional URL shortening with powerful analytics. 
            Perfect for marketers, developers, and businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-surface border border-border hover:border-accent text-text-primary font-semibold rounded-lg transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-surface border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Lightning Fast</h3>
              <p className="text-text-muted">
                Instant redirects with global CDN. Your links work everywhere, every time.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-surface border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Advanced Analytics</h3>
              <p className="text-text-muted">
                Track clicks, referrers, and trends over time. Know your audience.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-surface border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Secure & Reliable</h3>
              <p className="text-text-muted">
                Enterprise-grade security with 99.9% uptime. Your data is safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Simple Pricing</h2>
            <p className="text-text-muted">Start free, upgrade when you need more</p>
          </div>
          
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
              
              <Link
                to="/register"
                className="block w-full text-center px-6 py-3 bg-surface border border-border hover:border-accent text-text-primary font-semibold rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="p-8 rounded-xl bg-surface border-2 border-accent relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                Popular
              </div>
              
              <h3 className="text-2xl font-semibold text-text-primary mb-2">Pro</h3>
              <div className="text-4xl font-bold text-text-primary mb-6">$9<span className="text-lg text-text-muted font-normal">/month</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  Unlimited links
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  Advanced analytics
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  QR code generation
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  Edit destination URLs
                </li>
                <li className="flex items-center gap-3 text-text-muted">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  Custom domains
                </li>
              </ul>
              
              <Link
                to="/register"
                className="block w-full text-center px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-surface/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-4">Ready to get started?</h2>
          <p className="text-xl text-text-muted mb-8">
            Join thousands of users who trust Sniply for their link management
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
