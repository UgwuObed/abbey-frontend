import api from './api';
import { User } from '../types';

export const followService = {
  async followUser(id: string): Promise<void> {
    await api.post(`/users/${id}/follow`);
  },

  async unfollowUser(id: string): Promise<void> {
    await api.delete(`/users/${id}/unfollow`);
  },

  async getFollowers(id: string): Promise<User[]> {
    const response = await api.get(`/users/${id}/followers`);
    return response.data;
  },

  async getFollowing(id: string): Promise<User[]> {
    const response = await api.get(`/users/${id}/following`);
    return response.data;
  },

  async checkFollowStatus(id: string): Promise<{ isFollowing: boolean }> {
    const response = await api.get(`/users/${id}/status`);
    return response.data;
  },
};
