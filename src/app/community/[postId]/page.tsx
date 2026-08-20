import { notFound } from 'next/navigation';
import { CommunityDetailScreen, getCommunityPostFixture } from '@/features/community';
export default async function CommunityDetailPage({ params }: { params: Promise<{ postId: string }> }) { const { postId } = await params; const post = getCommunityPostFixture(postId); if (!post) notFound(); return <CommunityDetailScreen initialPost={post} />; }
