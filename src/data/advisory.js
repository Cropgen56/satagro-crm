
export const advisoryKpis = [
  {
    label: 'Total Advisories',
    value: '1,482',
    icon: 'clipboard',
    trend: '+8% this week',
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    label: 'Active Campaigns',
    value: '24',
    icon: 'megaphone',
    trend: 'Running Live',
    color: 'bg-teal-50 text-teal-700',
  },
  {
    label: 'Sent Today',
    value: '8,920',
    icon: 'send',
    trend: '+14% today',
    color: 'bg-cyan-50 text-cyan-700',
  },
  {
    label: 'Pending Delivery',
    value: '124',
    icon: 'clock',
    trend: 'Needs Review',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'High-Risk Alerts',
    value: '03',
    icon: 'alert-triangle',
    trend: 'Critical',
    color: 'bg-red-50 text-red-600',
  },
]

export const advisoryFilters = {
  types: [
    'Advisory Type',
    'Pest Alert',
    'Irrigation',
    'Fertilizer',
    'Weather',
    'Crop Advisory',
  ],

  crops: [
    'Crop Type',
    'Rice',
    'Wheat',
    'Cotton',
    'Sugarcane',
    'Maize',
  ],

  districts: [
    'District',
    'Pune',
    'Nashik',
    'Baramati',
    'Nagpur',
    'Satara',
  ],

  status: [
    'Delivery Status',
    'Sent',
    'Scheduled',
    'Draft',
    'Pending',
  ],

  createdBy: [
    'Created By',
    'System Generated',
    'Sarah Miller',
    'John Doe',
  ],

  date: [
    'Date Range',
    'Today',
    'Last 7 Days',
    'Last 30 Days',
    'This Month',
  ],
}

export const advisoryData = [
  {
    id: 'ADV-001',

    advisory: {
      title: 'Pest Outbreak Warning: Fall Armyworm',
      subtitle: 'High Priority Alert',
      icon: 'bug',
      color: 'bg-red-100 text-red-600',
    },

    cropType: 'Maize, Cotton',

    audience: 'Southern Districts',

    delivery: ['sms', 'push'],

    createdBy: 'System Generated',

    sentDate: 'Oct 24, 08:30 AM',

    status: {
      label: 'Sent',
      badge: 'bg-red-100 text-red-700',
    },

    reach: '45,200',
  },

  {
    id: 'ADV-002',

    advisory: {
      title: 'Weekly Irrigation Schedule',
      subtitle: 'Standard Recommendation',
      icon: 'droplets',
      color: 'bg-teal-100 text-teal-700',
    },

    cropType: 'Rice',

    audience: 'Pune District',

    delivery: ['push'],

    createdBy: 'Sarah Miller',

    sentDate: 'Oct 24, 10:15 AM',

    status: {
      label: 'Sent',
      badge: 'bg-emerald-100 text-emerald-700',
    },

    reach: '12,140',
  },

  {
    id: 'ADV-003',

    advisory: {
      title: 'Fertilizer Application: Phase 2',
      subtitle: 'Soil Nutrient Management',
      icon: 'sprout',
      color: 'bg-gray-100 text-emerald-700',
    },

    cropType: 'Wheat',

    audience: 'Nashik Cluster',

    delivery: ['sms'],

    createdBy: 'John Doe',

    sentDate: 'Oct 25, 09:00 AM',

    status: {
      label: 'Scheduled',
      badge: 'bg-cyan-100 text-cyan-700',
    },

    reach: '-',
  },

  {
    id: 'ADV-004',

    advisory: {
      title: 'Seed Selection for Winter Crop',
      subtitle: 'Pre-Sowing Advisory',
      icon: 'leaf',
      color: 'bg-gray-100 text-gray-600',
    },

    cropType: 'Multiple',

    audience: 'Maharashtra North',

    delivery: ['broadcast'],

    createdBy: 'Sarah Miller',

    sentDate: '-',

    status: {
      label: 'Draft',
      badge: 'bg-gray-100 text-gray-600',
    },

    reach: '-',
  },
]

