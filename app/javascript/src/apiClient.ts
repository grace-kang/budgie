const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`,
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  // For 204 No Content (e.g., delete)
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}
