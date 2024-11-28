import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TimeFilter {
  label: string;
  value: 'month' | '3months' | 'year';
}

const timeFilters: TimeFilter[] = [
  { label: 'Dernier mois', value: 'month' },
  { label: '3 derniers mois', value: '3months' },
  { label: 'Dernière année', value: 'year' }
];

const generateData = (filter: TimeFilter['value']) => {
  const data = [];
  const now = new Date();
  let points = 0;
  
  switch (filter) {
    case 'month':
      points = 30;
      break;
    case '3months':
      points = 90;
      break;
    case 'year':
      points = 12;
      break;
  }

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    if (filter === 'year') {
      date.setMonth(now.getMonth() - i);
    } else {
      date.setDate(now.getDate() - i);
    }

    const baseValue = 10000;
    const randomVariation = Math.random() * 2000 - 1000;
    const expenses = -(baseValue * 0.3 + Math.random() * 1000);

    data.push({
      date: filter === 'year' 
        ? date.toLocaleDateString('fr-FR', { month: 'short' })
        : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      revenus: baseValue + randomVariation,
      depenses: expenses,
      solde: (baseValue + randomVariation) + expenses
    });
  }

  return data;
};

export function FinancialChart() {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter['value']>('month');
  const [data, setData] = useState(() => generateData('month'));

  const handleFilterChange = (filter: TimeFilter['value']) => {
    setSelectedFilter(filter);
    setData(generateData(filter));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Aperçu financier</h2>
        <div className="flex space-x-2">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(2)} €`}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenus"
              stroke="#10B981"
              name="Revenus"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="depenses"
              stroke="#EF4444"
              name="Dépenses"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="solde"
              stroke="#3B82F6"
              name="Solde"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}