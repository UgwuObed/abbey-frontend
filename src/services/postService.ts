import api from './api';
import { Post, CreatePostData, UpdatePostData } from '../types';

export const postService = {
  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post('/posts', data);
    return response.data;
  },

  async getFeed(): Promise<Post[]> {
    const response = await api.get('/posts/feed');
    return response.data.data.posts;
  },

  async getAllPosts(): Promise<Post[]> {
    const response = await api.get('/posts');
    return response.data.data.posts;
  },

  async getPostById(id: string): Promise<Post> {
    const response = await api.get(`/posts/${id}`);
    return response.data.data.posts;
  },

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

async getUserPosts(userId: string): Promise<Post[]> {
  const response = await api.get(`/users/${userId}`);
  return response.data.data.posts; 
}
};