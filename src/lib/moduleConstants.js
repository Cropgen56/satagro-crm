/** Structural constants for tabs — no mock business records. */

export const FARMER_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'fields', label: 'Farms' },
  { id: 'reports', label: 'Field report' },
  { id: 'advisory', label: 'Advisory' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'product_cards', label: 'Product cards' },
  { id: 'profile', label: 'Profile' },
]

/** Tabs a read-only client login sees on a farmer: monitoring only. */
export const CLIENT_VIEWER_FARMER_TAB_IDS = new Set([
  'overview',
  'fields',
  'reports',
  'advisory',
  'profile',
])
