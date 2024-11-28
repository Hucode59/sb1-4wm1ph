import React, { useState } from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { ReportGenerator } from '../../services/reports';
import { useDashboardData } from '../../services/dashboardData';
import toast from 'react-hot-toast';

export function Reports() {
  const data = useDashboardData();
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly'>('monthly');

  const handleExportPDF = () => {
    try {
      ReportGenerator.exportToPDF(data, selectedPeriod);
      toast.success('Rapport PDF généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };

  const handleExportExcel = () => {
    try {
      ReportGenerator.exportToExcel(data);
      toast.success('Rapport Excel généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du fichier Excel');
      console.error(error);
    }
  };

  const report = selectedPeriod === 'weekly'
    ? ReportGenerator.generateWeeklyReport(data)
    : ReportGenerator.generateMonthlyReport(data);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Rapports Financiers</h2>
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'weekly' | 'monthly')}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
          </select>
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
        </div>
      </div>

      <div className="space-y-6">
        {selectedPeriod === 'weekly' ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Revenus</h3>
                <p className="text-2xl font-semibold text-green-600">
                  {report.totalIncome.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Dépenses</h3>
                <p className="text-2xl font-semibold text-red-600">
                  {report.totalExpenses.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                <p className={`text-2xl font-semibold ${report.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {report.balance.toLocaleString('fr-FR')}€
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Top 5 des dépenses par catégorie</h3>
              <div className="space-y-2">
                {report.topExpenseCategories.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{category.category}</span>
                    <span className="font-medium">{category.amount.toLocaleString('fr-FR')}€</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Revenus du mois</h3>
                <p className="text-2xl font-semibold text-green-600">
                  {report.totalIncome.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Dépenses du mois</h3>
                <p className="text-2xl font-semibold text-red-600">
                  {report.totalExpenses.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                <p className={`text-2xl font-semibold ${report.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {report.balance.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Progression épargne</h3>
                <p className="text-2xl font-semibold text-blue-600">
                  {report.savingsProgress.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Progression des objectifs</h3>
                <div className="space-y-2">
                  {Object.entries(report.goalProgress).map(([goal, progress], index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{goal}</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Répartition des dépenses</h3>
                <div className="space-y-2">
                  {Object.entries(report.categoryBreakdown).map(([category, amount], index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{category}</span>
                      <span className="font-medium">{amount.toLocaleString('fr-FR')}€</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}