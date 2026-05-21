import { farmersData } from './farmers'

export const FARMER_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'land', label: 'Land & Crops' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'activities', label: 'Activities' },
  { id: 'advisories', label: 'Advisories' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'documents', label: 'Documents' },
]

const defaultDetail = {
  displayId: 'F-88210',
  verified: true,
  email: 'ramesh.k@email.com',
  gender: 'Male',
  age: '42 Years',
  badges: [
    { label: 'Active Subscription', className: 'bg-teal-50 text-teal-700' },
    { label: 'Low Risk', className: 'bg-green-50 text-green-700' },
    { label: 'Flowering Stage', className: 'bg-amber-50 text-amber-700' },
  ],
  state: 'Maharashtra',
  district: 'Pune',
  taluka: 'Khed',
  address: 'Village Khed, Taluka Khed, District Pune, Maharashtra - 410501',
  totalAcres: '12',
  irrigation: 'Drip Irrigation',
  irrigationSub: 'Automated System',
  lastContact: '2 days ago',
  nextFollowup: 'Oct 15, 2023',
  primaryCrop: { name: 'Cotton', stage: 'Growing Stage', progress: 65 },
  secondaryCrop: { name: 'Maize', stage: 'Early Growth', progress: 30 },
  agent: {
    name: 'Rahul Patil',
    role: 'District Agent • Pune North',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  stats: { totalLand: '24.5', activeFields: '3', irrigated: '18.2', activeCrops: '2' },
}

export function getFarmerDetail(id) {
  const listFarmer = farmersData.find((f) => f.id === id)
  const base = listFarmer || farmersData[0]

  return {
    ...base,
    ...defaultDetail,
    id: base.id,
    name: base.name === 'Amit Patel' ? 'Ramesh Kumar' : base.name,
    phone: base.phone,
    avatar:
      base.avatar ||
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    fieldImage:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    mapImage:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
  }
}
