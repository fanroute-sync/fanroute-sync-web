import { z } from 'zod';

export const googleAuthResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    accessToken: z.string().min(1),
    newUser: z.boolean(),
  }),
});

const oauthStateKey = 'googleOAuthState';

export function createGoogleAuthorizationUrl(origin: string, clientId: string): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(oauthStateKey, state);

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${origin}/auth/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  return url.toString();
}

export function consumeGoogleOAuthState(receivedState: string | null): boolean {
  const expectedState = sessionStorage.getItem(oauthStateKey);
  sessionStorage.removeItem(oauthStateKey);
  return Boolean(receivedState && expectedState && receivedState === expectedState);
}
