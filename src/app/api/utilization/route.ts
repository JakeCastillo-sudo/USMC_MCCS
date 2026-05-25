import { NextRequest, NextResponse } from "next/server"
import rawUtilization from "@/data/utilization.json"
import type { UtilizationEntry, ProgramCategory, ApiResponse } from "@/types"

// ── Raw JSON shape (includes "flag" and "waitlistFamilies") ─────────────────
interface RawEntry {
  facilityId: string
  facilityName: string
  category: string
  capacityPct: number
  peakHour: string
  avgDailyVisits: number
  trend: number
  flag: "waitlist" | "underperforming" | "declining" | null
  waitlistFamilies?: number
  note?: string
}

// Map raw flag → typed alert level
function toAlert(
  flag: RawEntry["flag"]
): UtilizationEntry["alert"] {
  if (flag === "waitlist") return "critical"
  if (flag === "underperforming" || flag === "declining") return "warning"
  return "good"
}

// Hydrate raw entries into typed UtilizationEntry[]
const utilization: UtilizationEntry[] = (rawUtilization as RawEntry[]).map(
  ({ flag, waitlistFamilies, note: _note, ...rest }) => ({
    ...rest,
    category: rest.category as ProgramCategory,
    alert: toAlert(flag),
    ...(waitlistFamilies !== undefined ? { waitlistCount: waitlistFamilies } : {}),
  })
)

// ── Summary stats ────────────────────────────────────────────────────────────
function buildMeta(entries: UtilizationEntry[]) {
  const all = utilization // always compute from full dataset
  const avgUtilization = Math.round(
    all.reduce((s, e) => s + e.capacityPct, 0) / all.length
  )
  const criticalCount = all.filter((e) => e.alert === "critical").length
  const warningCount  = all.filter((e) => e.alert === "warning").length
  const sorted        = [...all].sort((a, b) => b.capacityPct - a.capacityPct)
  const topPerformer  = sorted[0]?.facilityName ?? ""
  const underperformer = [...all]
    .sort((a, b) => a.capacityPct - b.capacityPct)[0]?.facilityName ?? ""

  return {
    total: entries.length,
    avgUtilization,
    criticalCount,
    warningCount,
    topPerformer,
    underperformer,
    installation: "Camp Pendleton",
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const category  = searchParams.get("category")
  const alertParam = searchParams.get("alert")
  const sort      = searchParams.get("sort") ?? "capacity_desc"

  let result = [...utilization]

  // Filter by category
  if (category) {
    result = result.filter(
      (e) => e.category === (category as ProgramCategory)
    )
  }

  // Filter by alert level
  if (alertParam) {
    result = result.filter((e) => e.alert === alertParam)
  }

  // Sort
  if (sort === "capacity_asc") {
    result.sort((a, b) => a.capacityPct - b.capacityPct)
  } else {
    // default: capacity_desc
    result.sort((a, b) => b.capacityPct - a.capacityPct)
  }

  const response: ApiResponse<UtilizationEntry[]> = {
    data: result,
    meta: buildMeta(result),
  }

  return NextResponse.json(response)
}
