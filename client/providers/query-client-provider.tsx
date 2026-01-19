'use client';

import {
  QueryClient,
  QueryClientProvider as QueryProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};

export default QueryClientProvider;
