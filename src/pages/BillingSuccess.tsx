import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function BillingSuccess() {
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-2">Payment Successful!</h1>
        <p className="text-text-muted mb-8">
          You now have access to all Pro features. Enjoy unlimited links and advanced analytics.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="block w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/settings"
            className="block w-full px-6 py-3 bg-surface border border-border hover:border-accent text-text-primary font-semibold rounded-lg transition-colors"
          >
            View Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
