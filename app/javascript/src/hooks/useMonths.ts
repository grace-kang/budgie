import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { Month } from '../types';

export function useMonths() {
  return useQuery({
    queryKey: ['months'],
    queryFn: () => apiFetch<Month[]>('/months'),
  });
}
