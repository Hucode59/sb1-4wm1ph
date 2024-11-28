import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Wallet, PiggyBank, TrendingUp, Bell, Brain, Plus } from 'lucide-react';
import { FinancialChart } from '../components/dashboard/FinancialChart';
import { AiCoachChat } from '../components/dashboard/AiCoachChat';
import { Reports } from '../components/dashboard/Reports';
import { NewGoalModal } from '../components/dashboard/NewGoalModal';
import { BankAccountModal } from '../components/banking/BankAccountModal';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user } = useAuth();
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const quickActions = [
    { 
      icon: Wallet, 
      label: 'Ajouter un compte', 
      color: 'text-blue-600',
      action: () => setIsBankModalOpen(true)
    },
    { 
      icon: PiggyBank, 
      label: 'Nouvel objectif', 
      color: 'text-green-600',
      action: () => setIsNewGoalModalOpen(true)
    },
    { 
      icon: TrendingUp, 
      label: 'Investir', 
      color: 'text-purple-600',
      action: () => toast.success('Fonctionnalité en développement')
    },
    { 
      icon: Brain, 
      label: 'Coach FinAI', 
      color: 'text-indigo-600',
      action: () => {
        const event = new CustomEvent('openAiCoach');
        window.dispatchEvent(event);
      }
    },
    { 
      icon: Plus, 
      label: 'Nouvelle opération', 
      color: 'text-orange-600',
      action: () => toast.success('Fonctionnalité en développement')
    },
  ];

  const stats = [
    { label: 'Solde total', value: '25 430 €', change: '+5.2%', trend: 'up' },
    { label: 'Dépenses du mois', value: '2 150 €', change: '-2.1%', trend: 'down' },
    { label: 'Épargne', value: '8 320 €', change: '+12.3%', trend: 'up' },
    { label: 'Investissements', value: '15 000 €', change: '+8.7%', trend: 'up' },
  ];

  const recentTransactions = [
    { id: 1, description: 'Supermarché', amount: -82.50, date: '2024-02-20', category: 'Alimentation' },
    { id: 2, description: 'Salaire', amount: 2800.00, date: '2024-02-15', category: 'Revenus' },
    { id: 3, description: 'Netflix', amount: -17.99, date: '2024-02-14', category: 'Loisirs' },
    { id: 4, description: 'EDF', amount: -75.30, date: '2024-02-10', category: 'Factures' },
  ];

  const handleNewGoal = (data: any) => {
    console.log('Nouvel objectif:', data);
    toast.success('Objectif créé avec succès !');
    setIsNewGoalModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-6 h-6" />
              </button>
              <img
                src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + user?.displayName}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition group"
                onClick={action.action}
              >
                <action.icon className={`w-8 h-8 mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Reports Section */}
        <div className="mb-8">
          <Reports />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <FinancialChart />

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} €
                        </p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Financial Goals */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Objectifs financiers</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Épargne vacances</span>
                    <span className="text-sm text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fond d'urgence</span>
                    <span className="text-sm text-gray-500">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Coach Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Conseils FinAI</h2>
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-900">
                    Vos dépenses en restauration ont augmenté de 15% ce mois-ci. Souhaitez-vous établir un budget pour cette catégorie ?
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900">
                    Excellent ! Vous avez économisé 200€ ce mois-ci. Continuez ainsi pour atteindre votre objectif d'épargne.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Coach Chat */}
      <AiCoachChat />

      {/* Modals */}
      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        onSubmit={handleNewGoal}
      />

      <BankAccountModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />
    </div>
  );
}