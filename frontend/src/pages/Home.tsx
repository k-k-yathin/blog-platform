import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { postsApi } from '../services/api';
import type { Post, Category, Pagination as PaginationType } from '../types';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = { page, limit: 9 };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      const { data } = await postsApi.getAll(params);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    postsApi.getFeatured().then((res) => setFeaturedPosts(res.data)).catch(() => {});
    postsApi.getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchPosts, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [fetchPosts, search]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              Stories Worth Reading
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
              Discover insightful articles on technology, lifestyle, travel, and more from
              passionate writers around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {featuredPosts.length > 0 && !search && !selectedCategory && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-gray-900">Featured Posts</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} featured={i === 0} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-bold text-gray-900">Latest Articles</h2>
          <div className="w-full sm:max-w-xs">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                !selectedCategory
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({cat._count?.posts ?? 0})
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="py-12">
            <ErrorMessage message={error} onRetry={fetchPosts} />
          </div>
        ) : posts.length === 0 ? (
          <p className="py-20 text-center text-gray-500">No posts found. Try a different search.</p>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {pagination && (
              <div className="mt-10">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
