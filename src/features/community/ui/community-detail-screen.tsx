'use client';

import { Copy, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Button, Card, Input } from '@/components/ui';
import { useAddComment, useCommunityPost, useDeleteComment, useDeletePost, useToggleCommentLike, useTogglePostLike } from '@/features/community/api/community-queries';
import { POST_TYPE_LABELS, type CommunityComment, type CommunityPost } from '@/features/community/model/community';
import { CommentThread } from '@/features/community/ui/comment-thread';

export function CommunityDetailScreen({ initialPost }: { initialPost: CommunityPost }) {
  const router = useRouter(); const { data: post } = useCommunityPost(initialPost.id, initialPost);
  const postLike = useTogglePostLike(post.id); const commentLike = useToggleCommentLike(post.id); const addComment = useAddComment(post.id); const deletePost = useDeletePost(post.id); const deleteComment = useDeleteComment(post.id);
  const [content, setContent] = useState(''); const [replying, setReplying] = useState<{ rootId: string; author: string } | null>(null); const [deleteOpen, setDeleteOpen] = useState(false);
  const submitComment = () => { if (!content.trim()) return; const comment: CommunityComment = { id: `comment-${Date.now()}`, author: '부산원정러', content: content.trim(), createdAt: new Date().toISOString(), likeCount: 0, liked: false, rootCommentId: replying?.rootId ?? null, mine: true }; addComment.mutate(comment, { onSuccess: () => { setContent(''); setReplying(null); } }); };
  const copyRoute = async () => { if (!post.route) return; try { await navigator.clipboard.writeText(post.route.shareLink); toast.success('Fan Route 링크를 복사했어요.'); } catch { toast.error('링크를 복사하지 못했어요.'); } };
  return <AppShell showBottomNavigation={false} header={<PageHeader title='게시글' backHref='/community' action={post.mine ? <button type='button' aria-label='게시글 삭제' onClick={() => setDeleteOpen(true)} className='grid size-9 place-items-center text-red-600'><Trash2 aria-hidden='true' size={18} /></button> : null} />}><ContentContainer className='space-y-7'>
    <article><div className='flex items-center gap-2'><Badge variant={post.type === 'COMPANION' ? 'success' : 'primary'}>{POST_TYPE_LABELS[post.type]}</Badge><span className='text-sm text-gray-500'>{post.author}</span></div>{post.companion ? <p className='mt-4 font-bold text-emerald-700'>모집중 {post.companion.currentMembers}/{post.companion.maxMembers} · {post.companion.date}</p> : null}<h1 className='mt-4 text-2xl font-bold'>{post.title}</h1><p className='mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700'>{post.content}</p><div className='mt-4 flex gap-2'>{post.tags.map((tag) => <span key={tag} className='text-sm text-violet-600'>#{tag}</span>)}</div></article>
    {post.route ? <Card className='bg-violet-50 shadow-none'><h2 className='font-bold'>공유 루트</h2><p className='mt-1 text-sm text-gray-600'>{post.route.period}</p><ol className='mt-3 space-y-2'>{post.route.places.map((place, index) => <li key={place} className='text-sm'>{index + 1}. {place}</li>)}</ol><Button fullWidth className='mt-4' onClick={() => void copyRoute()}><Copy aria-hidden='true' size={16} />복사하기</Button></Card> : null}
    <div className='flex gap-4 border-y border-gray-100 py-4'><button type='button' aria-label='게시글 좋아요' onClick={() => postLike.mutate()} className={`flex items-center gap-2 text-sm font-semibold ${post.liked ? 'text-red-600' : 'text-gray-600'}`}><Heart aria-hidden='true' size={19} fill={post.liked ? 'currentColor' : 'none'} />{post.likeCount}</button><span className='flex items-center gap-2 text-sm text-gray-600'><MessageCircle aria-hidden='true' size={19} />댓글 {post.comments.length}</span></div>
    <section aria-labelledby='comments-title'><h2 id='comments-title' className='mb-5 text-lg font-bold'>댓글</h2><CommentThread comments={post.comments} onLike={(id) => commentLike.mutate(id)} onReply={(rootId, author) => setReplying({ rootId, author })} onDelete={(id) => deleteComment.mutate(id)} /></section>
    <div className='sticky bottom-0 -mx-5 border-t bg-white p-4'>{replying ? <div className='mb-2 flex justify-between text-xs text-violet-600'><span>@{replying.author}님에게 답글</span><button type='button' onClick={() => setReplying(null)}>취소</button></div> : null}<div className='flex gap-2'><Input aria-label='댓글 내용' placeholder='댓글 달기...' value={content} onChange={(event) => setContent(event.target.value)} /><Button onClick={submitComment} disabled={!content.trim() || addComment.isPending}>게시</Button></div>{post.type === 'COMPANION' ? <p className='mt-2 text-xs text-gray-500'>동행 신청과 연락은 댓글로 진행해주세요.</p> : null}</div>
  </ContentContainer><ConfirmDialog open={deleteOpen} title='게시글을 삭제할까요?' description='댓글과 답글도 함께 삭제됩니다.' confirmLabel='삭제' confirmVariant='danger' loading={deletePost.isPending} onOpenChange={setDeleteOpen} onConfirm={() => deletePost.mutate(undefined, { onSuccess: () => router.push('/community') })} /></AppShell>;
}
