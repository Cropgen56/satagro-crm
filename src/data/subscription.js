export const subscriptionKpis = [
  {
    label: 'Total Active Plans',
    value: '1,284',
    icon: 'check-circle',
    trend: '+12% vs last month',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    label: 'Expiring Soon',
    value: '42',
    icon: 'alert-triangle',
    trend: 'Needs Action',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    label: 'Expired Plans',
    value: '18',
    icon: 'x-circle',
    trend: '-4% decrease',
    color: 'bg-red-50 text-red-500',
  },
  {
    label: 'Monthly Revenue',
    value: '₹4.2M',
    icon: 'wallet',
    trend: 'Current Month',
    color: 'bg-green-50 text-green-600',
  },
  {
    label: 'Renewals (Jan)',
    value: '156',
    icon: 'refresh-cw',
    trend: 'This Month',
    color: 'bg-blue-50 text-blue-600',
  },
]

export const subscriptionFilters = {
  status: ['All', 'Active', 'Expiring Soon', 'Expired', 'Trial'],
  planTypes: ['Basic', 'Standard', 'Premium'],
  districts: ['Pune Central', 'Baramati', 'Mulshi', 'Haveli'],
  agents: ['Ravi K.', 'Anil S.', 'Vijay D.', 'Amol K.'],
  expiry: ['Next 7 Days', 'Next 30 Days', 'Next 90 Days'],
}

export const subscriptionsData = [
  {
    id: 'SUB-2024-001',
    farmer: {
      name: 'Rajesh Deshmukh',
      district: 'Baramati District',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
      online: true,
    },
    subscriptionId: 'CG-SUB-2024-001',
    plan: {
      name: 'Premium',
      badge: 'bg-emerald-700 text-white',
    },
    duration: {
      start: 'Oct 12, 2023',
      end: 'Jan 15, 2024',
    },
    amount: '₹24,500',
    status: {
      label: 'Expiring Soon',
      badge: 'bg-amber-100 text-amber-700',
      icon: 'clock',
    },
    agent: {
      name: 'Ravi K.',
      initials: 'RK',
      color: 'bg-emerald-800 text-white',
    },
    action: {
      label: 'Renew Now',
      variant: 'primary',
    },
  },

  {
    id: 'SUB-2024-042',
    farmer: {
      name: 'Sunita Patil',
      district: 'Mulshi Cluster',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
      online: true,
    },
    subscriptionId: 'CG-SUB-2024-042',
    plan: {
      name: 'Standard',
      badge: 'bg-cyan-100 text-cyan-700',
    },
    duration: {
      start: 'Jan 02, 2024',
      end: 'Jul 02, 2024',
    },
    amount: '₹12,000',
    status: {
      label: 'Active',
      badge: 'bg-teal-50 text-teal-700',
      icon: 'check-circle',
    },
    agent: {
      name: 'Anil S.',
      initials: 'AS',
      color: 'bg-emerald-800 text-white',
    },
    action: {
      label: 'Manage',
      variant: 'secondary',
    },
  },

  {
    id: 'SUB-2024-098',
    farmer: {
      name: 'Ganesh More',
      district: 'Haveli District',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
      online: false,
    },
    subscriptionId: 'CG-SUB-2024-098',
    plan: {
      name: 'Basic (Trial)',
      badge: 'bg-gray-100 text-gray-600',
    },
    duration: {
      start: 'Jan 10, 2024',
      end: 'Jan 24, 2024',
    },
    amount: '₹0',
    status: {
      label: 'Free Trial',
      badge: 'bg-sky-50 text-sky-700',
      icon: 'badge',
    },
    agent: {
      name: 'Vijay D.',
      initials: 'VD',
      color: 'bg-emerald-700 text-white',
    },
    action: {
      label: 'Upgrade',
      variant: 'primary',
    },
  },

  {
    id: 'SUB-2023-882',
    farmer: {
      name: 'Vikas Kadam',
      district: 'Shirur North',
      avatar:
        'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=120&h=120&fit=crop&crop=face',
      online: false,
    },
    subscriptionId: 'CG-SUB-2023-882',
    plan: {
      name: 'Premium',
      badge: 'bg-emerald-700 text-white',
    },
    duration: {
      start: 'Dec 01, 2022',
      end: 'Dec 01, 2023',
    },
    amount: '₹24,500',
    status: {
      label: 'Expired',
      badge: 'bg-red-100 text-red-600',
      icon: 'x-circle',
    },
    agent: {
      name: 'Amol K.',
      initials: 'AK',
      color: 'bg-slate-300 text-slate-700',
    },
    action: {
      label: 'Reactivate',
      variant: 'danger',
    },
  },
]

