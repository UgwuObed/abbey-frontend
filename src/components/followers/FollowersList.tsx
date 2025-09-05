import React, { useState, useEffect } from 'react';
import { UserCard } from '../users/UserCard';
import { followService } from '../../services/followService';
import { User } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface FollowersListProps {
  userId: string;
  title?: string;
}

export const FollowersList: React.FC<FollowersListProps> = ({ 
  userId, 
  title = 'Followers' 
}) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowers();
  }, [userId]);

  const loadFollowers = async () => {
    try {
      const data = await followService.getFollowers(userId);
      setFollowers(data);
    } catch (error) {
      console.error('Error loading followers:', error);
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
      {followers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No followers yet
        </div>
      ) : (
        <div className="space-y-4">
          {followers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user}
              onFollowChange={loadFollowers}
            />
          ))}
        </div>
      )}
    </div>
  );
};