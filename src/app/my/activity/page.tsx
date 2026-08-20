import { ActivityPageScreen, myPageFixture } from '@/features/mypage';
const types = ['POST', 'LIKE', 'COMMENT'] as const;
export default async function MyActivityPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) { const { tab } = await searchParams; const initialType = types.find((type) => type === tab) ?? 'POST'; return <ActivityPageScreen data={myPageFixture} initialType={initialType} />; }
