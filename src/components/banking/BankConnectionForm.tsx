import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bank } from '../../types/banking';
import { Lock, Key, Loader, ArrowLeft } from 'lucide-react';
import { BankingService } from '../../services/banking';
import toast from 'react-hot-toast';

const bankCredentialsSchema = z.object({
  username: z.string().min(1, 'L\'identifiant est requis'),
  password: z.string().min(1, 'Le mot de passe est requis'),
  consentAccepted: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation'
  })
});

type BankCredentialsData = z.infer<typeof bankCredentialsSchema>;

interface BankConnectionFormProps {
  bank: Bank;
  onSubmit: (data: BankCredentialsData) => Promise<void>;
  onBack: () => void;
}

export function BankConnectionForm({ bank, onSubmit, onBack }: BankConnectionFormProps) {
  const [connectionMethod, setConnectionMethod] = useState<'credentials' | 'sso'>('sso');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BankCredentialsData>({
    resolver: zodResolver(bankCredentialsSchema),
    defaultValues: {
      consentAccepted: false
    }
  });

  const handleSSOLogin = async () => {
    try {
      setIsLoading(true);
      const bankingService = BankingService.getInstance();
      const authUrl = await bankingService.initiateSSO(bank);
      
      const ssoWindow = window.open(
        authUrl,
        'BankSSO',
        'width=600,height=800,menubar=no,toolbar=no,location=no'
      );

      if (!ssoWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      window.addEventListener('message', async (event) => {
        if (event.origin === window.location.origin && event.data?.type === 'BANK_SSO_COMPLETE') {
          try {
            const { code, state } = event.data;
            const account = await bankingService.handleCallback(code, state);
            ssoWindow.close();
            await onSubmit({
              username: 'sso-auth',
              password: 'sso-token',
              consentAccepted: true
            });
          } catch (error) {
            console.error('SSO callback error:', error);
            toast.error('Erreur lors de la connexion bancaire');
          }
        }
      });
    } catch (error) {
      console.error('SSO error:', error);
      toast.error('Erreur lors de l\'initialisation de la connexion SSO');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (data: BankCredentialsData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la liste des banques
      </button>

      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setConnectionMethod('sso')}
          disabled={isLoading}
          className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center space-x-2 transition ${
            connectionMethod === 'sso'
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Lock className="w-5 h-5" />
          <span>Connexion SSO</span>
        </button>
        <button
          type="button"
          onClick={() => setConnectionMethod('credentials')}
          disabled={isLoading}
          className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center space-x-2 transition ${
            connectionMethod === 'credentials'
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Key className="w-5 h-5" />
          <span>Identifiants</span>
        </button>
      </div>

      {connectionMethod === 'sso' ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Connectez-vous de manière sécurisée via le portail de votre banque
          </p>
          <button
            onClick={handleSSOLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Se connecter avec {bank.name}</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleCredentialsSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identifiant
            </label>
            <input
              type="text"
              {...register('username')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              {...register('consentAccepted')}
              className="mt-1"
              disabled={isLoading}
            />
            <label className="text-sm text-gray-600">
              J'autorise SmartFinAI à accéder à mes données bancaires conformément aux{' '}
              <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a>
            </label>
          </div>
          {errors.consentAccepted && (
            <p className="text-sm text-red-600">{errors.consentAccepted.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}