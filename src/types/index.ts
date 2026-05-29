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

export interface HoursEntry {
  days: string        // "Mon–Fri"
  open: string        // "5:00 AM"
  close: string       // "10:00 PM"
  note?: string       // "24/7 CAC access available"
}

export interface EligibilityRule {
  group: string       // "Active Duty"
  allowed: boolean
  note?: string       // "E-1 through O-10"
}

export interface ContactInfo {
  phone?: string
  email?: string
  website?: string
  buildingNumber?: string
  mapLink?: string
}

export interface PopularTime {
  hour: number        // 0–23
  day: string         // "Mon" | "Tue" | ...
  relativeLoad: number // 0–100
}

export interface Program {
  id: string
  name: string
  category: ProgramCategory
  facility: string
  description: string
  // Simple string version (backward compat)
  hours: string
  eligibility: string[]
  bookable: boolean
  price: number | null
  tags: string[]
  image?: string
  // ── Extended fields (Layer 1) ──
  extendedDescription?: string
  highlights?: string[]
  structuredHours?: HoursEntry[]
  structuredEligibility?: EligibilityRule[]
  restrictions?: string[]
  amenities?: string[]
  contactInfo?: ContactInfo
  registrationRequired?: boolean
  waitlistAvailable?: boolean
  currentWaitlistCount?: number
  popularTimes?: PopularTime[]
  photos?: string[]            // placeholder colour strings e.g. "#003087"
  rating?: number              // 0.0–5.0
  reviewCount?: number
  lastUpdated?: string         // ISO date string
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

// ─── Staff Portal / Reservation types (Prompt 07) ───────────────────────────

export type ReservationStatus =
  | "pending" | "confirmed" | "waitlisted"
  | "rescheduled" | "cancelled" | "completed" | "no-show"

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partial" | "waived"

export interface Reservation {
  id: string
  patronId: string
  patronName: string
  patronRank: string
  patronPhone: string
  patronEmail: string
  programId: string
  programName: string
  facilityName: string
  category: ProgramCategory
  date: string
  time: string
  duration: number
  partySize: number
  status: ReservationStatus
  paymentStatus: PaymentStatus
  paymentAmount: number
  paymentMethod: "MCCS Pay" | "Credit Card" | "Cash" | "Pending"
  notes: string
  createdAt: string
  updatedAt: string
  staffNotes: string
  confirmationSentAt: string | null
  reminderSentAt: string | null
}

export interface Dependent {
  id: string
  firstName: string
  lastName: string
  relationship: "Spouse" | "Child" | "Parent" | "Other"
  dateOfBirth: string
  age: number
  eligibilityGroups: string[]
  specialNeeds?: string
}

export interface PaymentMethod {
  id: string
  type: "MCCS Pay" | "Visa" | "Mastercard" | "Discover" | "AMEX"
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  nickname?: string
}

export interface PatronPreferences {
  favoriteCategories: ProgramCategory[]
  preferredNotifications: ("email" | "sms" | "push")[]
  dietaryRestrictions: string[]
  accessibilityNeeds: string[]
  preferredLanguage: string
  marketingOptIn: boolean
}

export interface BookingHistoryEntry {
  reservationId: string
  programName: string
  category: ProgramCategory
  date: string
  amount: number
  status: ReservationStatus
  csatScore?: number
  review?: string
}

export type LoyaltyTier = "Standard" | "Active" | "Elite"

export interface Patron {
  id: string
  firstName: string
  lastName: string
  rank: string
  branch: "USMC" | "USN" | "USA" | "USAF" | "USSF" | "Retired" | "DoD Civilian"
  unit: string
  edipi: string
  dodId: string
  email: string
  phone: string
  address: string
  dependents: Dependent[]
  paymentMethods: PaymentMethod[]
  preferredPaymentId: string
  preferences: PatronPreferences
  bookingHistory: BookingHistoryEntry[]
  totalBookings: number
  totalSpend: number
  memberSince: string
  lastActivity: string
  loyaltyTier: LoyaltyTier
  csatAvg: number
  eligibilityGroups: string[]
  eligibilityVerified: boolean
  eligibilityExpiry: string
}

export interface PaymentTransaction {
  id: string
  reservationId: string
  patronId: string
  patronName: string
  amount: number
  currency: "USD"
  status: "pending" | "completed" | "refunded" | "failed" | "partial"
  method: string
  last4?: string
  processedAt: string | null
  refundedAt: string | null
  refundAmount?: number
  refundReason?: string
  staffId: string
  notes: string
  category: ProgramCategory
  programName: string
}

// ─── Action / Recommendation types (Layer 2) ────────────────────────────────

export type ActionStatus = "pending" | "in_progress" | "completed" | "dismissed"
export type ActionImpact = "high" | "medium" | "low"

export interface ActionStep {
  id: string
  label: string
  owner: string
  estimatedTime: string
}

export interface Action {
  id: string
  alertId?: string              // links back to Alert that triggered it
  title: string
  summary: string
  impact: ActionImpact
  category: ProgramCategory
  estimatedRevenue?: number
  estimatedPatrons?: number
  steps: ActionStep[]
  status: ActionStatus
  createdAt: string
}

// ─── Forecast types (Layer 3) ────────────────────────────────────────────────

export interface ForecastDataPoint {
  date: string
  predicted: number
  lower: number
  upper: number
  actual?: number | null
  event?: string
}

export type ForecastTrend = "increasing" | "decreasing" | "stable" | "seasonal"

export interface ForecastEntry {
  facilityId: string
  facilityName: string
  category: ProgramCategory
  month: string                 // "Jun 2026"
  forecastedVisits: number
  lowerBound: number
  upperBound: number
  staffingNeeded: number
  revenueProjection: number
  confidenceScore: number       // 0–100
  trend: ForecastTrend
  dataPoints: ForecastDataPoint[]
}

export interface HeatmapEntry {
  facilityId: string
  facilityName: string
  hour: number                  // 0–23
  dayOfWeek: string             // "Mon" | "Tue" | ...
  avgVisits: number
  peakMultiplier: number        // relative to facility avg
}

// ─── Utility type helpers ────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc"
