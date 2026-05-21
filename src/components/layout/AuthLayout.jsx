import { useEffect, useState } from 'react'
import Logo from '@/components/ui/Logo'
import AuthHeroAnimation from '@/components/auth/AuthHeroAnimation'

const TABLET_BREAKPOINT = 1024

export default function AuthLayout({ children, footer }) {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )
  const isStacked = width < TABLET_BREAKPOINT

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const heroText = (
    <>
      <h1 className="text-xl font-bold leading-tight text-white drop-shadow-md sm:text-2xl lg:text-3xl">
        Your Smart Farming Assistant
      </h1>
      <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-white/90 drop-shadow-md sm:text-base">
        Powered by satellite insights, CropGen helps you detect, decide, and grow better—field by
        field.
      </p>
    </>
  )

  if (isStacked) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="relative flex min-h-[38vh] shrink-0 flex-col overflow-hidden bg-[#344E41] sm:min-h-[42vh]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-[#344E41]/90 to-[#344E41]" />

          <div className="relative z-20 flex items-start justify-between px-4 pt-4 sm:px-6">
            <Logo size="lg" className="brightness-0 invert" />
          </div>

          <div className="relative z-10 flex flex-1 flex-col sm:flex-row">
            <div className="flex flex-[0.45] items-center justify-start pl-2 sm:pl-4">
              <div className="scale-[0.65] sm:scale-75" style={{ transformOrigin: 'left center' }}>
                <AuthHeroAnimation width={width} compact />
              </div>
            </div>
            <div className="flex flex-[0.55] flex-col justify-center px-4 pb-6 pt-20 text-center sm:items-center sm:pt-24 sm:text-center">
              {heroText}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col bg-gray-50">
          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
            <div className="w-full max-w-md">{children}</div>
          </div>
          {footer && (
            <div className="px-4 pb-6 text-center text-xs text-gray-500">{footer}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#344E41] lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/70 via-[#344E41]/95 to-brand-900/80" />

        <div className="relative z-20 px-8 pt-8">
          <Logo size="lg" className="brightness-0 invert" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pb-10">
          <div className="mb-8 max-w-md text-center">{heroText}</div>
          <AuthHeroAnimation width={width} />
        </div>

        <p className="relative z-10 pb-8 text-center text-xs tracking-[0.2em] text-white/30">
          PRECISION AGRICULTURE ECOSYSTEM
        </p>
      </div>

      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
        {footer && (
          <div className="px-4 pb-6 text-center text-xs text-gray-500">{footer}</div>
        )}
      </div>
    </div>
  )
}
