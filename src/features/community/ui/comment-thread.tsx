import { Heart, Trash2 } from 'lucide-react';
import type { CommunityComment } from '@/features/community/model/community';

interface Props { comments: CommunityComment[]; onLike: (id: string) => void; onReply: (rootId: string, author: string) => void; onDelete: (id: string) => void; }

function CommentRow({ comment, reply, onLike, onReply, onDelete }: { comment: CommunityComment; reply: boolean } & Omit<Props, 'comments'>) {
  return <div className={reply ? 'ml-8 border-l-2 border-gray-100 pl-3' : ''} data-reply-depth={reply ? '1' : '0'}><div className='flex items-center gap-2'><strong className='text-sm'>{comment.author}</strong><span className='text-xs text-gray-400'>방금 전</span>{comment.mine ? <button type='button' aria-label={`${comment.author} 댓글 삭제`} onClick={() => onDelete(comment.id)} className='ml-auto text-gray-400'><Trash2 aria-hidden='true' size={14} /></button> : null}</div><p className='mt-1 text-sm leading-6 text-gray-700'>{comment.content}</p><div className='mt-1 flex gap-3 text-xs text-gray-500'><button type='button' aria-label={`${comment.author} 댓글 좋아요`} onClick={() => onLike(comment.id)} className={comment.liked ? 'text-red-600' : ''}><Heart aria-hidden='true' className='mr-1 inline' size={13} fill={comment.liked ? 'currentColor' : 'none'} />좋아요 {comment.likeCount}</button><button type='button' onClick={() => onReply(comment.rootCommentId ?? comment.id, comment.author)}>답글 달기</button></div></div>;
}

export function CommentThread({ comments, onLike, onReply, onDelete }: Props) {
  const roots = comments.filter((comment) => !comment.rootCommentId);
  return <div className='space-y-5'>{roots.map((root) => <article key={root.id} className='space-y-4'><CommentRow comment={root} reply={false} onLike={onLike} onReply={onReply} onDelete={onDelete} />{comments.filter((comment) => comment.rootCommentId === root.id).map((reply) => <CommentRow key={reply.id} comment={reply} reply onLike={onLike} onReply={onReply} onDelete={onDelete} />)}</article>)}</div>;
}
