import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Providers } from '@/app/providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Fan Route Sync',
  description: '공연 전후 부산 여행 일정을 추천하고 공유하는 팬덤 관광 서비스',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='ko'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
