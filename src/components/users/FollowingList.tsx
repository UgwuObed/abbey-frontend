import React, { useState, useEffect } from 'react';
import { UserCard } from './UserCard';
import { followService } from '../../services/followService';
import { User } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface FollowingListProps {
  userId: string;
  title?: string;
}

export const FollowingList: React.FC<FollowingListProps> = ({ 
  userId, 
  title = 'Following' 
}) => {
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowing();
  }, [userId]);

  const loadFollowing = async () => {
    try {
      const data = await followService.getFollowing(userId);
      setFollowing(data);
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {following.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Not following anyone yet
        </div>
      ) : (
        <div className="space-y-4">
          {following.map((user) => (
            <UserCard 
              key={user.id} 
              user={user}
              onFollowChange={loadFollowing}
            />
          ))}
        </div>
      )}
    </div>
  );
};
