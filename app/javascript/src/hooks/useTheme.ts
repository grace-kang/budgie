import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../apiClient';
import { useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'pink';

type PreferencesResponse = {
  preferences: {
    theme?: Theme;
  };
};

export function useTheme() {
  const queryClient = useQueryClient();

  // Fetch user preferences
  const { data, isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => apiFetch<PreferencesResponse>('/user/preferences'),
    enabled: !!localStorage.getItem('jwt'), // Only fetch if user is authenticated
  });

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: (theme: Theme) =>
      apiFetch<PreferencesResponse>('/user/preferences', {
        method: 'PATCH',
        body: JSON.stringify({ preferences: { theme } }),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(['preferences'], data);
      applyTheme(data.preferences.theme || 'light');
    },
  });

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Apply default theme on mount
  useEffect(() => {
    applyTheme('light'); // Default theme
  }, []);

  // Load theme on mount and when data changes
  useEffect(() => {
    if (data?.preferences?.theme) {
      applyTheme(data.preferences.theme);
    }
  }, [data]);

  // Set theme function
  const setTheme = (theme: Theme) => {
    applyTheme(theme); // Apply immediately for better UX
    updateThemeMutation.mutate(theme);
  };

  const currentTheme = (data?.preferences?.theme || 'light') as Theme;

  return {
    theme: currentTheme,
    setTheme,
    isLoading,
  };
}

