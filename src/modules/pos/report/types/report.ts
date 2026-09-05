export interface ReportSummary {
  // =========================
  // GLOBAL
  // =========================

  totalSales: number;

  totalOtherIncome: number;

  totalExpense: number;

  remainingDebt: number;

  netBalance: number;

  // =========================
  // BULAN TERPILIH
  // =========================

  monthlySales: number;

  monthlyOtherIncome: number;

  monthlyExpense: number;

  monthlyNewDebt: number;

  monthlyDebtPayment: number;

  monthlyRemainingDebt: number;

  monthlyNetBalance: number;
}