export const SUBSCRIPTION_DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'payments', label: 'Payments' },
  { id: 'renewals', label: 'Renewals' },
  { id: 'activity', label: 'Activity' },
]

export const subscriptionPlans = [
  {
    id: 'basic',
    label: 'Basic',
    price: '₹0',
    duration: '14 Days Trial',
    features: ['Limited Advisory', 'Basic Reports'],
  },
  {
    id: 'standard',
    label: 'Standard',
    price: '₹12,000',
    duration: '6 Months',
    features: ['Crop Advisory', 'Farm Monitoring', 'Priority Support'],
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '₹24,500',
    duration: '12 Months',
    features: [
      'Advanced Insights',
      'Satellite Monitoring',
      'AI Recommendations',
      'Dedicated Support',
    ],
  },
]

export const recentRenewals = [
  {
    icon: 'refresh-cw',
    color: 'bg-green-100 text-green-700',
    title: 'Rajesh Deshmukh renewed Premium Plan',
    time: '2 hours ago',
    meta: 'Handled by Ravi K.',
  },
  {
    icon: 'alert-circle',
    color: 'bg-amber-100 text-amber-700',
    title: '42 subscriptions expiring in next 30 days',
    time: 'Today',
    meta: 'Action Required',
  },
  {
    icon: 'x-circle',
    color: 'bg-red-100 text-red-700',
    title: 'Vikas Kadam subscription expired',
    time: 'Yesterday',
    meta: 'Pending Reactivation',
  },
]

export const initialSubscriptionForm = {
  farmer: 'rajesh-deshmukh',
  plan: 'premium',
  assignedAgent: 'ravi-k',
  startDate: '2024-01-15',
  endDate: '2025-01-15',
  paymentStatus: 'Paid',
  renewalReminder: true,
  notes: '',
}

export const subscriptionFarmers = [
  {
    id: 'rajesh-deshmukh',
    name: 'Rajesh Deshmukh',
    displayId: 'FRM-229',
    village: 'Baramati, Pune',
    tier: 'GOLD TIER',
    risk: 'Low',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    recent: [
      { title: 'Premium Plan Activated', time: '12 days ago' },
      { title: 'Satellite Advisory Viewed', time: '2 days ago' },
    ],
  },
]

export const subscriptionAgents = [
  {
    id: 'ravi-k',
    name: 'Ravi K.',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: 'anil-s',
    name: 'Anil S.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
  },
]

export function getSubscriptionById(id) {
  const subscription =
    subscriptionsData.find((s) => s.id === id) || subscriptionsData[0]

  return {
    ...subscription,

    title: `${subscription.plan.name} Subscription`,
    displayId: subscription.subscriptionId,

    badges: [
      {
        label: subscription.status.label,
        className: subscription.status.badge,
      },
      {
        label: subscription.plan.name,
        className: subscription.plan.badge,
      },
    ],

    assignedOfficer: {
      name: subscription.agent.name,
      role: 'SUBSCRIPTION OFFICER',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
    },

    subscriptionInfo: {
      plan: subscription.plan.name,
      startDate: subscription.duration.start,
      expiryDate: subscription.duration.end,
      amount: subscription.amount,
      renewalType: 'Auto Renewal',
    },

    linkedFarmer: {
      name: subscription.farmer.name,
      district: subscription.farmer.district,
      tier: 'Gold Tier',
    },

    paymentHistory: [
      {
        invoice: 'INV-2024-201',
        amount: subscription.amount,
        date: 'Jan 12, 2024',
        status: 'Paid',
      },
    ],

    renewal: {
      nextRenewal: 'Jan 15, 2025',
      reminderSent: true,
      paymentStatus: 'Completed',
    },

    usageInsights: {
      advisoryViews: 124,
      farmVisits: 18,
      reportsGenerated: 32,
      activeSince: '2023',
    },

    timeline: [
      {
        title: 'Subscription Created',
        date: 'Jan 10, 2024',
        done: true,
      },
      {
        title: 'Payment Received',
        date: 'Jan 12, 2024',
        done: true,
      },
      {
        title: 'Plan Activated',
        date: 'Jan 15, 2024',
        done: true,
      },
      {
        title: 'Renewal Reminder Scheduled',
        date: 'Dec 15, 2024',
        done: false,
      },
    ],

    notes: [
      {
        author: subscription.agent.name,
        date: 'Jan 14, 2024',
        text: 'Farmer opted for Premium package with yearly renewal.',
      },
    ],

    attachments: [],
  }
}