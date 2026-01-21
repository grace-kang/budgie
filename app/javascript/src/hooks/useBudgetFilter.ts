import { useEffect } from 'react';
import { Budget } from '../types';
import { getFilteredBudgets } from '../helpers/budgets';

/**
 * Custom hook that automatically adjusts budgetId when date or budgets change
 * and the current budgetId is not valid for the filtered budgets.
 *
 * @param date - The date string to filter budgets by
 * @param budgets - The list of all budgets
 * @param budgetId - The current budgetId value (can be null)
 * @param setBudgetId - Function to update the budgetId state
 */
export function useBudgetFilter(
  date: string,
  budgets: Budget[],
  budgetId: number | null,
  setBudgetId: (updater: (current: number | null) => number | null) => void,
) {
  useEffect(() => {
    const filteredBudgets = getFilteredBudgets(budgets, date);
    if (filteredBudgets.length > 0 && budgetId !== null) {
      setBudgetId((currentBudgetId) => {
        // If currentBudgetId is null, keep it null (user explicitly selected no budget)
        if (currentBudgetId === null) {
          return null;
        }
        // Check if current budgetId is still valid for the filtered budgets
        const isCurrentBudgetValid = filteredBudgets.some((b) => b.id === currentBudgetId);
        if (!isCurrentBudgetValid) {
          return filteredBudgets[0].id;
        }
        return currentBudgetId;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, budgets]);
}
