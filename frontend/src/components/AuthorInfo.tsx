import type { Post } from '../types';

interface AuthorInfoProps {
  author: Post['author'];
  createdAt: string;
  size?: 'sm' | 'md' | 'lg';
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const AuthorInfo = ({ author, createdAt, size = 'md' }: AuthorInfoProps) => {
  const avatarSizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
  const nameSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 ${avatarSizes[size]}`}
      >
        {author.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className={`font-semibold text-gray-900 ${nameSizes[size]}`}>{author.name}</p>
        <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
