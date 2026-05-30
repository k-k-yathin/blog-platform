export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image: string | null;
  published: boolean;
  featured: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  categories: Category[];
  tags: Tag[];
  _count?: { comments: number };
  comments?: Comment[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  image?: string;
  published?: boolean;
  featured?: boolean;
  categories?: string[];
  tags?: string[];
}

export interface ApiError {
  message: string;
  errors?: { msg: string; path: string }[];
}
