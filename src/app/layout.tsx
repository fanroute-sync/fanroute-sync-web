import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '@/app/providers';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fan Route Sync',
  description: '공연 전후 부산 여행 일정을 추천하고 공유하는 팬덤 관광 서비스',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='ko' className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className='flex min-h-full flex-col'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
