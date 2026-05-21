export const tasksKpis = [
  { label: 'Total Tasks', value: '1,248', icon: 'clipboard', color: 'bg-green-50 text-green-600' },
  { label: 'Pending', value: '412', icon: 'clock', color: 'bg-teal-50 text-teal-600' },
  { label: 'In Progress', value: '285', icon: 'progress', color: 'bg-blue-50 text-blue-600' },
  { label: 'Completed', value: '531', icon: 'check', color: 'bg-green-50 text-green-600' },
  { label: 'Overdue', value: '20', icon: 'alert', color: 'bg-red-50 text-red-500' },
]

export const tasksData = [
  {
    id: 'TSK-201',
    title: 'Soil Sample Collection',
    farmer: 'Jonathan Smith Farm',
    agent: { name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
    priority: 'high',
    dueDate: 'Oct 12, 2023',
    dueSub: 'Tomorrow',
    dueUrgent: true,
    status: 'in-progress',
  },
  {
    id: 'TSK-198',
    title: 'Subscription Renewal Call',
    farmer: 'Ramesh Kumar',
    agent: { name: 'Marcus Thorne', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
    priority: 'medium',
    dueDate: 'Oct 15, 2023',
    dueSub: null,
    status: 'pending',
  },
  {
    id: 'TSK-195',
    title: 'Document Verification',
    farmer: 'Priya Kulkarni',
    agent: { name: 'Rahul Patil', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    priority: 'low',
    dueDate: 'Oct 18, 2023',
    dueSub: null,
    status: 'completed',
  },
  {
    id: 'TSK-192',
    title: 'Field Inspection - Plot B',
    farmer: 'Vikram Jadhav',
    agent: { name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
    priority: 'high',
    dueDate: 'Oct 08, 2023',
    dueSub: 'OVERDUE',
    dueUrgent: true,
    overdue: true,
    status: 'overdue',
  },
]

export const TASK_DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'comments', label: 'Comments (4)' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'attachments', label: 'Attachments (2)' },
]

export const taskTypes = [
  { id: 'farm-inspection', label: 'Farm Inspection', icon: 'eye' },
  { id: 'document', label: 'Document Collection', icon: 'file' },
  { id: 'follow-up', label: 'Follow-up', icon: 'refresh' },
  { id: 'subscription', label: 'Subscription Renewal', icon: 'credit' },
  { id: 'contact', label: 'Customer Contact', icon: 'phone' },
  { id: 'custom', label: 'Custom Task', icon: 'plus' },
]

export const priorityLevels = ['Low', 'Medium', 'High']
export const taskStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled']

export const initialCreateTaskForm = {
  taskType: 'farm-inspection',
  title: '',
  farmer: '',
  assignedUser: 'marcus-thorne',
  priority: 'Medium',
  status: 'Pending',
  dueDateTime: '',
  description: '',
}

export const assignableUsers = [
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    role: 'Field Agent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
  },
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    role: 'Field Agent',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
  },
]

export const createTaskFarmer = {
  name: 'Amara Nwosu',
  id: '#AGR-8921',
  village: 'Umunede Village',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
  headerImage:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
  lastActivity: 'Soil pH Test Completed',
  lastActivityTime: '2 days ago',
  pendingTasks: 3,
  subscription: 'Premium Plan',
  subscriptionExp: "Exp. Oct '24",
}

export function getTaskById(id) {
  const task = tasksData.find((t) => t.id === id) || tasksData[0]
  return {
    ...task,
    displayId: task.id,
    fullTitle: task.title,
    badges: [
      { label: 'IN PROGRESS', className: 'bg-blue-50 text-blue-700' },
      { label: 'HIGH PRIORITY', className: 'bg-red-50 text-red-600' },
    ],
    dueLabel: 'Due: Oct 12, 2023',
    assignee: {
      name: 'Amara Okafor',
      role: 'Field Agent',
      avatar: task.agent.avatar,
    },
    info: {
      type: 'Farm Inspection',
      description: 'Collect 5 soil samples from designated quadrants in Sector A & B. Label and seal per protocol.',
      created: 'Oct 05, 2023',
      dueDate: 'Oct 12, 2023',
    },
    farmer: {
      name: 'Jonathan Smith',
      id: '#FRM-342',
      village: 'Nandi Valley',
      tier: 'Premium',
      initials: 'JS',
      color: 'bg-teal-100 text-teal-700',
    },
    assignment: {
      assignedBy: 'Alex Rivers',
      assignedTo: 'Amara Okafor',
      assignedOn: 'Oct 05, 2023',
    },
    progress: 65,
    statusHistory: 'To Do → In Progress (Oct 06)',
    activities: [
      { title: 'Task Created', time: 'Oct 05, 10:20 AM', icon: 'create' },
      { title: 'Assigned to Amara Okafor', time: 'Oct 05, 10:25 AM', icon: 'assign' },
      { title: 'Comment Added', detail: '"Heading to Nandi Valley now."', time: 'Oct 05, 2:00 PM', icon: 'comment' },
      { title: 'Status Updated to In Progress', time: 'Oct 06, 09:15 AM', icon: 'status' },
    ],
    insights: {
      riskLevel: 'Low Risk',
      deadlines: [
        { label: 'Report Submission', due: 'In 2 days', urgent: true },
        { label: 'Follow-up Call', due: 'In 5 days', urgent: false },
      ],
      lastActivity: 'Field agent checked in 2 days ago',
    },
    pendingTasks: [
      { title: 'Water Source Verification', due: 'Oct 14' },
      { title: 'Asset Inventory Audit', due: 'Oct 16' },
      { title: 'Yield Projection Update', due: 'Oct 20' },
    ],
    mapImage:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80',
    comments: [
      { author: 'Amara Okafor', time: 'Oct 05, 2:00 PM', text: 'Heading to Nandi Valley now.' },
      { author: 'Alex Rivers', time: 'Oct 05, 10:30 AM', text: 'Please prioritize Sector A samples.' },
    ],
    timeline: [
      { title: 'Task Created', date: 'Oct 05, 10:20 AM', done: true },
      { title: 'Assigned', date: 'Oct 05, 10:25 AM', done: true },
      { title: 'In Progress', date: 'Oct 06, 09:15 AM', done: true },
      { title: 'Pending Completion', date: '—', done: false },
    ],
    attachments: [
      { name: 'sampling-protocol.pdf', size: '1.2 MB' },
      { name: 'sector-map.png', size: '850 KB' },
    ],
  }
}
