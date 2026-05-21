export const ADD_FARMER_STEPS = [
  { id: 1, label: 'Personal Details' },
  { id: 2, label: 'Location & Land' },
  { id: 3, label: 'Crop Details' },
  { id: 4, label: 'Subscription' },
  { id: 5, label: 'Review & Save' },
]

export const initialFarmerForm = {
  fullName: '',
  mobile: '',
  altPhone: '',
  gender: '',
  dob: '',
  state: '',
  district: '',
  village: '',
  address: '',
  landSize: '',
  landUnit: 'acres',
  irrigation: '',
  primaryCrop: '',
  secondaryCrops: [],
  season: 'Rabi',
  cropStage: 'Growing',
  assignedAgent: 'rahul-patil',
  plan: 'standard',
  internalNotes: '',
  confirmed: false,
}

export const cropOptions = [
  { id: 'cotton', label: 'Cotton', emoji: '🌿' },
  { id: 'wheat', label: 'Wheat', emoji: '🌾' },
  { id: 'rice', label: 'Rice', emoji: '🍚' },
  { id: 'sugarcane', label: 'Sugarcane', emoji: '🎋' },
  { id: 'soybean', label: 'Soybean', emoji: '🫘' },
]

export const secondaryCropOptions = ['Maize', 'Pulses', 'Groundnut', 'Chilli', 'Cotton']

export const seasons = ['Kharif', 'Rabi', 'Zaid']

export const cropStages = [
  { id: 'Sowing', label: 'Sowing', icon: '🌱' },
  { id: 'Growing', label: 'Growing', icon: '🌿' },
  { id: 'Flowering', label: 'Flowering', icon: '🌸' },
  { id: 'Harvest Ready', label: 'Harvest Ready', icon: '🌾' },
]

export const subscriptionPlans = [
  {
    id: 'none',
    name: 'No Plan',
    price: '₹0',
    period: '/mo',
    badge: 'PAY-AS-YOU-GO',
    features: ['Basic farm profile', 'Single crop cycle'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '₹499',
    period: '/mo',
    badge: '12 MONTHS',
    features: ['Smart soil analysis', 'Weather alerts'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹999',
    period: '/mo',
    badge: '12 MONTHS',
    popular: true,
    features: ['All Basic features', 'Satellite monitoring', 'Direct market access'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹1,999',
    period: '/mo',
    badge: '24 MONTHS',
    features: ['All Standard features', 'Yield insurance', 'Expert consultations'],
  },
]

export const fieldAgents = [
  {
    id: 'rahul-patil',
    name: 'Rahul Patil',
    role: 'District Agent • Pune West',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'arjun-sharma',
    name: 'Arjun Sharma',
    role: 'District Agent • North Region',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
]

export const states = ['Maharashtra', 'Gujarat', 'Punjab', 'Karnataka', 'Telangana']
export const districts = ['Pune', 'Mumbai', 'Nashik', 'Ahmedabad', 'Ludhiana']
export const villages = ['Khed', 'Baramati', 'Hadapsar', 'Anand', 'Ludhiana Rural']
export const irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'Rain-fed', 'Borewell']
