interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Build page window: show pages around current, with first/last and ellipsis
  const pages: (number | '...')[] = []
  const WINDOW = 2 // pages shown on each side of current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i <= 1 ||                          // first page
      i >= totalPages ||                 // last page
      (i >= currentPage - WINDOW && i <= currentPage + WINDOW)  // window around current
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
      >
        ‹ 上一页
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-1 text-gray-300 dark:text-gray-600 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[2.25rem] h-9 rounded-lg text-sm font-medium transition-all duration-300 ${
              page === currentPage
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800'
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
        className="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors ml-1"
      >
        下一页 ›
      </button>
    </div>
  )
}
