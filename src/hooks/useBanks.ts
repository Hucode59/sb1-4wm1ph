import { useState, useEffect } from 'react';
import { Bank } from '../types/banking';

const mockBanks: Bank[] = [
  {
    id: 'bnp',
    name: 'BNP Paribas',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/bnpparibas.com',
    domain: 'mabanque.bnpparibas',
    ssoEnabled: true
  },
  {
    id: 'sg',
    name: 'Société Générale',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/societegenerale.fr',
    domain: 'particuliers.societegenerale.fr',
    ssoEnabled: true
  },
  {
    id: 'ca',
    name: 'Crédit Agricole',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/credit-agricole.fr',
    domain: 'credit-agricole.fr',
    ssoEnabled: true
  },
  {
    id: 'lcl',
    name: 'LCL',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/lcl.fr',
    domain: 'lcl.fr',
    ssoEnabled: true
  },
  {
    id: 'cm',
    name: 'Crédit Mutuel',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/creditmutuel.fr',
    domain: 'creditmutuel.fr',
    ssoEnabled: true
  },
  {
    id: 'bp',
    name: 'Banque Populaire',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/banquepopulaire.fr',
    domain: 'banquepopulaire.fr',
    ssoEnabled: true
  },
  {
    id: 'ce',
    name: 'Caisse d\'Épargne',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/caisse-epargne.fr',
    domain: 'caisse-epargne.fr',
    ssoEnabled: true
  },
  {
    id: 'hsbc',
    name: 'HSBC France',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/hsbc.fr',
    domain: 'hsbc.fr',
    ssoEnabled: true
  },
  {
    id: 'ing',
    name: 'ING Direct',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/ing.fr',
    domain: 'ing.fr',
    ssoEnabled: true
  },
  {
    id: 'bourso',
    name: 'Boursorama Banque',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/boursorama.com',
    domain: 'boursorama.com',
    ssoEnabled: true
  },
  {
    id: 'fortuneo',
    name: 'Fortuneo',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/fortuneo.fr',
    domain: 'fortuneo.fr',
    ssoEnabled: true
  },
  {
    id: 'hellobank',
    name: 'Hello Bank!',
    connectionMethod: 'OAuth 2.0',
    logoUrl: 'https://logo.clearbit.com/hellobank.fr',
    domain: 'hellobank.fr',
    ssoEnabled: true
  }
];

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBanks = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBanks(mockBanks);
      } catch (error) {
        console.error('Erreur lors du chargement des banques:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanks();
  }, []);

  return { banks, isLoading };
}