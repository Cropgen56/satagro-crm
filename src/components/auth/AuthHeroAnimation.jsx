import { useState } from 'react'
import {
  ORBIT_ANIMATION_DURATION,
  ORBIT_FEATURES,
  getOrbitSizes,
} from '@/data/authOrbit'
import LaptopHero from './LaptopHero'
import OrbitRing from './OrbitRing'

function OrbitNodeContent({ feature }) {
  const [iconFailed, setIconFailed] = useState(false)
  const showLabel = !feature.icon || iconFailed

  if (showLabel) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-brand-900/95 px-1.5 text-center text-[9px] font-semibold leading-tight text-white shadow-lg shadow-black/30 ring-2 ring-accent-lime/20">
        {feature.label}
      </div>
    )
  }

  return (
    <img
      src={feature.icon}
      alt=""
      className="h-full w-full object-contain drop-shadow-lg"
      onError={() => setIconFailed(true)}
    />
  )
}

function OrbitNode({ feature, index, total, orbitRadius, nodeSize, duration }) {
  const angle = (360 / total) * index
  const delay = -(index * duration) / total

  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{
        animation: `auth-orbit ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: `-${orbitRadius}px`,
          left: 0,
          transform: `translateX(-50%) rotate(-${angle}deg)`,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: nodeSize,
            height: nodeSize,
            animation: `auth-counter-orbit ${duration}s linear infinite reverse`,
          }}
        >
          <OrbitNodeContent feature={feature} />
        </div>
      </div>
    </div>
  )
}

export default function AuthHeroAnimation({ width, compact = false }) {
  const sizes = getOrbitSizes(width)
  const duration = ORBIT_ANIMATION_DURATION
  const total = ORBIT_FEATURES.length
  const ringSize = sizes.orbitRadius * 2 + sizes.nodeSize

  return (
    <div
      className="relative mx-auto"
      style={{
        width: sizes.container,
        height: compact ? sizes.container * 0.85 : sizes.container,
        maxWidth: '100%',
      }}
    >
      <OrbitRing className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 opacity-90" />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5"
        style={{ width: ringSize, height: ringSize }}
      />

      <div
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{ width: sizes.container, height: sizes.container }}
      >
        {ORBIT_FEATURES.map((feature, i) => (
          <OrbitNode
            key={feature.id}
            feature={feature}
            index={i}
            total={total}
            orbitRadius={sizes.orbitRadius}
            nodeSize={sizes.nodeSize}
            duration={duration}
          />
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 z-30 -translate-x-[54%] -translate-y-1/2">
        <LaptopHero width={sizes.laptopWidth} />
      </div>
    </div>
  )
}
