import { QRCodeSVG } from 'qrcode.react'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import { buildCardQrUrl } from '@/lib/accessCards'
import {
  CARD_FOOTER,
  DEFAULT_BENEFITS,
  DEFAULT_PRODUCT_IMAGE,
  DEFAULT_PRODUCT_NAME,
  DEFAULT_PRODUCT_SUBTITLE,
} from '@/lib/productCardConfig'

/**
 * Printable A5 landscape product card — product photo, benefits, QR bound to card code.
 */
export default function ProductAccessCard({
  code,
  productName = DEFAULT_PRODUCT_NAME,
  subtitle = DEFAULT_PRODUCT_SUBTITLE,
  productImage = DEFAULT_PRODUCT_IMAGE,
  acreLimit,
  durationMonths,
  benefits = DEFAULT_BENEFITS,
  qrUrl,
  qrLocked = false,
  forPrint = false,
  className,
  compact = false,
}) {
  const hasFullCode = Boolean(code && !String(code).includes('*'))
  const unlockUrl =
    !qrLocked && (qrUrl || (hasFullCode ? buildCardQrUrl(code) : ''))
  const titleParts = String(productName || DEFAULT_PRODUCT_NAME)
    .trim()
    .split(/\s+/)
  const brandLine = titleParts.slice(0, 2).join(' ').toUpperCase()
  const productLine = titleParts.slice(2).join(' ').toUpperCase() || 'BOKASHI BUCKET'

  const qrSize = forPrint ? 128 : compact ? 72 : 96

  return (
    <article
      className={clsx(
        'product-access-card flex flex-col overflow-hidden rounded-xl border border-[#c8e6c0] bg-white shadow-md',
        forPrint && 'print-card-item',
        !forPrint && (compact ? 'max-w-md' : 'w-full max-w-[794px]'),
        className,
      )}
      style={forPrint ? undefined : { aspectRatio: '210 / 148' }}
    >
      {/* Header */}
      <header className="product-access-card-header border-b border-[#d4edcc] bg-gradient-to-r from-[#3d7a14] via-[#4a9018] to-[#3d7a14] px-4 py-2.5 text-center text-white sm:px-6 sm:py-3">
        <p className="brand-line text-[9px] font-semibold tracking-[0.28em] text-white/90 sm:text-[10px]">
          {brandLine}
        </p>
        <h2 className="product-title mt-0.5 text-base font-extrabold tracking-wide sm:text-xl">
          {productLine}
        </h2>
        <p className="product-subtitle mt-0.5 text-[9px] font-medium text-white/95 sm:text-[11px]">
          {subtitle}
        </p>
      </header>

      {/* Body — 3 columns */}
      <div className="product-access-card-body grid min-h-0 flex-1 grid-cols-[1.1fr_1fr_0.85fr] gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        {/* Product image */}
        <div className="product-access-card-image flex items-center justify-center rounded-lg bg-gradient-to-b from-[#f4faf0] to-white p-1.5 ring-1 ring-[#e2f0dc]">
          <img
            src={productImage}
            alt={productName}
            className="max-h-full w-full object-contain"
            draggable={false}
          />
        </div>

        {/* Benefits + entitlement */}
        <div className="product-access-card-benefits flex flex-col justify-center px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#2d5010] sm:text-xs">
            Benefits
          </h3>
          <ul className="mt-1.5 space-y-0.5 sm:mt-2 sm:space-y-1">
            {benefits.map((item) => (
              <li
                key={item}
                className="flex items-start gap-1 text-[8px] font-medium text-gray-800 sm:text-[10px]"
              >
                <Check
                  className="mt-0.5 h-2.5 w-2.5 shrink-0 text-[#4a9018] sm:h-3 sm:w-3"
                  strokeWidth={3}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {(acreLimit != null || durationMonths != null) && (
            <div className="product-access-card-entitlement mt-2 rounded-md bg-[#f0f9eb] px-2 py-1 ring-1 ring-[#d4edcc] sm:mt-3">
              <p className="text-[7px] font-semibold uppercase tracking-wide text-[#3d7a14] sm:text-[8px]">
                App access included
              </p>
              <p className="entitlement-value text-[9px] font-bold text-gray-900 sm:text-[10px]">
                {acreLimit != null ? `${acreLimit} acres` : null}
                {acreLimit != null && durationMonths != null ? ' · ' : null}
                {durationMonths != null ? `${durationMonths} months` : null}
              </p>
            </div>
          )}

          {code ? (
            <p className="product-access-card-code mt-2 font-mono text-[9px] font-bold tracking-wider text-[#1a3d0a] sm:text-[10px]">
              {code}
            </p>
          ) : null}
        </div>

        {/* QR */}
        <div className="product-access-card-qr flex flex-col items-center justify-center rounded-lg bg-[#fafdfa] p-1.5 ring-1 ring-[#d4edcc] sm:p-2">
          {unlockUrl ? (
            <div className="product-access-card-qr-box rounded-md bg-white p-1.5 shadow-sm ring-1 ring-gray-100">
              <QRCodeSVG
                value={unlockUrl}
                size={qrSize}
                level="H"
                marginSize={1}
                fgColor="#14532d"
                bgColor="#ffffff"
                title={`Unlock ${code || 'card'}`}
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-md border-2 border-dashed border-[#c8e6c0] bg-white px-1 text-center text-[7px] font-medium text-gray-500 sm:h-24 sm:w-24 sm:text-[8px]">
              {qrLocked ? (
                <>
                  <span className="text-[9px] font-bold text-[#3d7a14]">QR</span>
                  <span className="mt-0.5 leading-tight">Use CSV from batch generation</span>
                </>
              ) : (
                'QR'
              )}
            </div>
          )}
          <p className="qr-label mt-1.5 text-center text-[8px] font-bold uppercase tracking-wide text-[#2d5010] sm:text-[9px]">
            Scan to unlock app
          </p>
          <p className="qr-sublabel mt-0.5 text-center text-[7px] text-gray-500 sm:text-[8px]">
            Demo video &amp; precision farming
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="product-access-card-footer flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 border-t border-[#d4edcc] bg-[#f4faf0] px-3 py-1.5 text-[7px] font-medium text-gray-700 sm:gap-x-3 sm:text-[8px]">
        <span>{CARD_FOOTER.website}</span>
        <span className="text-[#4a9018]">|</span>
        <span>{CARD_FOOTER.contact}</span>
        <span className="text-[#4a9018]">|</span>
        <span>{CARD_FOOTER.technology}</span>
        <span className="text-[#4a9018]">|</span>
        <span>{CARD_FOOTER.support}</span>
      </footer>
    </article>
  )
}
