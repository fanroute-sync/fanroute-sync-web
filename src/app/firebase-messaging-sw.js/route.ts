import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  const config = JSON.stringify({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  const script = `importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');\nimportScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js');\nfirebase.initializeApp(${config});\nconst messaging = firebase.messaging();\nmessaging.onBackgroundMessage((payload) => {\n  const notification = payload.notification || {};\n  self.registration.showNotification(notification.title || 'Troadie 알림', {\n    body: notification.body || '',\n  });\n});\n`;
  return new NextResponse(script, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Service-Worker-Allowed': '/' },
  });
}
