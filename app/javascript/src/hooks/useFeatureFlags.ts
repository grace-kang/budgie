import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';

interface FeatureFlags {
  plaid_enabled: boolean;
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: () => apiFetch<FeatureFlags>('/feature_flags'),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
