import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Transaction, TransactionParams } from '../types';

export function useAllTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiFetch<Transaction[]>('/transactions'),
  });
}
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransactionParams) => {
      const endpoint = data.budget_id ? `/budgets/${data.budget_id}/transactions` : '/transactions';
      return apiFetch<Transaction>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ transaction: data }),
      });
    },
    onSuccess: (_, variables) => {
      if (variables.budget_id) {
        queryClient.invalidateQueries({ queryKey: ['budget', variables.budget_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { transactionId: number; budgetId?: number | null }) => {
      const endpoint = data.budgetId
        ? `/budgets/${data.budgetId}/transactions/${data.transactionId}`
        : `/transactions/${data.transactionId}`;
      return apiFetch<void>(endpoint, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: number;
      budget_id: number | null;
      description: string;
      amount: number;
      date: string;
    }) =>
      apiFetch<Transaction>(`/transactions/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({ transaction: data }),
      }),
    onSuccess: (_, variables) => {
      if (variables.budget_id) {
        queryClient.invalidateQueries({ queryKey: ['budget', variables.budget_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
