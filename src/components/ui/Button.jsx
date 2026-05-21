import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'

export default function Button({
  children,
  className,
  showArrow = false,
  fullWidth = true,
  ...props
}) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-950 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </button>
  )
}
