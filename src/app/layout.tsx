'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient'; // Use @/ alias for src/
import { Provider } from 'react-redux';
import { store } from '@/store/store'; // Use @/ alias for src/
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>{children}</Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}