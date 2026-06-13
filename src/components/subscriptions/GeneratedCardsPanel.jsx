import { useMemo, useState } from 'react'
import { Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductAccessCard from '@/components/subscriptions/ProductAccessCard'
import { downloadAccessCardsCsv } from '@/lib/accessCards'
import { CARD_PRINT } from '@/lib/productCardConfig'

const PREVIEW_PAGE_SIZE = 6

export default function GeneratedCardsPanel({
  result,
  productName,
  onDownloadCsv,
}) {
  const codes = result?.codes || []
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(codes.length / PREVIEW_PAGE_SIZE))
  const pageCodes = useMemo(() => {
    const start = page * PREVIEW_PAGE_SIZE
    return codes.slice(start, start + PREVIEW_PAGE_SIZE)
  }, [codes, page])

  const handleDownloadCsv = () => {
    if (onDownloadCsv) {
      onDownloadCsv()
      return
    }
    if (!codes.length) return
    const csv = downloadAccessCardsCsv(codes)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `biodrops-cards-${result?.batchId || 'batch'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!codes.length) return null

  return (
    <>
      <section className="no-print mt-8 space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-amber-950">
                {codes.length} cards ready to print
              </p>
              <p className="mt-1 max-w-xl text-sm text-amber-900/80">
                Each card has a unique QR code linked to its unlock code. Download
                the CSV for your records, then print on{' '}
                <strong>{CARD_PRINT.format}</strong> ({CARD_PRINT.widthMm}×
                {CARD_PRINT.heightMm} mm). In the print dialog set paper to{' '}
                <strong>A5 landscape</strong>, margins <strong>None</strong>, and
                enable <strong>Background graphics</strong>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3d7a14] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2d5010]"
              >
                <Printer className="h-4 w-4" />
                Print all cards
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-950 hover:bg-amber-50"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </button>
            </div>
          </div>

          <dl className="mt-4 grid gap-3 text-xs text-amber-900/70 sm:grid-cols-3">
            <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-amber-100">
              <dt className="font-medium text-amber-950">Print format</dt>
              <dd>{CARD_PRINT.format}</dd>
            </div>
            <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-amber-100">
              <dt className="font-medium text-amber-950">Resolution</dt>
              <dd>
                {CARD_PRINT.pixelSize} @ {CARD_PRINT.dpi} DPI
              </dd>
            </div>
            <div className="rounded-lg bg-white/80 px-3 py-2 ring-1 ring-amber-100">
              <dt className="font-medium text-amber-950">Batch ID</dt>
              <dd className="truncate font-mono">{result?.batchId || '—'}</dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Card preview</h3>
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-lg p-1.5 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-500">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="rounded-lg p-1.5 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {pageCodes.map((row) => (
              <ProductAccessCard
                key={row.code}
                code={row.code}
                qrUrl={row.qrUrl}
                productName={productName}
                acreLimit={row.acreLimit}
                durationMonths={row.durationMonths}
              />
            ))}
          </div>

          {codes.length > PREVIEW_PAGE_SIZE ? (
            <p className="mt-3 text-center text-xs text-gray-500">
              Showing {pageCodes.length} of {codes.length} — use Print all for the
              full batch
            </p>
          ) : null}
        </div>
      </section>

      {/* Print-only sheet — one card per A5 landscape page */}
      <div className="print-only-sheet" aria-hidden>
        {codes.map((row) => (
          <div key={row.code} className="product-access-card-page">
            <ProductAccessCard
              forPrint
              code={row.code}
              qrUrl={row.qrUrl}
              productName={productName}
              acreLimit={row.acreLimit}
              durationMonths={row.durationMonths}
            />
          </div>
        ))}
      </div>
    </>
  )
}
