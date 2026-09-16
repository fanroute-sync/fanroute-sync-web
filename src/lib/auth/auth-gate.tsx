'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';

const publicPaths = new Set(['/login', '/onboarding/language', '/auth/callback']);

function subscribeToSessionChange(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
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
  const protectedPath = !publicPaths.has(pathname);
  const needsLogin = hydrated && protectedPath && !signedIn;

  useEffect(() => {
    if (needsLogin) router.replace('/login');
  }, [needsLogin, router]);

  return protectedPath && (!hydrated || !signedIn) ? null : children;
}
