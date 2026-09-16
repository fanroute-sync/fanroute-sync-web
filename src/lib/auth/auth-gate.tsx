'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { restoreAccessToken } from '@/lib/api/client';

const publicPaths = new Set(['/login', '/onboarding/language', '/auth/callback']);

function subscribeToSessionChange(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth-session-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth-session-change', callback);
  };
}

function hasAccessToken() {
  return Boolean(localStorage.getItem('accessToken'));
}

function subscribeToHydration() {
  return () => undefined;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const signedIn = useSyncExternalStore(subscribeToSessionChange, hasAccessToken, () => false);
  const [restoreAttempted, setRestoreAttempted] = useState(false);
  const protectedPath = !publicPaths.has(pathname);
  const needsLogin = hydrated && protectedPath && !signedIn && restoreAttempted;

  useEffect(() => {
    if (!hydrated || !protectedPath || signedIn || restoreAttempted || !process.env.NEXT_PUBLIC_API_BASE_URL) return;
    void restoreAccessToken().catch(() => undefined).finally(() => setRestoreAttempted(true));
  }, [hydrated, protectedPath, signedIn, restoreAttempted]);

  const shouldRedirectWithoutRefresh = hydrated && protectedPath && !signedIn && !process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (needsLogin || shouldRedirectWithoutRefresh) router.replace('/login');
  }, [needsLogin, shouldRedirectWithoutRefresh, router]);

  return protectedPath && (!hydrated || !signedIn) ? null : children;
}
