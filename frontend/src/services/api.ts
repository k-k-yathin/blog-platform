import axios from 'axios';
import type { AuthResponse, Post, PostsResponse, User, Category, Tag, Comment, CreatePostPayload } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get<User>('/auth/profile'),
};

export const postsApi = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    api.get<PostsResponse>('/posts', { params }),
  getFeatured: () => api.get<Post[]>('/posts/featured'),
  getById: (id: string) => api.get<Post>(`/posts/${id}`),
  getMyPosts: (params?: Record<string, string | number>) =>
    api.get<PostsResponse>('/posts/my-posts', { params }),
  create: (data: CreatePostPayload) => api.post<Post>('/posts', data),
  update: (id: string, data: Partial<CreatePostPayload>) =>
    api.put<Post>(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  getCategories: () => api.get<Category[]>('/posts/categories'),
  getTags: () => api.get<Tag[]>('/posts/tags'),
};

export const commentsApi = {
  getByPostId: (postId: string) => api.get<Comment[]>(`/comments/post/${postId}`),
  create: (postId: string, content: string) =>
    api.post<Comment>(`/comments/post/${postId}`, { content }),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

export default api;
