import { Heart, Trash2 } from 'lucide-react';
import type { CommunityComment } from '../model/community';
interface Props { comments: CommunityComment[]; userId: number | null; onLike: (id: number) => void; onReply: (id: number, author: string) => void; onDelete: (id: number) => void; onAccept?: (id: number) => void; disabled?: boolean }
function Row({ comment, reply, ...props }: { comment: CommunityComment; reply: boolean } & Omit<Props, 'comments'>) {
  const active = comment.likedByMe;
  return <div data-reply-depth={reply ? '1' : '0'} className={reply ? 'ml-8 border-l-2 border-gray-100 pl-3' : ''}>
    <div className='flex items-center gap-2'><strong className='text-sm'>{comment.authorNickname}</strong><span className='text-xs text-gray-400'>{comment.createdAt.slice(0, 10)}</span>{props.userId === comment.authorId ? <button type='button' aria-label={`${comment.authorNickname} 댓글 삭제`} disabled={props.disabled} onClick={() => props.onDelete(comment.id)} className='ml-auto text-gray-400'><Trash2 size={14} /></button> : null}</div>
    <p className='mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700'>{comment.content}</p><div className='mt-1 flex gap-3 text-xs text-gray-500'><button type='button' aria-label={`${comment.authorNickname} 댓글 좋아요`} aria-pressed={active} disabled={props.disabled} onClick={() => props.onLike(comment.id)} className={active ? 'text-red-600' : ''}><Heart className='mr-1 inline' size={13} fill={active ? 'currentColor' : 'none'} />좋아요 {comment.likeCount}</button><button type='button' onClick={() => props.onReply(comment.parentId ?? comment.id, comment.authorNickname)}>답글 달기</button>{!reply && props.onAccept && comment.authorId !== props.userId ? <button type='button' disabled={props.disabled} onClick={() => props.onAccept?.(comment.id)}>동행 수락</button> : null}</div>
  </div>;
}
export function CommentThread({ comments, ...props }: Props) {
  const roots = comments.filter((c) => c.parentId === null);
  return <div className='space-y-5'>{roots.map((root) => <article key={root.id} className='space-y-4'><Row comment={root} reply={false} {...props} />{comments.filter((c) => c.parentId === root.id).map((reply) => <Row key={reply.id} comment={reply} reply {...props} />)}</article>)}</div>;
}
