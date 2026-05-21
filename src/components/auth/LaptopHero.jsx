import { useEffect, useState } from 'react'

function LaptopFallback() {
  return (
    <div className="w-full rounded-2xl border border-white/15 bg-brand-950/90 p-3 shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="mb-2 h-2 w-24 rounded-full bg-accent-lime" />
      <div className="grid grid-cols-4 gap-1 rounded-lg bg-brand-900/80 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video rounded-sm bg-brand-700/60"
            style={{ opacity: 0.4 + (i % 3) * 0.2 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1">
        <span className="h-1 w-1 rounded-full bg-white/30" />
        <span className="h-1 w-6 rounded-full bg-accent-lime/70" />
        <span className="h-1 w-1 rounded-full bg-white/30" />
      </div>
    </div>
  )
}

export default function LaptopHero({ width = 420, className = '' }) {
  const [hasImage, setHasImage] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setHasImage(true)
    img.onerror = () => setHasImage(false)
    img.src = '/auth/laptop.png'
  }, [])

  return (
    <div
      className={`relative z-40 ${className}`}
      style={{ width: `${width}px`, maxWidth: '90vw' }}
    >
      {hasImage ? (
        <img
          src="/auth/laptop.png"
          alt=""
          className="h-auto w-full object-contain drop-shadow-2xl"
          style={{ transform: 'translate(-4%, 0)' }}
        />
      ) : (
        <LaptopFallback />
      )}
    </div>
  )
}
