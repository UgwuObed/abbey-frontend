export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isFollowing?: boolean; 
  _count?: {
    followers: number;
    following: number;
    posts: number;
  };
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface CreatePostData {
  content: string;
}

export interface UpdatePostData {
  content: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower: User;
  following: User;
}


export interface FollowerResponse {
  id: string;
  followerId: string;
  createdAt: string;
  follower: User;
}

export interface FollowingResponse {
  id: string;
  followingId: string;
  createdAt: string;
  following: User;
}

export interface FollowersListResponse {
  followers: FollowerResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface FollowingListResponse {
  following: FollowingResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface SearchUsersParams {
  search?: string;
  limit?: number;
  offset?: number;
}