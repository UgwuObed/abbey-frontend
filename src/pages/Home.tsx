import React, { useState, useEffect } from 'react';
import { PostForm } from '../components/posts/PostForm';
import { PostList } from '../components/posts/PostList';
import { postService } from '../services/postService';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      
      const feedPosts = await postService.getFeed();
      setPosts(feedPosts);
    } catch (err: any) {
      console.error('Error loading feed:', err);
      setError('Failed to load your feed. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadFeed(true);
  };

  const handleNewPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => loadFeed()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {user?.firstName || user?.username}!
            </h1>
            <p className="text-gray-600 text-lg">What's on your mind today?</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Post Creation Section */}
        <div className="animate-in slide-in-from-bottom duration-500 delay-200">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <PostForm onPostCreated={handleNewPost} />
          </div>
        </div>

        {/* Feed Header */}
        <div className="flex items-center justify-between animate-in slide-in-from-left duration-500 delay-300">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-900">Your Feed</h2>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Posts List */}
        <div className="animate-in slide-in-from-bottom duration-500 delay-400">
          <div className="space-y-6">
            <PostList
              posts={posts}
              loading={loading}
              emptyMessage="Your feed is empty. Follow some users to see their posts here!"
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
            />
          </div>
        </div>

        {/* Empty State Enhancement */}
        {!loading && posts.length === 0 && !error && (
          <div className="text-center py-16 animate-in fade-in duration-700 delay-500">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your feed is looking quiet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by following some interesting people to see their posts in your feed, or share your first post above!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/discover'}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Discover People
              </button>
              <button
                onClick={() => document.querySelector('textarea')?.focus()}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};