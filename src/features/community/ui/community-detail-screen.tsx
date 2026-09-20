'use client';
import { useQuery } from '@tanstack/react-query';
import { Copy, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog, ErrorState, Loading } from '@/components/common';
import { AppShell, ContentContainer, PageHeader } from '@/components/layout';
import { Badge, Button, Input } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api/error-message';
import { getMyProfile, usersKeys } from '@/features/onboarding/api/user-service';
import { useAddComment, useCommunityPost, useDeleteComment, useDeletePost, useSetCommentLike, useSetPostLike } from '../api/community-queries';
import { POST_TYPE_LABELS } from '../model/community';
import { CommentThread } from './comment-thread';
export function CommunityDetailScreen({ postId }: { postId: string }) {
  const id = Number(postId); const router = useRouter(); const detail = useCommunityPost(id);
  const profile = useQuery({ queryKey: usersKeys.me(), queryFn: getMyProfile });
  const postLike = useSetPostLike(id); const commentLike = useSetCommentLike(id);
  const addComment = useAddComment(id); const deletePost = useDeletePost(id); const deleteComment = useDeleteComment(id);
  const [content, setContent] = useState(''); const [replying, setReplying] = useState<{ id: number; author: string } | null>(null); const [deleteOpen, setDeleteOpen] = useState(false);
  const fail = (error: unknown) => toast.error(getApiErrorMessage(error));
  if (!Number.isInteger(id) || id < 1 || detail.isError) return <AppShell showBottomNavigation={false} header={<PageHeader title='게시글' backHref='/community' />}><ErrorState onRetry={() => void detail.refetch()} /></AppShell>;
  if (detail.isPending) return <AppShell showBottomNavigation={false} header={<PageHeader title='게시글' backHref='/community' />}><Loading label='게시글을 불러오는 중' /></AppShell>;
  const { post, comments } = detail.data; const userId = profile.data?.id ?? null;
  const submitComment = () => { if (!content.trim() || addComment.isPending) return; addComment.mutate({ content: content.trim(), parentId: replying?.id ?? null }, { onSuccess: () => { setContent(''); setReplying(null); }, onError: fail }); };
  const copyRoute = async () => { try { await navigator.clipboard.writeText(post.content); toast.success('루트 내용을 복사했어요.'); } catch { toast.error('복사하지 못했어요.'); } };
  return <AppShell showBottomNavigation={false} header={<PageHeader title='게시글' backHref='/community' action={userId === post.authorId ? <button type='button' aria-label='게시글 삭제' onClick={() => setDeleteOpen(true)} className='grid size-9 place-items-center text-red-600'><Trash2 size={18} /></button> : null} />}><ContentContainer className='space-y-7'>
    <article><div className='flex items-center gap-2'><Badge variant={post.type === 'COMPANION' ? 'success' : 'primary'}>{POST_TYPE_LABELS[post.type]}</Badge><span className='text-sm text-gray-500'>{post.authorNickname}</span></div>
      {post.type === 'COMPANION' ? <p className='mt-4 font-bold text-emerald-700'>모집중 {post.currentMembers}/{post.capacity} · {post.companionDate}</p> : null}
      <h1 className='mt-4 text-2xl font-bold'>{post.title}</h1><p className='mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700'>{post.content}</p><div className='mt-4 flex gap-2'>{post.tags.map((tag) => <span key={tag} className='text-sm text-violet-600'>#{tag}</span>)}</div>
      {post.type === 'ROUTE' ? <Button className='mt-4' onClick={() => void copyRoute()}><Copy size={16} />복사하기</Button> : null}</article>
    <div className='flex gap-4 border-y border-gray-100 py-4'><button type='button' aria-label='게시글 좋아요' aria-pressed={post.likedByMe} disabled={postLike.isPending} onClick={() => postLike.mutate(!post.likedByMe, { onError: fail })} className={`flex items-center gap-2 text-sm font-semibold ${post.likedByMe ? 'text-red-600' : 'text-gray-600'}`}><Heart size={19} fill={post.likedByMe ? 'currentColor' : 'none'} />{post.likeCount}</button><span className='flex items-center gap-2 text-sm text-gray-600'><MessageCircle size={19} />댓글 {comments.length}</span></div>
    <section aria-labelledby='comments-title'><h2 id='comments-title' className='mb-5 text-lg font-bold'>댓글</h2>{comments.length ? <CommentThread comments={comments} userId={userId} disabled={commentLike.isPending || deleteComment.isPending} onLike={(commentId) => { const comment = comments.find((item) => item.id === commentId); if (comment) commentLike.mutate({ id: commentId, liked: !comment.likedByMe }, { onError: fail }); }} onReply={(rootId, author) => setReplying({ id: rootId, author })} onDelete={(commentId) => deleteComment.mutate(commentId, { onError: fail })} /> : <p className='text-sm text-gray-500'>아직 댓글이 없어요.</p>}</section>
    <div className='sticky bottom-0 -mx-5 border-t bg-white p-4'>{replying ? <div className='mb-2 flex justify-between text-xs text-violet-600'><span>@{replying.author}님에게 답글</span><button type='button' onClick={() => setReplying(null)}>취소</button></div> : null}<div className='flex gap-2'><Input aria-label='댓글 내용' maxLength={1000} placeholder='댓글 달기...' value={content} onChange={(e) => setContent(e.target.value)} /><Button onClick={submitComment} disabled={!content.trim() || addComment.isPending}>게시</Button></div>{post.type === 'COMPANION' ? <p className='mt-2 text-xs text-gray-500'>동행 연락은 댓글로 진행해주세요.</p> : null}</div>
  </ContentContainer><ConfirmDialog open={deleteOpen} title='게시글을 삭제할까요?' description='댓글과 답글도 함께 삭제됩니다.' confirmLabel='삭제' confirmVariant='danger' loading={deletePost.isPending} onOpenChange={setDeleteOpen} onConfirm={() => deletePost.mutate(undefined, { onSuccess: () => router.push('/community'), onError: fail })} /></AppShell>;
}
