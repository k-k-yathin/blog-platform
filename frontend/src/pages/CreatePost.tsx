import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PostForm = ({ mode }: { mode: 'create' | 'edit' }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const payload = {
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
    };

    try {
      const { data } = await postsApi.create(payload);
      navigate(`/posts/${data.id}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create post.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          {mode === 'create' ? 'Write a New Post' : 'Edit Post'}
        </h1>
        <p className="mt-2 text-gray-600">Share your story with the world</p>

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
              placeholder="An engaging title..."
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
              placeholder="Write your story here..."
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-gray-700">
              Cover Image URL (optional)
            </label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="categories" className="mb-1.5 block text-sm font-medium text-gray-700">
                Categories (comma-separated)
              </label>
              <input
                id="categories"
                type="text"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="input-field"
                placeholder="Technology, Lifestyle"
              />
            </div>
            <div>
              <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
                placeholder="react, typescript"
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
              {isLoading ? <LoadingSpinner size="sm" /> : 'Publish Post'}
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

const CreatePost = () => <PostForm mode="create" />;
export default CreatePost;
