import React from 'react';
import { PostCard } from './PostCard';
import { Post } from '../../types';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  emptyMessage?: string;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (post: Post) => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  loading = false,
  emptyMessage = 'No posts yet.',
  onDeletePost,
  onUpdatePost,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDeletePost}
          onUpdate={onUpdatePost}
        />
      ))}
    </div>
  );
};