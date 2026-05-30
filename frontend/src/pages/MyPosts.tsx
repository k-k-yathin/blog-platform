import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsApi } from '../services/api';
import type { Post, Pagination as PaginationType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await postsApi.getMyPosts({ page, limit: 10 });
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load your posts.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postsApi.delete(id);
      fetchPosts();
    } catch {
      setError('Failed to delete post.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">My Posts</h1>
          <p className="mt-1 text-gray-600">Manage your published articles</p>
        </div>
        <Link to="/create" className="btn-primary">
          New Post
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-12">
          <ErrorMessage message={error} onRetry={fetchPosts} />
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">You haven't written any posts yet.</p>
          <Link to="/create" className="mt-4 inline-block btn-primary">
            Write your first post
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/posts/${post.id}`}
                      className="font-display text-lg font-bold text-gray-900 hover:text-brand-600"
                    >
                      {post.title}
                    </Link>
                    {!post.published && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        Draft
                      </span>
                    )}
                    {post.featured && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(post.createdAt)} · {post._count?.comments ?? 0} comments
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/edit/${post.id}`} className="btn-secondary text-sm">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="btn-danger text-sm">
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPosts;
