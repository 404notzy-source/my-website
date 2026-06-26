interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  const WINDOW = 2

  for (let i = 1; i <= totalPages; i++) {
    if (i <= 1 || i >= totalPages || (i >= currentPage - WINDOW && i <= currentPage + WINDOW)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="mt-10 flex items-center justify-center flex-wrap gap-1">
      {/* 首页 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
        className="h-9 px-2 rounded text-sm text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed hover:text-blue-500 transition-colors"
      >
        &laquo;
      </button>
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-9 px-2 rounded text-sm text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed hover:text-blue-500 transition-colors"
      >
        &lsaquo;
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="w-6 text-center text-gray-300 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[2rem] h-9 px-2 rounded text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-9 px-2 rounded text-sm text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed hover:text-blue-500 transition-colors"
      >
        &rsaquo;
      </button>
      {/* 末页 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="h-9 px-2 rounded text-sm text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed hover:text-blue-500 transition-colors"
      >
        &raquo;
      </button>
    </div>
  )
}
