import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { postsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Post } from '../types';
import AuthorInfo from '../components/AuthorInfo';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    postsApi
      .getById(id)
      .then((res) => setPost(res.data))
      .catch(() => setError('Post not found or failed to load.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      await postsApi.delete(post.id);
      navigate('/');
    } catch {
      setError('Failed to delete post.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <ErrorMessage message={error || 'Post not found'} />
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm font-semibold text-brand-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === post.authorId;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {post.image && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img src={post.image} alt={post.title} className="h-64 w-full object-cover sm:h-96" />
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {post.categories.map((cat) => (
            <span
              key={cat.id}
              className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
            >
              {cat.name}
            </span>
          ))}
          {post.featured && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Featured
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">{post.title}</h1>

        <div className="mt-6 flex items-center justify-between border-b border-gray-200 pb-6">
          <AuthorInfo author={post.author} createdAt={post.createdAt} size="lg" />

          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/edit/${post.id}`} className="btn-secondary text-sm">
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-danger text-sm"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap text-gray-700">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-gray-200 pt-6">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <CommentSection postId={post.id} initialComments={post.comments} />
      </motion.div>
    </article>
  );
};

export default PostDetail;
