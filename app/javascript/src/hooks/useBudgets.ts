import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Budget, Month } from '../types';

export function useCreateBudget(monthId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; total: number }) =>
      apiFetch<Budget>(`/months/${monthId}/budgets`, {
        method: 'POST',
        body: JSON.stringify({ budget: data }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
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
      queryClient.invalidateQueries({ queryKey: ['months'] });
    },
  });
}
