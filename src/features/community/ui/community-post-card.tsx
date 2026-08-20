import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { Badge, Card } from '@/components/ui';
import { POST_TYPE_LABELS, type CommunityPost } from '@/features/community/model/community';

export function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <Link href={`/community/${post.id}`} className='block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'>
      <Card className='shadow-none transition-colors hover:bg-gray-50'>
        <div className='flex items-center justify-between gap-2'><Badge variant={post.type === 'COMPANION' ? 'success' : 'primary'}>{POST_TYPE_LABELS[post.type]}</Badge><span className='text-xs text-gray-400'>{post.region}</span></div>
        {post.companion ? <p className='mt-3 text-sm font-bold text-emerald-700'>모집중 {post.companion.currentMembers}/{post.companion.maxMembers}</p> : null}
        <h2 className='mt-3 font-bold leading-6 text-gray-950'>{post.title}</h2>
        <p className='mt-1 line-clamp-2 text-sm leading-5 text-gray-600'>{post.content}</p>
        <div className='mt-3 flex flex-wrap gap-1'>{post.tags.map((tag) => <span key={tag} className='text-xs text-violet-600'>#{tag}</span>)}</div>
        <div className='mt-4 flex items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500'><span>{post.author}</span><span className='ml-auto flex items-center gap-1'><Heart aria-hidden='true' size={14} />{post.likeCount}</span><span className='flex items-center gap-1'><MessageCircle aria-hidden='true' size={14} />{post.comments.length}</span></div>
      </Card>
    </Link>
  );
}
