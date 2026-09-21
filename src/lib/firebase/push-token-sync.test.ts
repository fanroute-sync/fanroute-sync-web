import { afterEach, describe, expect, it, vi } from 'vitest';

import { isFirebaseMessagingConfigured } from '@/lib/firebase/client';
import { requestPushPermission } from '@/lib/firebase/push-token-sync';

vi.mock('@/lib/firebase/client', () => ({
  isFirebaseMessagingConfigured: vi.fn(() => true),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.mocked(isFirebaseMessagingConfigured).mockReturnValue(true);
});

describe('optional push permission before Google sign-in', () => {
  it('continues when the browser has no Notification API', async () => {
    vi.stubGlobal('Notification', undefined);
    Reflect.deleteProperty(window, 'Notification');

    await expect(requestPushPermission()).resolves.toBeUndefined();
  });

  it('continues when the browser rejects the permission request', async () => {
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: vi.fn().mockRejectedValue(new Error('Permission unavailable')),
    });

    await expect(requestPushPermission()).resolves.toBe('default');
  });

  it('requests permission in a supported browser', async () => {
    const requestPermission = vi.fn().mockResolvedValue('granted');
    vi.stubGlobal('Notification', { permission: 'default', requestPermission });

    await expect(requestPushPermission()).resolves.toBe('granted');
    expect(requestPermission).toHaveBeenCalledOnce();
  });

  it.each(['granted', 'denied'])('preserves an existing %s decision', async (permission) => {
    const requestPermission = vi.fn();
    vi.stubGlobal('Notification', { permission, requestPermission });

    await expect(requestPushPermission()).resolves.toBe(permission);
    expect(requestPermission).not.toHaveBeenCalled();
  });

  it('does not request permission when Firebase is not configured', async () => {
    vi.mocked(isFirebaseMessagingConfigured).mockReturnValue(false);
    const requestPermission = vi.fn();
    vi.stubGlobal('Notification', { permission: 'default', requestPermission });

    await expect(requestPushPermission()).resolves.toBe('default');
    expect(requestPermission).not.toHaveBeenCalled();
  });
});
