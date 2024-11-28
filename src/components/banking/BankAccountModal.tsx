import React, { useState } from 'react';
import { X, Search, Building2 } from 'lucide-react';
import { useBankAccounts } from '../../hooks/useBankAccounts';
import { BankList } from './BankList';
import { BankConnectionForm } from './BankConnectionForm';
import { Bank } from '../../types/banking';
import toast from 'react-hot-toast';

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BankAccountModal({ isOpen, onClose }: BankAccountModalProps) {
  const [step, setStep] = useState<'select' | 'connect'>('select');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { connectBank } = useBankAccounts();

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setStep('connect');
  };

  const handleConnect = async (data: any) => {
    try {
      if (!selectedBank) return;
      
      await connectBank(selectedBank.id);
      toast.success('Compte bancaire connecté avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la connexion du compte');
      console.error('Erreur de connexion:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {step === 'select' ? 'Sélectionner votre banque' : 'Connexion bancaire'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'select' ? (
            <>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher votre banque..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <BankList
                searchTerm={searchTerm}
                onSelect={handleBankSelect}
              />
            </>
          ) : selectedBank && (
            <div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  {selectedBank.logoUrl ? (
                    <img
                      src={selectedBank.logoUrl}
                      alt={selectedBank.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedBank.name}</h3>
                  <p className="text-sm text-gray-500">
                    Connexion sécurisée via {selectedBank.connectionMethod}
                  </p>
                </div>
              </div>

              <BankConnectionForm
                bank={selectedBank}
                onSubmit={handleConnect}
                onBack={() => setStep('select')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}