import { Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge, Card } from '@/components/ui';
import { POST_TYPE_LABELS, type CommunityPost } from '../model/community';
export function CommunityPostCard({ post }: { post: CommunityPost }) {
  return <Link href={`/community/${post.id}`} className='block rounded-2xl focus-visible:ring-2 focus-visible:ring-violet-500'><Card className='shadow-none transition-colors hover:bg-gray-50'>
    <div className='flex items-center justify-between gap-2'><Badge variant={post.type === 'COMPANION' ? 'success' : 'primary'}>{POST_TYPE_LABELS[post.type]}</Badge><span className='text-xs text-gray-400'>{post.region}</span></div>
    {post.type === 'COMPANION' ? <p className='mt-3 text-sm font-bold text-emerald-700'>모집중 {post.currentMembers}/{post.capacity}</p> : null}
    <h2 className='mt-3 font-bold leading-6'>{post.title}</h2><p className='mt-1 line-clamp-2 text-sm text-gray-600'>{post.content}</p>
    <div className='mt-3 flex flex-wrap gap-1'>{post.tags.map((tag) => <span key={tag} className='text-xs text-violet-600'>#{tag}</span>)}</div>
    <div className='mt-4 flex items-center gap-3 border-t pt-3 text-xs text-gray-500'><span>{post.authorNickname}</span><span className={`ml-auto flex items-center gap-1 ${post.likedByMe ? 'text-red-600' : ''}`} aria-label={post.likedByMe ? '좋아요 누른 게시글' : '좋아요 누르지 않은 게시글'}><Heart size={14} fill={post.likedByMe ? 'currentColor' : 'none'} />{post.likeCount}</span><span className='flex items-center gap-1'><MessageCircle size={14} />{post.commentCount}</span></div>
  </Card></Link>;
}
