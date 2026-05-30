import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!id) return;

    postsApi
      .getById(id)
      .then((res) => {
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        setImage(post.image || '');
        setCategories(post.categories.map((c) => c.name).join(', '));
        setTags(post.tags.map((t) => t.name).join(', '));
        setFeatured(post.featured);
        setPublished(post.published);
      })
      .catch(() => setFetchError('Failed to load post.'))
      .finally(() => setIsFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError('');
    setIsLoading(true);

    try {
      await postsApi.update(id, {
        title,
        content,
        image: image || undefined,
        featured,
        published,
        categories: categories
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      navigate(`/posts/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update post.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <ErrorMessage message={fetchError} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900">Edit Post</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field text-lg"
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="input-field resize-y font-mono text-sm leading-relaxed"
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="categories" className="mb-1.5 block text-sm font-medium text-gray-700">
                Categories
              </label>
              <input
                id="categories"
                type="text"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditPost;
