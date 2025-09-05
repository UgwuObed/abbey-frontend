import api from './api';
import { User, SearchUsersParams, Post } from '../types';

export const userService = {
async searchUsers(params: SearchUsersParams = {}): Promise<User[]> {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());
  
  const response = await api.get(`/users?${queryParams}`);
  return response.data.data; 
},

async getCurrentUser(): Promise<User> {
  const response = await api.get('/users/me');
  return response.data.data; 
},

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

async getUserByUsername(username: string): Promise<User> {
  const response = await api.get(`/users/username/${username}`);
  return response.data.data; 
},

async updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await api.put(`/users/${id}`, data);
  return response.data.data; 
},

async updateProfile(profileData: { firstName?: string; lastName?: string; bio?: string; username?: string }): Promise<User> {
  const response = await api.put('/users/auth/profile', profileData);
  return response.data.data; 
},

async getUserPosts(userId: string): Promise<Post[]> {
  const response = await api.get(`/posts`);
  return response.data.data.posts; 
},

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async followUser(id: string): Promise<void> {
    await api.post(`/users/${id}/follow`);
  },

  async unfollowUser(id: string): Promise<void> {
    await api.delete(`/users/${id}/unfollow`);
  },

async getFollowers(id: string): Promise<User[]> {
  const response = await api.get(`/users/${id}/followers`);
  return response.data.data.followers.map((item: any) => item.follower);
},

async getFollowing(id: string): Promise<User[]> {
  const response = await api.get(`/users/${id}/following`);
  return response.data.data.following.map((item: any) => item.following);
},
};