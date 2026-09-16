import { CommunityDetailScreen } from '@/features/community';
export default async function CommunityDetailPage({ params }: { params: Promise<{ postId: string }> }) { const { postId } = await params; return <CommunityDetailScreen postId={postId} />; }
