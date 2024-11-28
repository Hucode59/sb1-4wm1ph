import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDashboardData } from '../../services/dashboardData';

export function PerformanceReport() {
  const dashboardData = useDashboardData();

  const weeklyMetrics = {
    savings: {
      amount: 450,
      change: 15,
      trend: 'up'
    },
    expenses: {
      amount: 320,
      change: -10,
      trend: 'down'
    },
    goals: {
      completed: 2,
      total: 3
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold">Performance hebdomadaire</h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-500">Épargne</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-semibold">
                {weeklyMetrics.savings.amount}€
              </span>
              <div className={`flex items-center ${
                weeklyMetrics.savings.trend === 'up' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {weeklyMetrics.savings.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {weeklyMetrics.savings.change}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-500">Dépenses</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-semibold">
                {weeklyMetrics.expenses.amount}€
              </span>
              <div className={`flex items-center ${
                weeklyMetrics.expenses.trend === 'down'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {weeklyMetrics.expenses.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {weeklyMetrics.expenses.change}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Progression des objectifs
          </h3>
          <div className="space-y-2">
            {dashboardData.financialGoals.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.name}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Suggestions d'amélioration
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Augmentez votre épargne automatique de 50€</li>
            <li>• Réduisez vos dépenses de restauration de 15%</li>
            <li>• Revoyez vos abonnements mensuels</li>
          </ul>
        </div>
      </div>
    </div>
  );
}