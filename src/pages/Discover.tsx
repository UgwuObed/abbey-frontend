import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User } from '../types';
import { UserCard } from '../components/users/UserCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Discover: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (search?: string) => {
    const isSearching = !!search;
    if (isSearching) {
      setSearching(true);
    } else {
      setLoading(true);
    }

    try {
      const userData = await userService.searchUsers({
        search: search || undefined,
        limit: 20
      });
      
  
      let usersArray = userData;
      if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
        const responseObj = userData as any;
        if (responseObj.users) {
          usersArray = responseObj.users;
        } else if (responseObj.data && responseObj.data.users) {
          usersArray = responseObj.data.users;
        } else if (responseObj.data && Array.isArray(responseObj.data)) {
          usersArray = responseObj.data;
        }
      }
      
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(searchTerm);
  };

  const handleFollowChange = () => {
    if (searchTerm) {
      loadUsers(searchTerm);
    } else {
      loadUsers();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Discover Users</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name or username..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {searchTerm && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              {searching ? 'Searching...' : `Results for "${searchTerm}"`}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                loadUsers();
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No users to discover at the moment.'}
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user}
                  onFollowChange={handleFollowChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};