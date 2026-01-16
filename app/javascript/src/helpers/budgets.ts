import { Budget } from '../types';

/**
 * Filters budgets to only include those matching the selected date's month/year.
 * If no budgets exist for the selected month, returns all budgets with unique names.
 */
export const getFilteredBudgets = (budgets: Budget[], dateString: string): Budget[] => {
  const selectedDate = new Date(dateString);
  const selectedMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
  const selectedYear = selectedDate.getFullYear();

  const budgetsForMonth = budgets.filter((budget) => {
    return budget.month.month === selectedMonth && budget.month.year === selectedYear;
  });

  if (budgetsForMonth.length > 0) {
    return budgetsForMonth;
  }

  const uniqueBudgets = new Map<string, Budget>();
  budgets.forEach((budget) => {
    if (!uniqueBudgets.has(budget.name)) {
      uniqueBudgets.set(budget.name, budget);
    }
  });

  return Array.from(uniqueBudgets.values());
};
