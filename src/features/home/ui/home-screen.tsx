import { Bell } from 'lucide-react';

import { AppShell, ContentContainer, Header } from '@/components/layout';
import type { HomeData } from '@/features/home/model/home';
import { EmptyHome } from '@/features/home/ui/empty-home';
import { RegisteredHome } from '@/features/home/ui/registered-home';

interface HomeScreenProps {
  data: HomeData;
}

export function HomeScreen({ data }: HomeScreenProps) {
  return (
    <AppShell
      header={
        <Header
          title='부산 콘서트 여행'
          action={
            <button type='button' aria-label='알림' disabled className='grid size-9 place-items-center rounded-full text-gray-500 disabled:opacity-50'>
              <Bell aria-hidden='true' size={20} />
            </button>
          }
        />
      }
    >
      <ContentContainer>{data.status === 'empty' ? <EmptyHome data={data} /> : <RegisteredHome data={data} />}</ContentContainer>
    </AppShell>
  );
}
