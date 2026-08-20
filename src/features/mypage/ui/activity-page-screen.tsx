'use client';

import { useRouter } from 'next/navigation';
import type { MyPageData } from '@/features/mypage/model/mypage';
import { ActivityScreen } from '@/features/mypage/ui/activity-screen';

type ActivityType = 'POST' | 'LIKE' | 'COMMENT';
export function ActivityPageScreen({ data, initialType }: { data: MyPageData; initialType: ActivityType }) { const router = useRouter(); return <ActivityScreen data={data} activeType={initialType} onTypeChange={(type) => router.replace(`/my/activity?tab=${type}`)} />; }
