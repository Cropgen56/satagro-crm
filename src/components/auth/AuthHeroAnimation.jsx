import {
  ORBIT_ANIMATION_DURATION,
  ORBIT_FEATURES,
  getOrbitSizes,
} from '@/data/authOrbit'
import LaptopHero from './LaptopHero'

const SPHERE_SRC = '/auth/desktop-background.svg'

function OrbitPlanets({ orbitRadius, planetSize, compact = false }) {
  const duration = ORBIT_ANIMATION_DURATION
  const total = ORBIT_FEATURES.length

  return ORBIT_FEATURES.map((planet, i) => {
    const angle = (360 / total) * i

    return (
      <div
        key={planet.id}
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{
          animation: `orbit ${duration}s linear infinite`,
          animationDelay: `-${(i * duration) / total}s`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: compact ? `-${orbitRadius}px` : '-155px',
            left: 0,
            transform: `translateX(-95%) rotate(-${angle}deg)`,
          }}
        >
          <div
            className="flex items-center justify-center rounded-full bg-white/95 p-1 shadow-lg shadow-black/20"
            style={{
              width: compact ? `${planetSize * 4}px` : '3.25rem',
              height: compact ? `${planetSize * 4}px` : '3.25rem',
              animation: `counterOrbit ${duration}s linear infinite reverse`,
            }}
          >
            <img
              src={planet.icon}
              alt=""
              className="object-contain"
              style={
                compact
                  ? {
                      width: `${planetSize * 3}px`,
                      height: `${planetSize * 3}px`,
                    }
                  : { width: '2.5rem', height: '2.5rem' }
              }
            />
          </div>
        </div>
      </div>
    )
  })
}

export function AuthHeroAnimationDesktop() {
  return (
    <div className="relative mx-auto w-64 lg:w-72">
      <img src={SPHERE_SRC} alt="" className="relative z-10 h-auto w-full" />

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative h-[280px] w-[280px] md:h-[320px] md:w-[320px]">
          <OrbitPlanets />
        </div>
      </div>

      <div className="absolute inset-0 z-30 flex items-center justify-center pt-2">
        <LaptopHero width={250} />
      </div>
    </div>
  )
}

export function AuthHeroAnimationCompact({ width }) {
  const sizes = getOrbitSizes(width)

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: '58%',
        width: `${sizes.sphereSize}px`,
        height: `${sizes.sphereSize}px`,
      }}
    >
      <img src={SPHERE_SRC} alt="" className="relative z-10 h-auto w-full" />

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: `${sizes.sphereSize}px`,
            height: `${sizes.sphereSize}px`,
            transform: 'translate(4px, -4px)',
          }}
        >
          <OrbitPlanets
            compact
            orbitRadius={sizes.orbitRadius}
            planetSize={sizes.planetSize}
          />
        </div>
      </div>

      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <LaptopHero width={sizes.laptopWidth} />
      </div>
    </div>
  )
}

export default function AuthHeroAnimation({ width, compact = false }) {
  if (compact) {
    return <AuthHeroAnimationCompact width={width} />
  }
  return <AuthHeroAnimationDesktop />
}
