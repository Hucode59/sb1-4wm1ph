import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FinancialData, Transaction, FinancialGoal } from './dashboardData';

interface WeeklyReport {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  topExpenseCategories: { category: string; amount: number }[];
}

interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsProgress: number;
  goalProgress: { [key: string]: number };
  categoryBreakdown: { [key: string]: number };
}

export class ReportGenerator {
  private static formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  }

  private static formatDate(date: string): Date {
    return new Date(date);
  }

  private static getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  static generateWeeklyReport(data: FinancialData, weekNumber?: number): WeeklyReport {
    const currentDate = new Date();
    const targetWeek = weekNumber || this.getWeekNumber(currentDate);
    
    // Filtrer les transactions de la semaine
    const weekTransactions = data.recentTransactions.filter(tx => {
      const txDate = this.formatDate(tx.date);
      return this.getWeekNumber(txDate) === targetWeek;
    });

    const report: WeeklyReport = {
      weekNumber: targetWeek,
      startDate: weekTransactions[0]?.date || '',
      endDate: weekTransactions[weekTransactions.length - 1]?.date || '',
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      topExpenseCategories: []
    };

    // Calculer les totaux
    const categoryTotals: { [key: string]: number } = {};
    weekTransactions.forEach(tx => {
      if (tx.amount > 0) {
        report.totalIncome += tx.amount;
      } else {
        report.totalExpenses += Math.abs(tx.amount);
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + Math.abs(tx.amount);
      }
    });

    report.balance = report.totalIncome - report.totalExpenses;
    report.topExpenseCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return report;
  }

  static generateMonthlyReport(data: FinancialData, month?: number, year?: number): MonthlyReport {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth();
    const targetYear = year || currentDate.getFullYear();

    // Filtrer les transactions du mois
    const monthTransactions = data.recentTransactions.filter(tx => {
      const txDate = this.formatDate(tx.date);
      return txDate.getMonth() === targetMonth && txDate.getFullYear() === targetYear;
    });

    const report: MonthlyReport = {
      month: new Date(targetYear, targetMonth).toLocaleString('fr-FR', { month: 'long' }),
      year: targetYear,
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      savingsProgress: (data.savings / data.totalBalance) * 100,
      goalProgress: {},
      categoryBreakdown: {}
    };

    // Calculer les totaux et la répartition par catégorie
    monthTransactions.forEach(tx => {
      if (tx.amount > 0) {
        report.totalIncome += tx.amount;
      } else {
        report.totalExpenses += Math.abs(tx.amount);
        report.categoryBreakdown[tx.category] = (report.categoryBreakdown[tx.category] || 0) + Math.abs(tx.amount);
      }
    });

    report.balance = report.totalIncome - report.totalExpenses;

    // Calculer la progression des objectifs
    data.financialGoals.forEach(goal => {
      report.goalProgress[goal.name] = (goal.current / goal.target) * 100;
    });

    return report;
  }

  static exportToPDF(data: FinancialData, reportType: 'weekly' | 'monthly'): void {
    const doc = new jsPDF();
    const report = reportType === 'weekly' 
      ? this.generateWeeklyReport(data)
      : this.generateMonthlyReport(data);

    // En-tête
    doc.setFontSize(20);
    doc.text(`Rapport ${reportType === 'weekly' ? 'hebdomadaire' : 'mensuel'}`, 20, 20);
    doc.setFontSize(12);

    // Informations générales
    const generalInfo = [
      ['Solde total', this.formatCurrency(data.totalBalance)],
      ['Épargne', this.formatCurrency(data.savings)],
      ['Investissements', this.formatCurrency(data.investments)]
    ];

    doc.autoTable({
      head: [['Métrique', 'Valeur']],
      body: generalInfo,
      startY: 30
    });

    // Transactions
    const transactionsData = data.recentTransactions.map(tx => [
      tx.date,
      tx.description,
      tx.category,
      this.formatCurrency(tx.amount)
    ]);

    doc.autoTable({
      head: [['Date', 'Description', 'Catégorie', 'Montant']],
      body: transactionsData,
      startY: doc.lastAutoTable.finalY + 10
    });

    // Objectifs financiers
    const goalsData = data.financialGoals.map(goal => [
      goal.name,
      this.formatCurrency(goal.current),
      this.formatCurrency(goal.target),
      `${goal.progress}%`
    ]);

    doc.autoTable({
      head: [['Objectif', 'Actuel', 'Cible', 'Progression']],
      body: goalsData,
      startY: doc.lastAutoTable.finalY + 10
    });

    // Sauvegarder le PDF
    doc.save(`rapport_financier_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  static exportToExcel(data: FinancialData): void {
    const wb = XLSX.utils.book_new();

    // Feuille des transactions
    const transactionsWS = XLSX.utils.json_to_sheet(data.recentTransactions);
    XLSX.utils.book_append_sheet(wb, transactionsWS, 'Transactions');

    // Feuille des objectifs
    const goalsWS = XLSX.utils.json_to_sheet(data.financialGoals);
    XLSX.utils.book_append_sheet(wb, goalsWS, 'Objectifs');

    // Feuille de résumé
    const summary = [
      { Métrique: 'Solde total', Valeur: data.totalBalance },
      { Métrique: 'Dépenses mensuelles', Valeur: data.monthlyExpenses },
      { Métrique: 'Épargne', Valeur: data.savings },
      { Métrique: 'Investissements', Valeur: data.investments }
    ];
    const summaryWS = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Résumé');

    // Sauvegarder le fichier Excel
    XLSX.writeFile(wb, `rapport_financier_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}