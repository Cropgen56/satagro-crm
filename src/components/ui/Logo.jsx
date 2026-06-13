import clsx from 'clsx'

const sizeClasses = {
  sidebar: 'h-14 w-auto max-w-[220px]',
  sm: 'h-9 w-auto max-w-[150px]',
  md: 'h-11 w-auto max-w-[180px]',
  lg: 'h-14 w-auto max-w-[220px]',
}

export default function Logo({ size = 'md', className }) {
  return (
    <img
      src="/logo.png"
      alt="SatAgro"
      className={clsx('block object-contain object-left', sizeClasses[size], className)}
    />
  )
}
