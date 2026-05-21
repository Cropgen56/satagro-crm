export const leadsKpis = [
  { label: 'Total Leads', value: '642', icon: 'users', color: 'bg-blue-50 text-blue-500' },
  { label: 'New Leads', value: '12', icon: 'sparkles', color: 'bg-blue-50 text-blue-500' },
  { label: 'Follow-ups', value: '45', icon: 'calendar', color: 'bg-orange-50 text-orange-500' },
  { label: 'Converted', value: '128', icon: 'check', color: 'bg-green-50 text-green-600' },
  { label: 'Lost Leads', value: '18', icon: 'x', color: 'bg-red-50 text-red-500' },
]

export const leadsData = [
  {
    id: 'L-4582',
    name: 'Anjali Deshmukh',
    phone: '+91 98230 45910',
    state: 'Maharashtra',
    city: 'Nashik',
    location: 'Nashik, Maharashtra',
    status: 'follow-up',
    source: 'referral',
    agent: { name: 'Ananya Singh', initials: 'AS', color: 'bg-teal-100 text-teal-700' },
    followUpDate: 'Oct 20, 2023',
    followUpLabel: 'Next Scheduled',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'L-4591',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    state: 'Maharashtra',
    city: 'Pune',
    location: 'Pune, Maharashtra',
    status: 'new',
    source: 'website',
    agent: { name: 'Rahul Patil', initials: 'RP', color: 'bg-blue-100 text-blue-700' },
    followUpDate: 'Oct 22, 2023',
    followUpLabel: 'Next Scheduled',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'L-4602',
    name: 'Priya Kulkarni',
    phone: '+91 98123 45678',
    state: 'Maharashtra',
    city: 'Kolhapur',
    location: 'Kolhapur, Maharashtra',
    status: 'new',
    source: 'field-visit',
    agent: { name: 'Arjun Sharma', initials: 'AS', color: 'bg-purple-100 text-purple-700' },
    followUpDate: 'Oct 25, 2023',
    followUpLabel: 'Next Scheduled',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'L-4610',
    name: 'Vikram Jadhav',
    phone: '+91 99012 34567',
    state: 'Maharashtra',
    city: 'Aurangabad',
    location: 'Aurangabad, Maharashtra',
    status: 'follow-up',
    source: 'referral',
    agent: { name: 'Ananya Singh', initials: 'AS', color: 'bg-teal-100 text-teal-700' },
    followUpDate: 'Oct 18, 2023',
    followUpLabel: 'Overdue',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'L-4625',
    name: 'Sunita Patil',
    phone: '+91 97654 32109',
    state: 'Maharashtra',
    city: 'Solapur',
    location: 'Solapur, Maharashtra',
    status: 'converted',
    source: 'campaign',
    agent: { name: 'Rahul Patil', initials: 'RP', color: 'bg-blue-100 text-blue-700' },
    followUpDate: '—',
    followUpLabel: 'Converted',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
  },
]

export const LEAD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'follow-ups', label: 'Follow-ups' },
  { id: 'notes', label: 'Notes' },
  { id: 'activity', label: 'Activity Timeline' },
]

export const initialLeadForm = {
  fullName: '',
  mobile: '',
  altPhone: '',
  state: 'Maharashtra',
  district: 'Pune',
  village: '',
  source: 'referral',
  status: 'new',
  assignedAgent: 'arjun-kulkarni',
  notes: '',
}

export const convertLeadDefaults = {
  fullName: 'Anjali Deshmukh',
  mobile: '+91 98230 45910',
  state: 'Maharashtra',
  district: 'Nashik',
  village: '',
  landSize: '',
  irrigation: '',
  primaryCrop: '',
  subscriptionPlan: 'growth-pro',
  assignedAgent: 'Ananya Singh',
  operationalNotes: '',
}

export const leadSources = [
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'field-visit', label: 'Field Visit' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'external', label: 'Referral (External)' },
]

export const leadStatuses = [
  { value: 'new', label: 'New' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
]

export const states = ['Maharashtra', 'Gujarat', 'Karnataka', 'Punjab']
export const districts = {
  Maharashtra: ['Pune', 'Nashik', 'Kolhapur', 'Aurangabad', 'Solapur'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
}
export const villages = {
  Pune: ['Indapur', 'Baramati', 'Shirur'],
  Nashik: ['Sinnar', 'Igatpuri', 'Niphad'],
}

export const agents = [
  { id: 'arjun-kulkarni', name: 'Arjun Kulkarni', initials: 'AK', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
  { id: 'ananya-singh', name: 'Ananya Singh', initials: 'AS', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
  { id: 'rahul-patil', name: 'Rahul Patil', initials: 'RP', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
]

export const irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'Rain-fed']
export const cropOptions = ['Cotton', 'Wheat', 'Maize', 'Sugarcane', 'Soybean']
export const subscriptionPlans = [
  { value: 'growth-pro', label: 'Growth Pro Monthly' },
  { value: 'standard', label: 'Standard Annual' },
  { value: 'enterprise', label: 'Premium Enterprise' },
]

export function getLeadById(id) {
  const lead = leadsData.find((l) => l.id === id) || leadsData[0]
  return {
    ...lead,
    displayId: lead.id,
    badges: [
      { label: 'FOLLOW-UP', className: 'bg-amber-50 text-amber-700' },
      { label: 'REFERRAL', className: 'bg-teal-50 text-teal-700' },
    ],
    nextFollowUp: 'Oct 20, 2023',
    priority: 'High',
    lastContacted: 'Oct 15, 2023',
    preferredTime: 'Morning (9 AM - 12 PM)',
    createdBy: 'System Admin',
    createdDate: 'Sep 15, 2023',
    leadHealth: 80,
    daysInactive: 2,
    conversionProbability: 85,
    mapImage:
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80',
    fieldImage:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    activities: [
      { type: 'call', title: 'Call Completed', user: 'Ananya Singh', time: '2 hours ago' },
      { type: 'note', title: 'New Note Added', detail: 'Discussed organic fertilizer options.', time: 'Yesterday' },
    ],
    notes: [
      { author: 'Ananya Singh', date: 'Oct 18, 2023', text: 'Farmer interested in Growth Pro plan. Follow up after harvest.' },
      { author: 'System', date: 'Sep 15, 2023', text: 'Lead created from referral program.' },
    ],
    followUps: [
      { date: 'Oct 20, 2023', type: 'Phone Call', status: 'scheduled', agent: 'Ananya Singh' },
      { date: 'Oct 15, 2023', type: 'Field Visit', status: 'completed', agent: 'Ananya Singh' },
    ],
  }
}

export function getConvertLeadData(id) {
  const lead = getLeadById(id)
  return {
    lead,
    summary: {
      name: lead.name,
      mobile: lead.phone,
      location: lead.location,
      agent: lead.agent.name,
      source: 'REFERRAL',
    },
    form: {
      ...convertLeadDefaults,
      fullName: lead.name,
      mobile: lead.phone,
      state: lead.state,
      district: lead.city === 'Nashik' ? 'Nashik' : lead.city,
      assignedAgent: lead.agent.name,
    },
  }
}
