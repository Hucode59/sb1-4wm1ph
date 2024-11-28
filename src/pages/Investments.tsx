import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  Coins, 
  Plus,
  Download,
  FileText,
  Table
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReportGenerator } from '../services/reports';
import { useDashboardData } from '../services/dashboardData';
import toast from 'react-hot-toast';

interface Asset {
  id: string;
  name: string;
  type: 'stock' | 'crypto' | 'real_estate' | 'bonds';
  value: number;
  initialInvestment: number;
  performance: number;
  history: { date: string; value: number }[];
  risk: 'low' | 'medium' | 'high';
}

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Actions Tech',
    type: 'stock',
    value: 15000,
    initialInvestment: 12000,
    performance: 25,
    history: Array.from({ length: 12 }, (_, i) => ({
      date: `2023-${(i + 1).toString().padStart(2, '0')}`,
      value: 12000 * (1 + Math.random() * 0.5)
    })),
    risk: 'high'
  },
  {
    id: '2',
    name: 'Bitcoin',
    type: 'crypto',
    value: 8000,
    initialInvestment: 5000,
    performance: 60,
    history: Array.from({ length: 12 }, (_, i) => ({
      date: `2023-${(i + 1).toString().padStart(2, '0')}`,
      value: 5000 * (1 + Math.random() * 0.8)
    })),
    risk: 'high'
  },
  {
    id: '3',
    name: 'Immobilier Locatif',
    type: 'real_estate',
    value: 250000,
    initialInvestment: 200000,
    performance: 25,
    history: Array.from({ length: 12 }, (_, i) => ({
      date: `2023-${(i + 1).toString().padStart(2, '0')}`,
      value: 200000 * (1 + Math.random() * 0.3)
    })),
    risk: 'medium'
  },
  {
    id: '4',
    name: 'Obligations d\'État',
    type: 'bonds',
    value: 20000,
    initialInvestment: 19000,
    performance: 5.26,
    history: Array.from({ length: 12 }, (_, i) => ({
      date: `2023-${(i + 1).toString().padStart(2, '0')}`,
      value: 19000 * (1 + Math.random() * 0.1)
    })),
    risk: 'low'
  }
];

const assetTypeConfig = {
  stock: {
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Actions'
  },
  crypto: {
    icon: Coins,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Crypto'
  },
  real_estate: {
    icon: Building2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Immobilier'
  },
  bonds: {
    icon: DollarSign,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Obligations'
  }
};

const riskColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600'
};

export function InvestmentsPage() {
  const [assets] = useState<Asset[]>(mockAssets);
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '1y' | 'all'>('1y');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const dashboardData = useDashboardData();

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalInitialInvestment = assets.reduce((sum, asset) => sum + asset.initialInvestment, 0);
  const totalPerformance = ((totalValue - totalInitialInvestment) / totalInitialInvestment) * 100;

  const portfolioDistribution = assets.map(asset => ({
    name: asset.name,
    value: (asset.value / totalValue) * 100
  }));

  const handleExportPDF = () => {
    try {
      ReportGenerator.exportToPDF(dashboardData, 'monthly');
      toast.success('Rapport PDF généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const handleExportExcel = () => {
    try {
      ReportGenerator.exportToExcel(dashboardData);
      toast.success('Rapport Excel généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du fichier Excel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Mes investissements</h1>
            <div className="flex space-x-4">
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Table className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => toast.success('Fonctionnalité en développement')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvel investissement</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Valeur totale</h3>
            <p className="text-2xl font-bold text-gray-900">
              {totalValue.toLocaleString('fr-FR')}€
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Performance globale</h3>
            <div className="flex items-center">
              <p className={`text-2xl font-bold ${totalPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPerformance.toFixed(2)}%
              </p>
              {totalPerformance >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600 ml-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 ml-2" />
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Investissement initial</h3>
            <p className="text-2xl font-bold text-gray-900">
              {totalInitialInvestment.toLocaleString('fr-FR')}€
            </p>
          </div>
        </div>

        {/* Portfolio Chart */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Évolution du portefeuille</h2>
              <div className="flex space-x-2">
                {['1m', '3m', '1y', 'all'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period as any)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period === '1m' ? '1 mois' :
                     period === '3m' ? '3 mois' :
                     period === '1y' ? '1 an' : 'Tout'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedAsset?.history || mockAssets[0].history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')}€`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assets.map((asset) => {
            const AssetIcon = assetTypeConfig[asset.type].icon;
            const performance = ((asset.value - asset.initialInvestment) / asset.initialInvestment) * 100;

            return (
              <div
                key={asset.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${assetTypeConfig[asset.type].bgColor}`}>
                        <AssetIcon className={`w-6 h-6 ${assetTypeConfig[asset.type].color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                        <span className="text-sm text-gray-500">
                          {assetTypeConfig[asset.type].label}
                        </span>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${riskColors[asset.risk]}`}>
                      Risque {asset.risk === 'low' ? 'faible' : asset.risk === 'medium' ? 'moyen' : 'élevé'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Valeur actuelle</p>
                      <p className="text-lg font-semibold">
                        {asset.value.toLocaleString('fr-FR')}€
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Performance</p>
                      <div className="flex items-center">
                        <p className={`text-lg font-semibold ${
                          performance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {performance.toFixed(2)}%
                        </p>
                        {performance >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(asset.value / totalValue) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {((asset.value / totalValue) * 100).toFixed(1)}% du portefeuille
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}