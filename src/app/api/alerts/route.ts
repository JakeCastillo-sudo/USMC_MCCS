import { NextRequest, NextResponse } from "next/server"
import rawUtilization from "@/data/utilization.json"
import rawSatisfaction from "@/data/satisfaction.json"
import type { Alert, ProgramCategory, ApiResponse } from "@/types"

// ── Raw JSON shapes ──────────────────────────────────────────────────────────
interface RawUtil {
  facilityId: string
  facilityName: string
  category: string
  capacityPct: number
  trend: number
  flag: "waitlist" | "underperforming" | "declining" | null
  waitlistFamilies?: number
}

interface RawSat {
  programId: string
  programName: string
  category: string
  csatScore: number
  npsScore: number
  trend: number
}

const utilization = rawUtilization as RawUtil[]
const satisfaction = rawSatisfaction as RawSat[]

// ── Alert generators ─────────────────────────────────────────────────────────

function generateAlerts(): Alert[] {
  const alerts: Alert[] = []

  // ── 1-2. Childcare waitlist CRITICAL alerts ──────────────────────────────
  const waitlistFacilities = utilization.filter((u) => u.flag === "waitlist")
  for (const fac of waitlistFacilities) {
    const count = fac.waitlistFamilies ?? 0
    alerts.push({
      id: `waitlist-${fac.facilityId}`,
      level: "critical",
      title: `${fac.facilityName} — Childcare Waitlist`,
      message: `${count} ${count === 1 ? "family" : "families"} on waitlist — immediate action required. Facility at ${fac.capacityPct}% capacity.`,
      category: "childcare" as ProgramCategory,
      metric: "waitlistCount",
      value: count,
      action: "Review capacity expansion options",
    })
  }

  // ── 3. CSAT decline warnings ──────────────────────────────────────────────
  const decliningCsat = satisfaction
    .filter((s) => s.csatScore < 4.0 && s.trend < 0)
    .sort((a, b) => a.csatScore - b.csatScore)

  for (const prog of decliningCsat) {
    // Check if there's a matching utilization entry with context
    const util = utilization.find((u) => u.facilityId === `fac-${prog.programId}`)
    const utilNote = util ? ` Utilization at ${util.capacityPct}%.` : ""
    alerts.push({
      id: `csat-${prog.programId}`,
      level: "warning",
      title: `${prog.programName} — CSAT Declining`,
      message: `CSAT dropped to ${prog.csatScore.toFixed(1)} (trend ${prog.trend.toFixed(1)}).${utilNote} Review maintenance and service quality.`,
      category: prog.category as ProgramCategory,
      metric: "csatScore",
      value: prog.csatScore,
      action: "Schedule operational review",
    })
  }

  // ── 4-5. Under-utilization warnings ──────────────────────────────────────
  const underperforming = utilization.filter(
    (u) => u.flag === "underperforming"
  )
  for (const fac of underperforming) {
    alerts.push({
      id: `util-${fac.facilityId}`,
      level: "warning",
      title: `${fac.facilityName} — Low Utilization`,
      message: `Utilization at ${fac.capacityPct}% (trend ${fac.trend.toFixed(1)}%). Assess staffing levels and program offerings to drive engagement.`,
      category: fac.category as ProgramCategory,
      metric: "capacityPct",
      value: fac.capacityPct,
      action: "Assess programming and marketing strategy",
    })
  }

  // ── 6. Revenue / CSAT success highlights ─────────────────────────────────
  const topPerformers = satisfaction
    .filter((s) => s.csatScore >= 4.7 || s.trend >= 3.5)
    .sort((a, b) => b.csatScore - a.csatScore)
    .slice(0, 2)

  for (const prog of topPerformers) {
    alerts.push({
      id: `success-${prog.programId}`,
      level: "success",
      title: `${prog.programName} — Top Performer`,
      message:
        prog.csatScore >= 4.7
          ? `CSAT ${prog.csatScore.toFixed(1)} — highest rated program on installation. Patron satisfaction driving repeat bookings.`
          : `Trend up ${prog.trend.toFixed(1)} pts. New schedule is driving strong engagement and revenue growth.`,
      category: prog.category as ProgramCategory,
      metric: "csatScore",
      value: prog.csatScore,
    })
  }

  // ── 7. Group Exercise revenue success ─────────────────────────────────────
  const groupEx = satisfaction.find((s) => s.programId === "group-exercise")
  if (groupEx && groupEx.trend > 0) {
    const existing = alerts.find((a) => a.id === `success-${groupEx.programId}`)
    if (!existing) {
      alerts.push({
        id: "success-group-exercise-revenue",
        level: "success",
        title: "Group Exercise — Revenue Up",
        message: `Revenue up 18% MoM — new class schedule is driving strong patronage growth. CSAT at ${groupEx.csatScore.toFixed(1)}.`,
        category: "fitness" as ProgramCategory,
        metric: "trend",
        value: "18% MoM",
      })
    }
  }

  // ── 8. Seasonal info — beach cottage demand ───────────────────────────────
  const beachCottages = utilization.find(
    (u) => u.facilityId === "fac-del-mar-beach"
  )
  if (beachCottages) {
    alerts.push({
      id: "info-beach-seasonality",
      level: "info",
      title: "Del Mar Beach — Peak Season Approaching",
      message: `Beach cottage bookings trending +24% — summer utilization reached ${beachCottages.capacityPct}% last season. Ensure maintenance is completed before Memorial Day.`,
      category: "recreation" as ProgramCategory,
      metric: "capacityPct",
      value: beachCottages.capacityPct,
      action: "Confirm pre-season maintenance schedule",
    })
  }

  // Sort: critical first, then warning, success, info
  const levelOrder: Record<Alert["level"], number> = {
    critical: 0,
    warning: 1,
    success: 2,
    info: 3,
  }
  alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level])

  return alerts
}

export async function GET(_request: NextRequest) {
  const alerts = generateAlerts()

  const response: ApiResponse<Alert[]> = {
    data: alerts,
    meta: {
      total: alerts.length,
      critical: alerts.filter((a) => a.level === "critical").length,
      warning:  alerts.filter((a) => a.level === "warning").length,
      success:  alerts.filter((a) => a.level === "success").length,
      info:     alerts.filter((a) => a.level === "info").length,
      installation: "Camp Pendleton",
      asOf: new Date().toISOString(),
    },
  }

  return NextResponse.json(response)
}
