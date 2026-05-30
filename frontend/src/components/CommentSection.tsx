import { useState } from 'react';
import { motion } from 'framer-motion';
import { commentsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Comment } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
  onCommentAdded?: (comment: Comment) => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const CommentSection = ({ postId, initialComments = [], onCommentAdded }: CommentSectionProps) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await commentsApi.create(postId, content.trim());
      setComments((prev) => [data, ...prev]);
      setContent('');
      onCommentAdded?.(data);
    } catch {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentsApi.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError('Failed to delete comment.');
    }
  };

  return (
    <section className="mt-10">
      <h3 className="font-display text-xl font-bold text-gray-900">
        Comments ({comments.length})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="input-field resize-none"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="btn-primary mt-3"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          <a href="/login" className="font-medium text-brand-600 hover:underline">
            Log in
          </a>{' '}
          to leave a comment.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-gray-100 bg-gray-50 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{comment.user.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              {user?.id === comment.userId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-700">{comment.content}</p>
          </motion.div>
        ))}

        {comments.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
