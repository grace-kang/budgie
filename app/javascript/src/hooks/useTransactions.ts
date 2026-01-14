import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Transaction, TransactionParams } from '../types';

export function useAllTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiFetch<Transaction[]>('/transactions'),
  });
}
export function useCreateTransaction(budgetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransactionParams) =>
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

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { transactionId: number; budgetId: number }) =>
      apiFetch<void>(`/budgets/${data.budgetId}/transactions/${data.transactionId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
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
      budget_id: number;
      description: string;
      amount: number;
      date: string;
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
