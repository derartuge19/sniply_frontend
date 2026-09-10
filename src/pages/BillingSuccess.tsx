import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CheckCircle, Loader2, Clock } from 'lucide-react';

export default function BillingSuccess() {
  const [status, setStatus] = useState<'loading' | 'success' | 'timeout'>('loading');
  const [attempts, setAttempts] = useState(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProStatus = async () => {
      try {
        const response = await api.get('/api/usage/current/');
        const { limit } = response.data;

        // If limit is null, user is on Pro
        if (limit === null) {
          setStatus('success');
          // Invalidate usage cache so dashboard reflects Pro status
          queryClient.invalidateQueries({ queryKey: ['usage'] });
          return true;
        }

        return false;
      } catch (error) {
        return false;
      }
    };

    const pollForProStatus = async () => {
      let currentAttempts = 0;
      const maxAttempts = 5;
      const interval = 2000; // 2 seconds

      const poll = setInterval(async () => {
        currentAttempts++;
        setAttempts(currentAttempts);

        const isPro = await checkProStatus();

        if (isPro || currentAttempts >= maxAttempts) {
          clearInterval(poll);
          if (!isPro && currentAttempts >= maxAttempts) {
            setStatus('timeout');
          }
        }
      }, interval);

      return () => clearInterval(poll);
    };

    pollForProStatus();
  }, [queryClient]);

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto text-center">
        {status === 'loading' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
            
            <h1 className="text-3xl font-bold text-text-primary mb-2">Confirming your upgrade...</h1>
            <p className="text-text-muted mb-4">
              Please wait while we activate your Pro subscription.
            </p>
            <p className="text-sm text-text-muted">
              Checking... ({attempts}/5)
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>

            <h1 className="text-3xl font-bold text-text-primary mb-2">You're now on Pro!</h1>
            <p className="text-text-muted mb-8">
              Enjoy unlimited links and all Pro features.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="block w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/10 mb-6">
              <Clock className="w-10 h-10 text-warning" />
            </div>

            <h1 className="text-3xl font-bold text-text-primary mb-2">Upgrade is processing</h1>
            <p className="text-text-muted mb-8">
              Your upgrade is still processing — this can take a moment. Check your dashboard shortly.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="block w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
