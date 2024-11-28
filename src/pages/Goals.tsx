import React, { useState } from 'react';
import { Target, Plus, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { NewGoalModal } from '../components/dashboard/NewGoalModal';
import toast from 'react-hot-toast';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'debt';
  priority: 'low' | 'medium' | 'high';
  status: 'ahead' | 'onTrack' | 'behind';
  monthlyTarget: number;
  suggestions: string[];
}

const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Voyage au Japon',
    targetAmount: 5000,
    currentAmount: 3750,
    deadline: '2024-12-31',
    category: 'savings',
    priority: 'high',
    status: 'ahead',
    monthlyTarget: 500,
    suggestions: [
      'Réduire les dépenses en restauration de 100€/mois',
      'Mettre en place un virement automatique de 500€/mois'
    ]
  },
  {
    id: '2',
    name: 'Fond d\'urgence',
    targetAmount: 10000,
    currentAmount: 4500,
    deadline: '2024-09-30',
    category: 'savings',
    priority: 'medium',
    status: 'behind',
    monthlyTarget: 1000,
    suggestions: [
      'Économiser 20% sur les loisirs',
      'Optimiser les abonnements mensuels'
    ]
  }
];

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-purple-100 text-purple-800'
};

const statusConfig = {
  ahead: {
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    label: 'En avance'
  },
  onTrack: {
    icon: CheckCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    label: 'Dans les temps'
  },
  behind: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    label: 'En retard'
  }
};

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'savings' | 'debt'>('all');

  const handleNewGoal = (data: any) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      deadline: data.deadline,
      category: data.category,
      priority: data.priority,
      status: 'onTrack',
      monthlyTarget: data.targetAmount / calculateMonthsDifference(new Date(), new Date(data.deadline)),
      suggestions: [
        'Définir un virement automatique mensuel',
        'Analyser les dépenses pour optimiser l\'épargne'
      ]
    };

    setGoals([...goals, newGoal]);
    toast.success('Nouvel objectif créé avec succès !');
    setIsNewGoalModalOpen(false);
  };

  const calculateMonthsDifference = (startDate: Date, endDate: Date) => {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
           (endDate.getMonth() - startDate.getMonth());
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  const filteredGoals = goals.filter(goal => 
    selectedFilter === 'all' ? true : goal.category === selectedFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Mes objectifs</h1>
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvel objectif</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setSelectedFilter('savings')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === 'savings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Épargne
          </button>
          <button
            onClick={() => setSelectedFilter('debt')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedFilter === 'debt'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Remboursement
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const StatusIcon = statusConfig[goal.status].icon;

            return (
              <div key={goal.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}>
                          {goal.priority === 'low' ? 'Faible' : goal.priority === 'medium' ? 'Moyenne' : 'Élevée'}
                        </span>
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[goal.status].bgColor} ${statusConfig[goal.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig[goal.status].label}</span>
                        </span>
                      </div>
                    </div>
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{goal.currentAmount.toLocaleString('fr-FR')}€</span>
                      <span>{goal.targetAmount.toLocaleString('fr-FR')}€</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        Progression : {progress}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Échéance : {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {/* Monthly Target */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Objectif mensuel : {goal.monthlyTarget.toLocaleString('fr-FR')}€
                    </p>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Suggestions d'optimisation :</h4>
                    <ul className="space-y-1">
                      {goal.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* New Goal Modal */}
      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        onSubmit={handleNewGoal}
      />
    </div>
  );
}