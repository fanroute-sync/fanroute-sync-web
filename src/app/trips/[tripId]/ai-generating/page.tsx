import { Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';

export default function AiGeneratingRoutePage() {
  return (
    <AppShell showBottomNavigation={false} header={<PageHeader title='AI 일정 생성' backHref='/trips/new' />}>
      <ContentContainer>
        <Loading label='AI 일정 생성 화면을 준비하고 있어요.' className='min-h-[60dvh]' />
      </ContentContainer>
    </AppShell>
  );
}
