import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Post } from '../types';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const excerpt = post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card group overflow-hidden transition hover:shadow-md ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      <Link to={`/posts/${post.id}`} className="block">
        <div className={`relative overflow-hidden ${featured ? 'h-full min-h-[240px]' : 'h-48'}`}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
              <span className="font-display text-4xl font-bold text-brand-600/30">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
          {post.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="mb-2 flex flex-wrap gap-2">
            {post.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <h2
            className={`font-display font-bold text-gray-900 transition group-hover:text-brand-600 ${
              featured ? 'text-2xl' : 'text-lg'
            }`}
          >
            {post.title}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{excerpt}</p>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {post._count?.comments ?? 0} comments
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
