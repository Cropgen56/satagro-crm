import { Loader2 } from 'lucide-react'

/** Shown while a page's code loads (pages are split and loaded on demand). */
export default function PageLoader({ fullScreen = false }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`flex items-center justify-center ${fullScreen ? 'min-h-screen bg-surface' : 'min-h-[60vh]'}`}
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
    </div>
  )
}
