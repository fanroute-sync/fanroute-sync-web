import { AiUsageScreen, myPageFixture } from '@/features/mypage';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
export default function AiUsagePage() { return process.env.NEXT_PUBLIC_API_BASE_URL ? <AppShell showBottomNavigation={false} header={<PageHeader title='AI 루트 사용 현황' backHref='/my' />}><ContentContainer><p className='rounded-xl bg-gray-50 p-4 text-sm text-gray-600'>사용 횟수 조회 API가 아직 제공되지 않아요.</p></ContentContainer></AppShell> : <AiUsageScreen usage={myPageFixture.aiUsage} />; }
