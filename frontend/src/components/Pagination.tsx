interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
      >
        Previous
      </button>

      {visiblePages.map((p, i) => {
        const showEllipsis = i > 0 && p - visiblePages[i - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-2 text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition ${
                p === page
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
