import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  User, 
  Mail, 
  Lock, 
  Globe, 
  Shield, 
  History,
  Camera,
  Check,
  AlertCircle,
  Building2,
  Plus
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ConnectedAccounts } from '../components/banking/ConnectedAccounts';
import { BankAccountModal } from '../components/banking/BankAccountModal';
import toast from 'react-hot-toast';

// ... (rest of the imports and type definitions remain the same)

export function AccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'banking'>('personal');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // ... (rest of the form handling code remains the same)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Informations personnelles</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Sécurité</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('banking')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'banking'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Comptes bancaires</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'personal' ? (
              // ... (Personal information form remains the same)
              <div>Personal Info</div>
            ) : activeTab === 'security' ? (
              // ... (Security settings remain the same)
              <div>Security Settings</div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Comptes bancaires connectés</h2>
                  <button
                    onClick={() => setIsBankModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un compte</span>
                  </button>
                </div>
                <ConnectedAccounts />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bank Account Modal */}
      <BankAccountModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />
    </div>
  );
}