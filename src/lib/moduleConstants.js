/** Structural constants for forms and tabs — no mock business records. */

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
  season: '',
  cropStage: '',
  assignedAgent: '',
  plan: '',
  internalNotes: '',
  confirmed: false,
}

export const FARMER_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'fields', label: 'Fields' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'advisory', label: 'Advisory' },
  { id: 'activity', label: 'Activity' },
]

export const LEAD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'notes', label: 'Notes' },
]

export const TASK_DETAIL_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'activity', label: 'Activity' },
]

export const ACTIVITY_DETAIL_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'attachments', label: 'Attachments' },
]

export const SUBSCRIPTION_DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'billing', label: 'Billing' },
  { id: 'history', label: 'History' },
]

export const initialLeadForm = {
  name: '',
  phone: '',
  altPhone: '',
  source: '',
  status: '',
  state: '',
  district: '',
  village: '',
  assignedAgent: '',
  notes: '',
}

export const initialCreateTaskForm = {
  title: '',
  type: '',
  priority: '',
  dueDate: '',
  assignee: '',
  farmer: '',
  description: '',
}

export const initialLogActivityForm = {
  type: '',
  farmer: '',
  priority: '',
  date: '',
  notes: '',
  agent: '',
}

export const taskTypes = []
export const activityTypes = []
export const priorityLevels = ['Low', 'Medium', 'High']
export const taskStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled']

export const leadSources = []
export const leadStatuses = []
export const states = []
export const districts = {}
export const villages = {}
export const agents = []
export const fieldAgents = []
export const cropOptions = []
export const secondaryCropOptions = []
export const seasons = []
export const cropStages = []
export const subscriptionPlans = []
export const irrigationTypes = []

export const subscriptionFilters = {
  status: ['All Status'],
  planTypes: ['All Plans'],
  districts: ['All Districts'],
  agents: ['All Agents'],
  expiry: ['Any Time'],
}

export const advisoryFilters = {
  types: ['All Types'],
  crops: ['All Crops'],
  districts: ['All Districts'],
  agents: ['All Agents'],
  status: ['All Status'],
}
