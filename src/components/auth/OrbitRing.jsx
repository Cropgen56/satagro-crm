/** Decorative elliptical rings behind the orbit animation */
export default function OrbitRing({ className = '' }) {
  return (
    <svg
      className={`pointer-events-none w-full h-auto ${className}`}
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="200" cy="140" rx="185" ry="95" stroke="url(#ringGrad)" strokeWidth="1" opacity="0.35" />
      <ellipse cx="200" cy="140" rx="155" ry="78" stroke="url(#ringGrad)" strokeWidth="1" opacity="0.2" />
      <ellipse cx="200" cy="140" rx="125" ry="62" stroke="url(#ringGrad)" strokeWidth="1" opacity="0.12" />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  )
}
