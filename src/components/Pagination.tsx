interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
      >
        上一页
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'border border-slate-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
      >
        下一页
      </button>
    </div>
  )
}
