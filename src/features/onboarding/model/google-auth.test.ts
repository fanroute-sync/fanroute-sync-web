import { beforeEach, describe, expect, it, vi } from 'vitest';

import { consumeGoogleOAuthState, createGoogleAuthorizationUrl, googleAuthResponseSchema } from './google-auth';

describe('Google OAuth', () => {
  beforeEach(() => sessionStorage.clear());

  it('creates a fresh state and validates it only once', () => {
    vi.stubGlobal('crypto', { randomUUID: vi.fn().mockReturnValueOnce('first-state').mockReturnValueOnce('second-state') });
    const first = new URL(createGoogleAuthorizationUrl('http://localhost:3000', 'public-client'));
    const second = new URL(createGoogleAuthorizationUrl('http://localhost:3000', 'public-client'));

    expect(first.searchParams.get('redirect_uri')).toBe('http://localhost:3000/auth/callback');
    expect(first.searchParams.get('state')).toBe('first-state');
    expect(second.searchParams.get('state')).toBe('second-state');
    expect(consumeGoogleOAuthState('first-state')).toBe(false);
    expect(consumeGoogleOAuthState('second-state')).toBe(false);
    vi.unstubAllGlobals();
  });

  it('accepts the current state once', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'current-state' });
    createGoogleAuthorizationUrl('https://sparkling-alfajores-f44fd5.netlify.app', 'public-client');
    expect(consumeGoogleOAuthState('current-state')).toBe(true);
    expect(consumeGoogleOAuthState('current-state')).toBe(false);
    vi.unstubAllGlobals();
  });

  it('requires a token and new-user flag in the success response', () => {
    const response = {
      success: true,
      status: 200,
      code: 'OK',
      message: '요청이 성공적으로 처리되었습니다.',
      data: { accessToken: 'token', tokenType: 'Bearer', expiresIn: 1800, userId: 1, newUser: true },
    };
    expect(googleAuthResponseSchema.parse(response).data.newUser).toBe(true);
    expect(googleAuthResponseSchema.safeParse({ ...response, data: { accessToken: 'token' } }).success).toBe(false);
  });
});
