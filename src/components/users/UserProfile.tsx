import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { postService } from '../../services/postService';
import { followService } from '../../services/followService';
import { User, Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { PostList } from '../posts/PostList';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { FollowersList } from '../followers/FollowersList';
import { FollowingList } from '../users/FollowingList';

export const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following'>('posts');
  const { user: currentUser } = useAuth();

  const isCurrentUser = currentUser?.id === id;

  useEffect(() => {
    if (id) {
      loadUserProfile(id);
      loadUserPosts(id);
      if (!isCurrentUser) {
        checkFollowStatus(id);
      }
    }
  }, [id, isCurrentUser]);

  const loadUserProfile = async (userId: string) => {
    try {
      const userData = await userService.getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async (userId: string) => {
    setPostsLoading(true);
    try {
      const userPosts = await postService.getUserPosts(userId);
      
      let postsArray = userPosts;
      if (userPosts && typeof userPosts === 'object' && !Array.isArray(userPosts)) {
        const responseObj = userPosts as any;
        if (responseObj.posts) {
          postsArray = responseObj.posts;
        } else if (responseObj.data && responseObj.data.posts) {
          postsArray = responseObj.data.posts;
        }
      }
      
      setPosts(Array.isArray(postsArray) ? postsArray : []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]); 
    } finally {
      setPostsLoading(false);
    }
  };

  const checkFollowStatus = async (userId: string) => {
    try {
      const status = await followService.checkFollowStatus(userId);
      setIsFollowing(status.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!id) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollowUser(id);
        setIsFollowing(false);
      } else {
        await followService.followUser(id);
        setIsFollowing(true);
      }
 
      loadUserProfile(id);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
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
                {(user.firstName?.[0] || user.username[0] || '').toUpperCase()}
                {(user.lastName?.[0] || '').toUpperCase()}
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
              
              <div className="flex space-x-3">
                {isCurrentUser ? (
                  <Link
                    to="/profile"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50`}
                  >
                    {followLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
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
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'followers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'following'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Following
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <PostList
              posts={posts}
              loading={postsLoading}
              emptyMessage={`${isCurrentUser ? 'You haven\'t' : user.firstName + ' hasn\'t'} posted anything yet.`}
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
            />
          )}
          
          {activeTab === 'followers' && id && (
            <FollowersList userId={id} />
          )}
          
          {activeTab === 'following' && id && (
            <FollowingList userId={id} />
          )}
        </div>
      </div>
    </div>
  );
};