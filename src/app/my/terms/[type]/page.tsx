import { notFound } from 'next/navigation';
import { termsFixtures, TermsDetailScreen } from '@/features/mypage';
export default async function TermsDetailPage({ params }: { params: Promise<{ type: string }> }) { const { type } = await params; const terms = type === 'service' ? termsFixtures.service : type === 'privacy' ? termsFixtures.privacy : undefined; if (!terms) notFound(); return <TermsDetailScreen terms={terms} />; }
