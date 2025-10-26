import { QueryClient } from "@tanstack/react-query";

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const message = await response.text();
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        return fetchWithErrorHandling(url);
      },
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export async function apiRequest(
  url: string,
  options?: RequestInit
): Promise<any> {
  return fetchWithErrorHandling(url, options);
}
