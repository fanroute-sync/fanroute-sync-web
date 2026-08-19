import { EmptyState } from '@/components/common';
import { AppShell, ContentContainer, Header } from '@/components/layout';

export default function Home() {
  return (
    <AppShell header={<Header title='부산 콘서트 여행' />}>
      <ContentContainer>
        <EmptyState
          title='Fan Route Sync'
          description='공연 전후 부산 여행 일정을 추천하고 공유하는 팬덤 관광 서비스'
        />
      </ContentContainer>
    </AppShell>
  );
}
