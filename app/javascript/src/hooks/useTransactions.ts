import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Transaction } from '../types';

export function useAllTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiFetch<Transaction[]>('/transactions'),
  });
}
export function useCreateTransaction(budgetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { description: string; amount: number; date: string; month_id: number }) =>
      apiFetch<Transaction>(`/budgets/${budgetId}/transactions`, {
        method: 'POST',
        body: JSON.stringify({ transaction: data }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransaction(budgetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: number) =>
      apiFetch<void>(`/transactions/${transactionId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateTransaction(budgetId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: number;
      description?: string;
      amount?: number;
      date?: string;
      budget_id?: number;
      month_id?: number;
    }) =>
      apiFetch<Transaction>(`/transactions/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({ transaction: data }),
      }),
    onSuccess: (_, variables) => {
      if (budgetId) {
        queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
      }
      if (variables.budget_id) {
        queryClient.invalidateQueries({ queryKey: ['budget', variables.budget_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
