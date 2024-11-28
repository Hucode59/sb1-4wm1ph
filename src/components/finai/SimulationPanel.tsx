import React, { useState } from 'react';
import { Calculator, TrendingDown, ArrowRight } from 'lucide-react';
import { useDashboardData } from '../../services/dashboardData';

export function SimulationPanel() {
  const [category, setCategory] = useState('loisirs');
  const [reductionPercent, setReductionPercent] = useState(10);
  const dashboardData = useDashboardData();

  const calculateSavings = () => {
    const monthlyExpenses = dashboardData.monthlyExpenses;
    const categoryExpenses = monthlyExpenses * 0.2; // Exemple: 20% des dépenses
    const potentialSavings = (categoryExpenses * reductionPercent) / 100;
    return potentialSavings;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Calculator className="w-5 h-5 text-blue-600 mr-2" />
        Simulation d'économies
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie de dépenses
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="loisirs">Loisirs</option>
            <option value="restauration">Restauration</option>
            <option value="shopping">Shopping</option>
            <option value="transport">Transport</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Réduction souhaitée (%)
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={reductionPercent}
            onChange={(e) => setReductionPercent(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>5%</span>
            <span>{reductionPercent}%</span>
            <span>50%</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium">Économies potentielles</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {calculateSavings().toLocaleString('fr-FR')}€ / mois
          </p>
          <p className="text-sm text-blue-800 mt-1">
            {(calculateSavings() * 12).toLocaleString('fr-FR')}€ / an
          </p>
        </div>
      </div>
    </div>
  );
}