import { useState, useEffect } from 'react';

export interface FinancialData {
  totalBalance: number;
  monthlyExpenses: number;
  savings: number;
  investments: number;
  recentTransactions: Transaction[];
  financialGoals: FinancialGoal[];
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface FinancialGoal {
  name: string;
  target: number;
  current: number;
  progress: number;
}

// Singleton pour stocker les données du tableau de bord
class DashboardStore {
  private static instance: DashboardStore;
  private data: FinancialData = {
    totalBalance: 25430,
    monthlyExpenses: 2150,
    savings: 8320,
    investments: 15000,
    recentTransactions: [
      { id: 1, description: 'Supermarché', amount: -82.50, date: '2024-02-20', category: 'Alimentation' },
      { id: 2, description: 'Salaire', amount: 2800.00, date: '2024-02-15', category: 'Revenus' },
      { id: 3, description: 'Netflix', amount: -17.99, date: '2024-02-14', category: 'Loisirs' },
      { id: 4, description: 'EDF', amount: -75.30, date: '2024-02-10', category: 'Factures' }
    ],
    financialGoals: [
      { name: 'Épargne vacances', target: 3000, current: 2250, progress: 75 },
      { name: 'Fond d\'urgence', target: 10000, current: 4500, progress: 45 }
    ]
  };

  private constructor() {}

  public static getInstance(): DashboardStore {
    if (!DashboardStore.instance) {
      DashboardStore.instance = new DashboardStore();
    }
    return DashboardStore.instance;
  }

  public getData(): FinancialData {
    return this.data;
  }

  public updateData(newData: Partial<FinancialData>) {
    this.data = { ...this.data, ...newData };
  }
}

export const useDashboardData = () => {
  const [data, setData] = useState<FinancialData>(DashboardStore.getInstance().getData());

  useEffect(() => {
    // Mise à jour des données si nécessaire
    const store = DashboardStore.getInstance();
    setData(store.getData());
  }, []);

  return data;
};

export const getDashboardDataForAI = (): string => {
  const data = DashboardStore.getInstance().getData();
  return `Voici vos informations financières actuelles :

1. Situation globale :
   - Solde total : ${data.totalBalance.toLocaleString('fr-FR')}€
   - Dépenses mensuelles : ${data.monthlyExpenses.toLocaleString('fr-FR')}€
   - Épargne : ${data.savings.toLocaleString('fr-FR')}€
   - Investissements : ${data.investments.toLocaleString('fr-FR')}€

2. Objectifs financiers :
${data.financialGoals.map(goal => 
  `   - ${goal.name} : ${goal.progress}% (${goal.current.toLocaleString('fr-FR')}€ sur ${goal.target.toLocaleString('fr-FR')}€)`
).join('\n')}

3. Transactions récentes :
${data.recentTransactions.map(tx => 
  `   - ${tx.date} : ${tx.description} (${tx.amount.toLocaleString('fr-FR')}€) - ${tx.category}`
).join('\n')}`;
};