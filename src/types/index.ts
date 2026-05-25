// ─── Category & shared enums ────────────────────────────────────────────────

export type ProgramCategory =
  | "fitness"
  | "childcare"
  | "dining"
  | "recreation"
  | "retail"
  | "lodging"
  | "family-support"
  | "education"

export type MetricUnit = "currency" | "percent" | "count" | "score"
export type TrendDirection = "up" | "down"
export type TrendSentiment = "positive" | "negative" | "neutral"
export type AlertLevel = "critical" | "warning" | "success" | "info"
export type InstallationStatus = "live" | "coming-soon"

// ─── Resident portal types ───────────────────────────────────────────────────

export interface Program {
  id: string
  name: string
  category: ProgramCategory
  facility: string
  description: string
  hours: string
  eligibility: string[]   // e.g. ["Active Duty", "Family Members", "Retirees"]
  bookable: boolean
  price: number | null    // null = free
  tags: string[]
  image?: string
}

export interface Facility {
  id: string
  name: string
  building: string
  area: string
  category: ProgramCategory
  capacity: number
  coordinates: {
    lat: number
    lng: number
  }
  programs: string[]      // program IDs
}

// ─── Dashboard / KPI types ───────────────────────────────────────────────────

export interface Metric {
  id: string
  label: string
  value: number
  unit: MetricUnit
  trend: number
  trendDirection: TrendDirection
  trendSentiment: TrendSentiment
  sparkline: number[]
}

export interface RevenueEntry {
  month: string           // "Jan 2025"
  year: number            // derived from month string
  category: ProgramCategory
  installation: string
  amount: number
  transactions: number
}

// Aggregated views returned by /api/revenue
export interface RevenueByMonth {
  month: string
  year: number
  total: number
  byCategory: Partial<Record<ProgramCategory, number>>
}

export interface RevenueByCategory {
  category: ProgramCategory
  total: number
  transactions: number
  avgMonthly: number
}

export interface UtilizationEntry {
  facilityId: string
  facilityName: string
  category: ProgramCategory
  capacityPct: number
  peakHour: string
  avgDailyVisits: number
  trend: number
  waitlistCount?: number  // only for childcare when overloaded
  alert?: "critical" | "warning" | "good"
}

export interface SatisfactionEntry {
  programId: string
  programName: string
  category: ProgramCategory
  csatScore: number
  npsScore: number
  responseCount: number
  topPositive: string
  topNegative: string
  trend: number
}

export interface Installation {
  id: string
  name: string
  location: string
  marinePopulation: number
  revenue: number | null
  csatAvg: number | null
  utilizationAvg: number | null
  status: InstallationStatus
}

// ─── Alerts ─────────────────────────────────────────────────────────────────

export interface Alert {
  id: string
  level: AlertLevel
  title: string
  message: string
  category: ProgramCategory
  metric: string
  value: string | number
  action?: string
}

// ─── API response wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

// ─── Utility type helpers ────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc"
