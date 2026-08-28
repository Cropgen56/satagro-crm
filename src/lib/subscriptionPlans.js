import { apiRequest } from '@/lib/api'

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
  'cropCalendar',
  'zoningAnalysis',
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
  cropCalendar: 'Crop calendar',
  zoningAnalysis: 'Zoning & VRA analysis',
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
  cropCalendar: false,
  zoningAnalysis: false,
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
  const monthlyRupees = Number(form.monthlyPrice)
  const yearlyRupees = Number(form.yearlyPrice)

  return {
    name: String(form.name || '').trim(),
    slug: String(form.slug || '').trim(),
    description: String(form.description || '').trim(),
    // BioDrops plans are platform-agnostic — one plan covers mobile and web.
    platform: 'all',
    brand: 'biodrops',
    isInternal: Boolean(form.isInternal),
    isTrialEnabled: Boolean(form.isTrialEnabled),
    trialDays: form.isTrialEnabled ? Number(form.trialDays) || 15 : 0,
    active: form.active !== false,
    // BioDrops plans are always flat acre packages now, never per-acre pricing.
    maxAcres: Number(form.maxAcres) || null,
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

export function isTierPlan(plan) {
  return Number.isFinite(Number(plan?.maxAcres)) && Number(plan?.maxAcres) > 0
}

/** Cap check is informational only — BioDrops tiers warn, they don't block. */
export function getTierCapWarning(plan, fieldAcres) {
  if (!isTierPlan(plan)) return null
  const maxAcres = Number(plan.maxAcres)
  const acres = Number(fieldAcres) || 0
  if (acres > maxAcres + 0.05) {
    return `This field is ${acres.toFixed(2)} acre. The ${plan.name} plan covers up to ${maxAcres} acre.`
  }
  return null
}

export function fetchSubscriptionPlans() {
  // BioDrops plans are platform-agnostic now — no platform filter needed.
  return apiRequest('/crm/subscription-plans')
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
