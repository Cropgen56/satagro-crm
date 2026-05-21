/**
 * Orbit feature nodes for the auth hero animation.
 * Add optional `icon` paths (SVG/PNG) under public/auth/orbit/ — e.g. icon: '/auth/orbit/cropgen.svg'
 */
export const ORBIT_ANIMATION_DURATION = 18

export const ORBIT_FEATURES = [
  { id: 'cropgen', label: 'CropGen Analytics', icon: '/auth/orbit/cropgen.svg' },
  { id: 'weather', label: 'Weather Report', icon: '/auth/orbit/weather.svg' },
  { id: 'operations', label: 'Operations', icon: '/auth/orbit/operations.svg' },
  { id: 'disease', label: 'Disease Detection', icon: '/auth/orbit/disease.svg' },
  { id: 'advisory', label: 'Smart Advisory', icon: '/auth/orbit/advisory.svg' },
  { id: 'soil', label: 'Soil Report', icon: '/auth/orbit/soil.svg' },
]

export function getOrbitSizes(width) {
  if (width > 800) {
    return { container: 400, orbitRadius: 190, nodeSize: 80, laptopWidth: 420 }
  }
  if (width > 700) {
    return { container: 360, orbitRadius: 170, nodeSize: 72, laptopWidth: 380 }
  }
  if (width > 600) {
    return { container: 300, orbitRadius: 145, nodeSize: 64, laptopWidth: 320 }
  }
  if (width > 500) {
    return { container: 260, orbitRadius: 125, nodeSize: 56, laptopWidth: 280 }
  }
  return { container: 220, orbitRadius: 105, nodeSize: 48, laptopWidth: 240 }
}
