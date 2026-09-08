import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function BillingCancel() {
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/10 mb-6">
          <XCircle className="w-10 h-10 text-warning" />
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-2">Checkout Cancelled</h1>
        <p className="text-text-muted mb-8">
          Checkout was cancelled — no charge was made.
        </p>

        <div className="space-y-3">
          <Link
            to="/billing"
            className="block w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </Link>
          <Link
            to="/dashboard"
            className="block w-full px-6 py-3 bg-surface border border-border hover:border-accent text-text-primary font-semibold rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
