import { useEffect, useState } from 'react'
import Logo from '@/components/ui/Logo'
import {
  AuthHeroAnimationCompact,
  AuthHeroAnimationDesktop,
} from '@/components/auth/AuthHeroAnimation'

const TABLET_BREAKPOINT = 834

export default function AuthLayout({ children, footer }) {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )
  const isSmallTablet = width <= TABLET_BREAKPOINT

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (isSmallTablet) {
    return (
      <div className="relative flex h-screen w-full flex-col overflow-hidden font-sans">
        <div
          className="relative flex w-full bg-brand-primary transition-all duration-300 ease-in-out"
          style={{
            height:
              width > 830 ? '25vh' : width > 730 ? '30vh' : width > 600 ? '25vh' : '25vh',
          }}
        >
          <div className="relative flex flex-[0.4] items-center justify-start px-2">
            <AuthHeroAnimationCompact width={width} />
          </div>

          <div className="relative flex flex-[0.6] flex-col items-end justify-center px-2 pr-4 text-right sm:items-center sm:px-2 sm:text-center">
            <div className="absolute right-2 top-1 z-50 flex items-center gap-2 sm:top-2">
              <Logo size="lg" className="h-12 w-auto brightness-0 invert lg:h-16" />
            </div>

            <div className="ml-2 mt-24 space-y-1 transition-all duration-300 ease-in-out sm:mx-8 sm:mt-28">
              <h2 className="text-center text-base font-bold text-white [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)] sm:text-3xl">
                Your Smart Farming Assistant
              </h2>
              <p className="mx-auto max-w-[90%] text-center text-[8px] font-medium text-white/90 [text-shadow:0px_4px_4px_rgba(0,0,0,0.2)] sm:text-base">
                Powered by satellite insights, SatAgro helps you detect, decide, and grow
                better—field by field.
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-[65vh] flex-grow flex-col overflow-hidden bg-surface">
          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
            <div className="w-full max-w-md">{children}</div>
          </div>
          {footer ? (
            <div className="px-4 pb-6 text-center text-xs text-gray-500">{footer}</div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden font-sans">
      <div className="relative h-full w-1/2 bg-brand-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/40 via-brand-primary to-brand-900/80" />

        <div className="absolute left-4 top-2 z-50 flex items-center gap-2 lg:left-6 lg:top-3">
          <Logo size="lg" className="h-12 w-auto brightness-0 invert lg:h-16" />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 pb-10 pt-16">
          <div className="relative z-20 mb-6 max-w-lg space-y-3 text-center">
            <h2 className="text-xl font-bold text-white [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)] lg:text-3xl">
              Your Smart Farming Assistant
            </h2>
            <p className="text-sm font-medium text-white/90 [text-shadow:0px_4px_4px_rgba(0,0,0,0.2)] lg:text-base">
              Powered by satellite insights, SatAgro helps you detect, decide, and grow better—field
              by field.
            </p>
          </div>

          <div className="relative z-10">
            <AuthHeroAnimationDesktop />
          </div>
        </div>
      </div>

      <div className="flex h-full w-1/2 items-center justify-center bg-surface">
        <div className="w-full max-w-md px-4 sm:px-8">
          {children}
          {footer ? (
            <div className="mt-6 text-center text-xs text-gray-500">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
