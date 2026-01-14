import { Budget } from '../types';

/**
 * Filters budgets to only include those matching the selected date's month/year
 */
export const getFilteredBudgets = (budgets: Budget[], dateString: string): Budget[] => {
  const selectedDate = new Date(dateString);
  const selectedMonth = selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
  const selectedYear = selectedDate.getFullYear();

  return budgets.filter((budget) => {
    return budget.month.month === selectedMonth && budget.month.year === selectedYear;
  });
};
