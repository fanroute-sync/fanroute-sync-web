'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { Toaster } from 'sonner';

import { createQueryClient } from '@/lib/query/query-client';
import { AuthGate } from '@/lib/auth/auth-gate';
import { PushTokenSync } from '@/lib/firebase/push-token-sync';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>{children}</AuthGate>
      <PushTokenSync />
      <Toaster richColors position='top-center' />
    </QueryClientProvider>
  );
}
