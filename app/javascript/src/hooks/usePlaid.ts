import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { PlaidAccount } from '../types';
import { useFeatureFlags } from './useFeatureFlags';

export function usePlaidAccounts() {
  const { data: featureFlags } = useFeatureFlags();
  return useQuery({
    queryKey: ['plaid-accounts'],
    queryFn: () => apiFetch<PlaidAccount[]>('/plaid/accounts'),
    enabled: featureFlags?.plaid_enabled ?? false,
  });
}

export function useCreateLinkToken() {
  return useQuery({
    queryKey: ['plaid-link-token'],
    queryFn: () =>
      apiFetch<{ link_token: string }>('/plaid/link_token', {
        method: 'POST',
      }),
    enabled: false, // Only fetch when explicitly called
  });
}

export function useExchangePlaidToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (publicToken: string) =>
      apiFetch<{ plaid_account: PlaidAccount }>('/plaid/exchange_token', {
        method: 'POST',
        body: JSON.stringify({ public_token: publicToken }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plaid-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useSyncPlaidAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      forceResync = false,
    }: {
      accountId: number;
      forceResync?: boolean;
    }) =>
      apiFetch<{ message: string }>(
        `/plaid/accounts/${accountId}/sync?force_resync=${forceResync}`,
        {
          method: 'POST',
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeletePlaidAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: number) =>
      apiFetch<{ message: string }>(`/plaid/accounts/${accountId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plaid-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
