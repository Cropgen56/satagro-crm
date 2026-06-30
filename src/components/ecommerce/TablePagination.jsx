import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TablePagination({
  currentPage = 1,
  totalPages = 1,
  total = 0,
  limit = 20,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const rangeStart = total ? (currentPage - 1) * limit + 1 : 0
  const rangeEnd = Math.min(currentPage * limit, total)

  const movePage = (next) => {
    const page = Math.min(Math.max(1, next), totalPages)
    onPageChange?.(page)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
      <span>
        Showing {rangeStart}–{rangeEnd} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => movePage(currentPage - 1)}
          className="rounded-xl p-2 transition hover:bg-gray-100 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[7rem] text-center font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => movePage(currentPage + 1)}
          className="rounded-xl p-2 transition hover:bg-gray-100 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
