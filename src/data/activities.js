export const activitiesKpis = [
  { label: 'Total Activities', value: '1,248', icon: 'clipboard', color: 'bg-teal-50 text-teal-600' },
  { label: 'Completed', value: '852', icon: 'check', color: 'bg-green-50 text-green-600' },
  { label: 'Pending', value: '312', icon: 'clock', color: 'bg-amber-50 text-amber-600' },
  { label: 'Overdue', value: '84', icon: 'alert', color: 'bg-red-50 text-red-500' },
  { label: "Today's Visits", value: '24', icon: 'calendar', color: 'bg-brand-light text-brand-primary' },
]

export const activitiesData = [
  {
    id: 'ACT-8842',
    type: 'Soil Testing',
    typeIcon: 'flask',
    farmer: { name: 'Anand Deshmukh', id: 'FRM-229', initials: 'AD', color: 'bg-teal-100 text-teal-700' },
    agent: { name: 'Sunita Rao', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
    dateTime: 'Oct 28, 2023 · 10:00 AM',
    status: 'scheduled',
    notes: 'Collect 4 samples from Zone E',
  },
  {
    id: 'ACT-8831',
    type: 'Farm Visit',
    typeIcon: 'tractor',
    farmer: { name: 'Ramesh Kumar', id: 'FRM-8921', initials: 'RK', color: 'bg-blue-100 text-blue-700' },
    agent: { name: 'Arjun Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
    dateTime: 'Oct 27, 2023 · 2:30 PM',
    status: 'completed',
    notes: 'Moisture levels optimal in Plot A',
  },
  {
    id: 'ACT-8820',
    type: 'Follow-up Call',
    typeIcon: 'phone',
    farmer: { name: 'Priya Kulkarni', id: 'FRM-6533', initials: 'PK', color: 'bg-purple-100 text-purple-700' },
    agent: { name: 'Rahul Patil', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    dateTime: 'Oct 26, 2023 · 11:00 AM',
    status: 'pending',
    notes: 'Discuss subscription renewal',
  },
  {
    id: 'ACT-8815',
    type: 'Advisory Meeting',
    typeIcon: 'users',
    farmer: { name: 'Vikram Jadhav', id: 'FRM-7742', initials: 'VJ', color: 'bg-orange-100 text-orange-700' },
    agent: { name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    dateTime: 'Oct 25, 2023 · 9:00 AM',
    status: 'missed',
    notes: 'Farmer unavailable — reschedule needed',
  },
  {
    id: 'ACT-8802',
    type: 'Irrigation Check',
    typeIcon: 'droplets',
    farmer: { name: 'Sunita Patil', id: 'FRM-6610', initials: 'SP', color: 'bg-green-100 text-green-700' },
    agent: { name: 'Arjun Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
    dateTime: 'Oct 24, 2023 · 8:00 AM',
    status: 'completed',
    notes: 'Drip system functioning normally',
  },
]

export const recentEngagements = [
  {
    icon: 'check',
    color: 'bg-green-100 text-green-700',
    title: 'Arjun Singh completed Soil Testing for Anand Deshmukh',
    time: '2 hours ago',
    meta: 'District: Pune West',
  },
  {
    icon: 'phone',
    color: 'bg-blue-100 text-blue-700',
    title: 'Rahul Patil logged a follow-up call with Priya Kulkarni',
    time: '5 hours ago',
    meta: 'District: Kolhapur',
  },
  {
    icon: 'alert',
    color: 'bg-red-100 text-red-700',
    title: 'Missed advisory meeting — Vikram Jadhav',
    time: 'Yesterday',
    meta: 'District: Aurangabad',
  },
]

export const ACTIVITY_DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'notes', label: 'Notes' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'attachments', label: 'Attachments' },
]

export const activityTypes = [
  { id: 'farm-visit', label: 'Farm Visit', icon: 'tractor' },
  { id: 'call', label: 'Call', icon: 'phone' },
  { id: 'meeting', label: 'Meeting', icon: 'users' },
  { id: 'follow-up', label: 'Follow-up', icon: 'refresh' },
  { id: 'advisory', label: 'Advisory', icon: 'leaf' },
]

export const priorityLevels = ['Low', 'Medium', 'High']

export const initialLogActivityForm = {
  activityType: 'farm-visit',
  farmer: 'anand-deshmukh',
  assignedAgent: 'sunita-rao',
  date: '2024-10-25',
  startTime: '10:00',
  endTime: '11:30',
  priority: 'Medium',
  status: 'Scheduled',
  instructions: '',
}

export const logActivityFarmers = [
  {
    id: 'anand-deshmukh',
    name: 'Anand Deshmukh',
    displayId: 'FRM-482',
    village: 'Baramati, Pune District',
    tier: 'GOLD TIER',
    lastActivity: '14 Oct 2024',
    risk: 'Low',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face',
    recent: [
      { title: 'Soil Nutrients Check', time: 'Completed 3 days ago' },
      { title: 'Pre-Harvest Audit', time: 'Completed 12 days ago' },
    ],
  },
]

export const logActivityAgents = [
  { id: 'sunita-rao', name: 'Sunita Rao', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
  { id: 'arjun-singh', name: 'Arjun Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
]

export function getActivityById(id) {
  const activity = activitiesData.find((a) => a.id === id) || activitiesData[0]
  return {
    ...activity,
    title: `${activity.type} Visit`,
    displayId: activity.id,
    badges: [
      { label: 'Scheduled', className: 'bg-green-50 text-green-700' },
      { label: 'High Priority', className: 'bg-red-50 text-red-600' },
    ],
    officer: {
      name: 'Sunita Rao',
      role: 'FIELD OFFICER',
      avatar: activity.agent.avatar,
    },
    info: {
      type: 'Farm Visit',
      date: 'Oct 28, 2023',
      time: '10:00 - 11:30 AM',
      duration: '1.5 Hours',
    },
    linkedFarmer: {
      name: 'Anand Deshmukh',
      id: 'FRM-229',
      village: 'Baramati',
      tier: 'Gold Tier',
      initials: 'AD',
      color: 'bg-teal-100 text-teal-700',
    },
    instructions:
      'Perform NPK soil test on Plot A and Plot B. Collect samples from 4 quadrants per plot. Label samples with farmer ID and plot number.',
    fieldRemarks: 'No remarks added yet...',
    followUp: {
      date: 'NOV 05',
      title: 'Next Scheduled Visit',
      desc: 'Post-test analysis discussion',
      priority: 'Medium Priority',
    },
    insights: {
      lastActivity: '14 Oct 2023',
      daysSinceVisit: '12 Days',
      riskLevel: 'Low',
      pendingTasks: 3,
    },
    timeline: [
      { title: 'Activity Created', date: 'Oct 20, 2023', done: true },
      { title: 'Agent Assigned', date: 'Oct 21, 2023', done: true },
      { title: 'Notes Added', date: 'Oct 21, 2023', done: true },
      { title: 'Status Updated', date: 'Oct 22, 2023', done: false },
    ],
    notes: [
      { author: 'Sunita Rao', date: 'Oct 21, 2023', text: 'Farmer confirmed availability for morning slot.' },
    ],
    attachments: [],
  }
}
