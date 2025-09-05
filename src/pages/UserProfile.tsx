import React from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile as UserProfileComponent } from '../components/users/UserProfile';

export const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid user</h2>
        <p className="text-gray-600">User ID is missing.</p>
      </div>
    );
  }

  return <UserProfileComponent />;
};