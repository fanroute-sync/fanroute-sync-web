import { communityPostFixtures } from '@/features/community/fixtures/community-fixtures';
import type { CommunityComment, CommunityPost } from '@/features/community/model/community';

let posts = structuredClone(communityPostFixtures);

async function tick() { await Promise.resolve(); }

export const communityRepository = {
  async listPosts() { await tick(); return structuredClone(posts); },
  async createPost(post: CommunityPost) { await tick(); posts = [post, ...posts]; return structuredClone(post); },
  async getPost(postId: string) { await tick(); return structuredClone(posts.find((post) => post.id === postId)); },
  async togglePostLike(postId: string) { await tick(); const post = posts.find((item) => item.id === postId); if (!post) throw new Error('NOT_FOUND'); post.liked = !post.liked; post.likeCount += post.liked ? 1 : -1; return structuredClone(post); },
  async addComment(postId: string, comment: CommunityComment) { await tick(); const post = posts.find((item) => item.id === postId); if (!post) throw new Error('NOT_FOUND'); post.comments.push(comment); return structuredClone(comment); },
  async toggleCommentLike(postId: string, commentId: string) { await tick(); const comment = posts.find((post) => post.id === postId)?.comments.find((item) => item.id === commentId); if (!comment) throw new Error('NOT_FOUND'); comment.liked = !comment.liked; comment.likeCount += comment.liked ? 1 : -1; return structuredClone(comment); },
  async deleteComment(postId: string, commentId: string) { await tick(); const post = posts.find((item) => item.id === postId); if (!post) throw new Error('NOT_FOUND'); const target = post.comments.find((comment) => comment.id === commentId); const rootId = target?.rootCommentId ?? commentId; post.comments = post.comments.filter((comment) => comment.id !== commentId && (target?.rootCommentId || comment.rootCommentId !== rootId)); },
  async deletePost(postId: string) { await tick(); posts = posts.filter((post) => post.id !== postId); },
};

export function getCommunityPostFixture(postId: string) {
  return communityPostFixtures.find((post) => post.id === postId);
}
