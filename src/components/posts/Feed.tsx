import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { PostForm } from './PostForm';
import { postService } from '../../services/postService';
import { Post } from '../../types';

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const feedPosts = await postService.getFeed();
      setPosts(feedPosts);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) {
    return <div className="text-center">Loading feed...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PostForm onPostCreated={handleNewPost} />
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-500">
          No posts in your feed. Follow some users to see their posts!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};