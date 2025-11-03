import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Month } from '../types';

export function useMonths() {
  return useQuery({
    queryKey: ['months'],
    queryFn: () => apiFetch<Month[]>('/months'),
  });
}

export function useCreateMonth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { month: number; year: number }) =>
      apiFetch<Month>('/months', {
        method: 'POST',
        body: JSON.stringify({ month: data }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['months'] });
    },
  });
}
