'use client';

import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseMessagingConfigured() {
  return Boolean(
      firebaseConfig.apiKey
      && firebaseConfig.authDomain
      && firebaseConfig.projectId
      && firebaseConfig.messagingSenderId
      && firebaseConfig.appId
      && process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  );
}

export function getFirebaseApp() {
  if (!isFirebaseMessagingConfigured()) {
    throw new Error('FIREBASE_MESSAGING_NOT_CONFIGURED');
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
