import { ActivityPageScreen, myPageFixture } from '@/features/mypage';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
const types = ['POST', 'LIKE', 'COMMENT'] as const;
export default async function MyActivityPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) { if (process.env.NEXT_PUBLIC_API_BASE_URL) return <AppShell showBottomNavigation={false} header={<PageHeader title='내 활동' backHref='/my' />}><ContentContainer><p className='rounded-xl bg-gray-50 p-4 text-sm text-gray-600'>내 활동 조회 API가 아직 제공되지 않아요.</p></ContentContainer></AppShell>; const { tab } = await searchParams; const initialType = types.find((type) => type === tab) ?? 'POST'; return <ActivityPageScreen data={myPageFixture} initialType={initialType} />; }
