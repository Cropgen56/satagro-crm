export const ORBIT_ANIMATION_DURATION = 15

export const ORBIT_FEATURES = [
  { id: 'crop-advisory', label: 'Crop Advisory', icon: '/auth/orbit/group-503.svg' },
  { id: 'weather', label: 'Weather Insights', icon: '/auth/orbit/group-504.svg' },
  { id: 'soil', label: 'Soil Health', icon: '/auth/orbit/group-505.svg' },
  { id: 'pest', label: 'Pest & Disease', icon: '/auth/orbit/group-506.svg' },
  { id: 'irrigation', label: 'Irrigation Status', icon: '/auth/orbit/group-507.svg' },
  { id: 'ndvi', label: 'NDVI Map', icon: '/auth/orbit/group-508.svg' },
  { id: 'analytics', label: 'Field Analytics', icon: '/auth/orbit/group-509.svg' },
]

export function getOrbitSizes(width) {
  if (width > 800) {
    return {
      sphereSize: 250,
      orbitRadius: 100,
      planetSize: 12,
      laptopWidth: 190,
    }
  }
  if (width > 700) {
    return {
      sphereSize: 240,
      orbitRadius: 85,
      planetSize: 11,
      laptopWidth: 180,
    }
  }
  if (width > 600) {
    return {
      sphereSize: 200,
      orbitRadius: 75,
      planetSize: 10,
      laptopWidth: 150,
    }
  }
  if (width > 500) {
    return {
      sphereSize: 180,
      orbitRadius: 65,
      planetSize: 9,
      laptopWidth: 130,
    }
  }
  return {
    sphereSize: 150,
    orbitRadius: 55,
    planetSize: 8,
    laptopWidth: 110,
  }
}
