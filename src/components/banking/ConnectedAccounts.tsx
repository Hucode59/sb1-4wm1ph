import React from 'react';
import { Building2, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { useBankAccounts } from '../../hooks/useBankAccounts';
import toast from 'react-hot-toast';

export function ConnectedAccounts() {
  const { accounts, isLoading, refreshAccounts, disconnectAccount } = useBankAccounts();

  const handleRefresh = async (accountId: string) => {
    try {
      await refreshAccounts(accountId);
      toast.success('Compte mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du compte');
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir déconnecter ce compte ?')) {
      try {
        await disconnectAccount(accountId);
        toast.success('Compte déconnecté avec succès');
      } catch (error) {
        toast.error('Erreur lors de la déconnexion du compte');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des comptes...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucun compte bancaire connecté</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {account.bankLogo ? (
                <img
                  src={account.bankLogo}
                  alt={account.bankName}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 text-blue-600" />
              )}
              <div>
                <h3 className="font-medium">{account.bankName}</h3>
                <p className="text-sm text-gray-500">
                  Dernière synchronisation : {new Date(account.lastSync).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRefresh(account.id)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                title="Rafraîchir"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDisconnect(account.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                title="Déconnecter"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {account.subAccounts.map((subAccount) => (
              <div
                key={subAccount.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-600">{subAccount.name}</p>
                <p className="text-lg font-semibold">
                  {subAccount.balance.toLocaleString('fr-FR')}€
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}