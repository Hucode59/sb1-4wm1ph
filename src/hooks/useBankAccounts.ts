import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { BankAccount } from '../types/banking';
import toast from 'react-hot-toast';

export function useBankAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const loadAccounts = async () => {
      try {
        const q = query(
          collection(db, 'bankAccounts'),
          where('userId', '==', user.id)
        );
        
        const snapshot = await getDocs(q);
        const accountsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BankAccount[];
        
        setAccounts(accountsData);
      } catch (error) {
        console.error('Erreur lors du chargement des comptes:', error);
        toast.error('Erreur lors du chargement des comptes bancaires');
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [user]);

  const connectBank = async (bankId: string) => {
    // Ici, implémenter la logique de connexion avec l'API bancaire
    // Pour l'exemple, on simule une connexion réussie
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Compte bancaire connecté avec succès');
  };

  const refreshAccounts = async (accountId: string) => {
    try {
      const accountRef = doc(db, 'bankAccounts', accountId);
      await updateDoc(accountRef, {
        lastSync: new Date().toISOString()
      });
      
      // Ici, implémenter la logique de synchronisation avec l'API bancaire
      toast.success('Compte mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      await deleteDoc(doc(db, 'bankAccounts', accountId));
      setAccounts(prev => prev.filter(account => account.id !== accountId));
      toast.success('Compte déconnecté avec succès');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  return {
    accounts,
    isLoading,
    connectBank,
    refreshAccounts,
    disconnectAccount
  };
}