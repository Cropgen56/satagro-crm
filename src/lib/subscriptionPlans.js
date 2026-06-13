import { apiRequest, buildQueryString } from '@/lib/api'

export const PLAN_FEATURE_KEYS = [
  'satelliteImagery',
  'cropHealthAndYield',
  'soilAnalysisAndHealth',
  'weatherAnalytics',
  'vegetationIndices',
  'waterIndices',
  'evapotranspirationMonitoring',
  'agronomicInsights',
  'weeklyAdvisoryReports',
  'cropGrowthMonitoring',
  'farmOperationsManagement',
  'diseaseDetectionAlerts',
  'smartAdvisorySystem',
  'soilReportGeneration',
]

export const PLAN_FEATURE_LABELS = {
  satelliteImagery: 'Satellite crop monitoring',
  cropHealthAndYield: 'Crop health & yield insights',
  soilAnalysisAndHealth: 'Soil health analysis',
  weatherAnalytics: 'Advanced weather analytics',
  vegetationIndices: 'Vegetation indices',
  waterIndices: 'Water indices',
  evapotranspirationMonitoring: 'Evapotranspiration monitoring',
  agronomicInsights: 'Agronomic insights',
  weeklyAdvisoryReports: 'Weekly advisory reports',
  cropGrowthMonitoring: 'Crop growth monitoring',
  farmOperationsManagement: 'Farm operations management',
  diseaseDetectionAlerts: 'Disease detection alerts',
  smartAdvisorySystem: 'AI smart advisory system',
  soilReportGeneration: 'Soil report generation',
}

const DEFAULT_FEATURES = {
  satelliteImagery: true,
  cropHealthAndYield: true,
  soilAnalysisAndHealth: true,
  weatherAnalytics: true,
  vegetationIndices: true,
  waterIndices: false,
  evapotranspirationMonitoring: false,
  agronomicInsights: true,
  weeklyAdvisoryReports: true,
  cropGrowthMonitoring: true,
  farmOperationsManagement: false,
  diseaseDetectionAlerts: true,
  smartAdvisorySystem: true,
  soilReportGeneration: false,
}

export function getDefaultPlanFeatures() {
  return { ...DEFAULT_FEATURES }
}

export function countEnabledFeatures(features) {
  return PLAN_FEATURE_KEYS.filter((key) => features?.[key]).length
}

export function summarizePlanFeatures(features, maxLabels = 3) {
  const enabled = PLAN_FEATURE_KEYS.filter((key) => features?.[key])
  if (enabled.length === 0) return { count: 0, labels: [], remainder: 0 }

  const labels = enabled
    .slice(0, maxLabels)
    .map((key) => PLAN_FEATURE_LABELS[key])
  const remainder = Math.max(0, enabled.length - maxLabels)

  return { count: enabled.length, labels, remainder }
}

export function slugifyPlanName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildPlanPayload(form) {
  const monthlyRupees = Number(form.monthlyPricePerAcre)
  const yearlyRupees = Number(form.yearlyPricePerAcre)

  return {
    name: String(form.name || '').trim(),
    slug: String(form.slug || '').trim(),
    description: String(form.description || '').trim(),
    platform: form.platform || 'mobile',
    brand: 'biodrops',
    isInternal: Boolean(form.isInternal),
    isTrialEnabled: Boolean(form.isTrialEnabled),
    trialDays: form.isTrialEnabled ? Number(form.trialDays) || 15 : 0,
    active: form.active !== false,
    pricing: [
      {
        currency: 'INR',
        billingCycle: 'monthly',
        pricePerUnitMinor: Math.round(monthlyRupees * 100),
        unit: 'acre',
      },
      {
        currency: 'INR',
        billingCycle: 'yearly',
        pricePerUnitMinor: Math.round(yearlyRupees * 100),
        unit: 'acre',
      },
    ],
    features: { ...DEFAULT_FEATURES, ...(form.features || {}) },
  }
}

export function fetchSubscriptionPlans(platform) {
  const params = {}
  if (platform === 'mobile' || platform === 'web') {
    params.platform = platform
  }
  return apiRequest(`/crm/subscription-plans${buildQueryString(params)}`)
}

export function fetchSubscriptionPlanById(planId) {
  return apiRequest(`/crm/subscription-plans/${planId}`)
}

export function createSubscriptionPlan(payload) {
  return apiRequest('/crm/subscription-plans', {
    method: 'POST',
    body: payload,
  })
}

export function updateSubscriptionPlan(planId, payload) {
  return apiRequest(`/crm/subscription-plans/${planId}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteSubscriptionPlan(planId) {
  return apiRequest(`/crm/subscription-plans/${planId}`, {
    method: 'DELETE',
  })
}

export function formatPricePerAcre(plan, billingCycle) {
  const row = (plan?.pricing || []).find(
    (p) => p.billingCycle === billingCycle && p.currency === 'INR',
  )
  if (!row) return '—'
  return `₹${(Number(row.pricePerUnitMinor) / 100).toLocaleString('en-IN')}`
}
