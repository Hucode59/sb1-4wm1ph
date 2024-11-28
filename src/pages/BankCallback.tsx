import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function BankCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Erreur lors de la connexion bancaire');
      window.close();
      return;
    }

    if (code && state) {
      // Send message to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'BANK_SSO_COMPLETE',
          code,
          state
        }, window.location.origin);
        
        // Close the popup after a short delay
        setTimeout(() => window.close(), 1000);
      } else {
        // If opened in main window, redirect back to dashboard
        navigate('/dashboard');
      }
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Finalisation de la connexion bancaire...</p>
      </div>
    </div>
  );
}