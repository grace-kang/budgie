import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Budget } from '../types';

export function getBudget(budgetId: number) {
  return useQuery({
    queryKey: ['budget', budgetId],
    queryFn: () => apiFetch<Budget>(`/budgets/${budgetId}`),
  });
}

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => apiFetch<Budget[]>('/budgets'),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; total: number }) =>
      apiFetch<Budget>('/budgets', {
        method: 'POST',
        body: JSON.stringify({ budget: data }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (budgetId: number) =>
      apiFetch<void>(`/budgets/${budgetId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
    },
  });
}

export function useUpdateBudget(budgetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; total: number }) =>
      apiFetch<Budget>(`/budgets/${budgetId}`, {
        method: 'PUT',
        body: JSON.stringify({ budget: data }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
    },
  });
}

export function useUpdateCustomBudgetLimit(budgetId: number, monthId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (limit: number) =>
      apiFetch<Budget>(`/budgets/${budgetId}/custom_limits/${monthId}`, {
        method: 'PUT',
        body: JSON.stringify({ limit }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['months'] });
    },
  });
}
