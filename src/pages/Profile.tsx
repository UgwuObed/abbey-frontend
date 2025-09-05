import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { User, Post } from '../types';
import { PostList } from '../components/posts/PostList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Profile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    username: ''
  });

  useEffect(() => {
    if (currentUser) {
      loadProfile();
      loadUserPosts();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;
    try {
      const userData = await userService.getUserById(currentUser.id);
      setUser(userData);
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        bio: userData.bio || '',
        username: userData.username
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    if (!currentUser) return;
    setPostsLoading(true);
    try {
      const userPosts = await postService.getUserPosts(currentUser.id);
      
      let postsArray = userPosts;
      if (
        userPosts &&
        !Array.isArray(userPosts) &&
        typeof userPosts === 'object' &&
        'posts' in userPosts
      ) {
        postsArray = (userPosts as { posts: Post[] }).posts;
      } else if (
        userPosts &&
        !Array.isArray(userPosts) &&
        typeof userPosts === 'object' &&
        'data' in userPosts &&
        typeof (userPosts as any).data === 'object' &&
        (userPosts as any).data &&
        'posts' in (userPosts as any).data
      ) {
        postsArray = ((userPosts as any).data as { posts: Post[] }).posts;
      }

      setPosts(Array.isArray(postsArray) ? postsArray : []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const updatedUser = await userService.updateProfile(editForm);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h2>
        <p className="text-gray-600">Unable to load your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
            ) : (
              <span className="text-3xl font-bold text-gray-600">
                {user.firstName?.[0]}{user.lastName?.[0] || user.username[0].toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {user.bio && (
              <p className="text-gray-700 mb-4">{user.bio}</p>
            )}

            <div className="flex space-x-6 text-sm text-gray-500">
              <span>
                <strong className="text-gray-900">{user._count?.posts || 0}</strong> posts
              </span>
              <span>
                <strong className="text-gray-900">{user._count?.followers || 0}</strong> followers
              </span>
              <span>
                <strong className="text-gray-900">{user._count?.following || 0}</strong> following
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-6 border-t pt-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Posts</h2>
        </div>
        <div className="p-6">
          <PostList
            posts={posts}
            loading={postsLoading}
            emptyMessage="You haven't posted anything yet."
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
          />
        </div>
      </div>
    </div>
  );
};