'use client';

import { useEffect } from 'react';

import { registerPushToken } from '@/features/notification/api/push-token-service';
import { getFirebaseApp, isFirebaseMessagingConfigured } from '@/lib/firebase/client';

let messageListenerRegistered = false;

async function syncPushToken() {
  if (!isFirebaseMessagingConfigured() || !('Notification' in window) || !('serviceWorker' in navigator)
      || Notification.permission !== 'granted' || !localStorage.getItem('accessToken')) {
    return;
  }

  const [{ getMessaging, getToken, onMessage }, registration] = await Promise.all([
    import('firebase/messaging'),
    navigator.serviceWorker.register('/firebase-messaging-sw.js'),
  ]);
  const messaging = getMessaging(getFirebaseApp());
  const token = await getToken(messaging, {
    serviceWorkerRegistration: registration,
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });
  if (token) await registerPushToken(token);

  if (!messageListenerRegistered) {
    onMessage(messaging, (payload) => {
      if (Notification.permission !== 'granted') return;
      const notification = payload.notification;
      new Notification(notification?.title ?? 'Troadie 알림', {
        body: notification?.body ?? '',
      });
    });
    messageListenerRegistered = true;
  }
}

export async function requestPushPermission() {
  if (!('Notification' in window)) return;
  if (!isFirebaseMessagingConfigured() || Notification.permission !== 'default') {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    // Optional push permissions must not prevent Google sign-in.
    return Notification.permission;
  }
}

export function PushTokenSync() {
  useEffect(() => {
    const run = () => { void syncPushToken().catch(() => undefined); };
    run();
    window.addEventListener('auth-session-change', run);
    window.addEventListener('focus', run);
    return () => {
      window.removeEventListener('auth-session-change', run);
      window.removeEventListener('focus', run);
    };
  }, []);

  return null;
}
