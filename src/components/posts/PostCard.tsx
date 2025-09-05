import React, { useState } from 'react';
import { formatDistanceToNow } from '../../utils/timeUtils';
import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { postService } from '../../services/postService';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onUpdate?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onUpdate }) => {
  const { user: currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const isAuthor = currentUser?.id === post.author?.id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    try {
      await postService.deletePost(post.id);
      onDelete?.(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === post.content) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      const updatedPost = await postService.updatePost(post.id, { 
        content: editContent.trim() 
      });
      onUpdate?.(updatedPost);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  if (!post.author) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Post author information is missing.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/users/${post.author.id}`}>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {post.author.avatar ? (
                <img 
                  src={post.author.avatar} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full" 
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {(post.author.firstName?.[0] || post.author.username?.[0] || '').toUpperCase()}
                  {(post.author.lastName?.[0] || '').toUpperCase()}
                </span>
              )}
            </div>
          </Link>
          <div>
            <Link 
              to={`/users/${post.author.id}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {post.author.firstName && post.author.lastName 
                ? `${post.author.firstName} ${post.author.lastName}`
                : post.author.username || 'Unknown User'
              }
            </Link>
            <p className="text-sm text-gray-500">@{post.author.username || 'unknown'}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(post.createdAt)}
            </p>
          </div>
        </div>

        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading || !editContent.trim()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        )}
      </div>

      {post.updatedAt !== post.createdAt && !isEditing && (
        <p className="text-xs text-gray-400">
          Edited {formatDistanceToNow(post.updatedAt)}
        </p>
      )}
    </div>
  );
};