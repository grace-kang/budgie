import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Month } from '../types';

export function useMonths() {
  return useQuery({
    queryKey: ['months'],
    queryFn: () => apiFetch<Month[]>('/months'),
  });
}

export type CreateMonthParams = { month: number; year: number };

export function useCreateMonth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateMonthParams) =>
      apiFetch<Month>('/months', {
        method: 'POST',
        body: JSON.stringify({ month: params }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}
