import { NextRequest, NextResponse } from "next/server"
import rawRevenue from "@/data/revenue.json"
import type {
  RevenueEntry,
  RevenueByMonth,
  RevenueByCategory,
  ProgramCategory,
  ApiResponse,
} from "@/types"
import { yearFromMonth, compareMonths } from "@/lib/utils"

// Hydrate year field from the month string at load time
const revenue: RevenueEntry[] = (rawRevenue as Omit<RevenueEntry, "year">[]).map(
  (r) => ({ ...r, year: yearFromMonth(r.month) })
)

// Fiscal year = Jun → May. Last 12 months ending current month (May 2026).
const FISCAL_MONTHS = [
  "Jun 2025","Jul 2025","Aug 2025","Sep 2025","Oct 2025","Nov 2025",
  "Dec 2025","Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026",
]
const PRIOR_FISCAL_MONTHS = [
  "Jun 2024","Jul 2024","Aug 2024","Sep 2024","Oct 2024","Nov 2024",
  "Dec 2024","Jan 2025","Feb 2025","Mar 2025","Apr 2025","May 2025",
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const yearParam     = searchParams.get("year")   // optional calendar-year override
  const categoryParam = searchParams.get("category")
  const view          = searchParams.get("view")   // "monthly" | "category" | default raw

  // ── Base filter ──────────────────────────────────────────────────────────
  // Default: last 12 fiscal months (Jun 2025–May 2026).
  // With ?year=YYYY: filter by that calendar year instead.
  let filtered: RevenueEntry[]
  let periodLabel: string
  let priorPeriodData: RevenueEntry[]

  if (yearParam) {
    const targetYear = parseInt(yearParam, 10)
    filtered = revenue.filter((r) => r.year === targetYear)
    periodLabel = `CY${targetYear}`
    priorPeriodData = revenue.filter((r) => r.year === targetYear - 1)
  } else {
    filtered = revenue.filter((r) => FISCAL_MONTHS.includes(r.month))
    periodLabel = "FY Jun 2025–May 2026"
    priorPeriodData = revenue.filter((r) => PRIOR_FISCAL_MONTHS.includes(r.month))
  }

  if (categoryParam) {
    filtered = filtered.filter(
      (r) => r.category === (categoryParam as ProgramCategory)
    )
    priorPeriodData = priorPeriodData.filter(
      (r) => r.category === (categoryParam as ProgramCategory)
    )
  }

  // ── Compute meta stats ───────────────────────────────────────────────────
  const totalRevenue     = filtered.reduce((s, r) => s + r.amount, 0)
  const priorYearRevenue = priorPeriodData.reduce((s, r) => s + r.amount, 0)
  const yoyGrowthPct =
    priorYearRevenue > 0
      ? parseFloat(
          (((totalRevenue - priorYearRevenue) / priorYearRevenue) * 100).toFixed(1)
        )
      : null

  const meta = {
    period: periodLabel,
    totalRevenue,
    priorYearRevenue: priorYearRevenue || null,
    yoyGrowthPct,
    installation: "Camp Pendleton",
  }

  // ── View: monthly aggregate ───────────────────────────────────────────────
  if (view === "monthly") {
    const monthMap = new Map<string, RevenueByMonth>()

    for (const entry of filtered) {
      if (!monthMap.has(entry.month)) {
        monthMap.set(entry.month, {
          month: entry.month,
          year: entry.year,
          total: 0,
          byCategory: {},
        })
      }
      const row = monthMap.get(entry.month)!
      row.total += entry.amount
      row.byCategory[entry.category] =
        (row.byCategory[entry.category] ?? 0) + entry.amount
    }

    const sorted = [...monthMap.values()].sort((a, b) =>
      compareMonths(a.month, b.month)
    )

    const response: ApiResponse<RevenueByMonth[]> = {
      data: sorted,
      meta,
    }
    return NextResponse.json(response)
  }

  // ── View: category aggregate ──────────────────────────────────────────────
  if (view === "category") {
    const catMap = new Map<ProgramCategory, { total: number; transactions: number; months: Set<string> }>()

    for (const entry of filtered) {
      if (!catMap.has(entry.category)) {
        catMap.set(entry.category, { total: 0, transactions: 0, months: new Set() })
      }
      const row = catMap.get(entry.category)!
      row.total += entry.amount
      row.transactions += entry.transactions
      row.months.add(entry.month)
    }

    const result: RevenueByCategory[] = [...catMap.entries()]
      .map(([category, { total, transactions, months }]) => ({
        category,
        total,
        transactions,
        avgMonthly: months.size > 0 ? Math.round(total / months.size) : 0,
      }))
      .sort((a, b) => b.total - a.total)

    const response: ApiResponse<RevenueByCategory[]> = {
      data: result,
      meta,
    }
    return NextResponse.json(response)
  }

  // ── Default: raw filtered entries sorted chronologically ─────────────────
  const sorted = [...filtered].sort((a, b) => compareMonths(a.month, b.month))

  const response: ApiResponse<RevenueEntry[]> = {
    data: sorted,
    meta,
  }
  return NextResponse.json(response)
}
