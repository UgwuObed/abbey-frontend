import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { followService } from '../../services/followService';
import { useAuth } from '../../contexts/AuthContext';

interface UserCardProps {
  user: User;
  onFollowChange?: () => void;
  showFollowButton?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onFollowChange,
  showFollowButton = true 
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const isCurrentUser = currentUser?.id === user.id;

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollowUser(user.id);
        setIsFollowing(false);
      } else {
        await followService.followUser(user.id);
        setIsFollowing(true);
      }
      onFollowChange?.();
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
      <Link 
        to={`/users/${user.id}`}
        className="flex items-center space-x-3 flex-1 min-w-0"
      >
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full object-cover" 
            />
          ) : (
            <span className="text-lg font-bold text-gray-600">
              {user.firstName?.[0] || user.username[0].toUpperCase()}
              {user.lastName?.[0] || ''}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.username
              }
            </h3>
          </div>
          <p className="text-sm text-gray-600 truncate">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-gray-500 truncate mt-1">{user.bio}</p>
          )}
          <div className="flex space-x-4 text-xs text-gray-500 mt-1">
            <span>{user._count?.followers || 0} followers</span>
            <span>{user._count?.posts || 0} posts</span>
          </div>
        </div>
      </Link>

      {showFollowButton && !isCurrentUser && (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${
            isFollowing
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50`}
        >
          {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
};