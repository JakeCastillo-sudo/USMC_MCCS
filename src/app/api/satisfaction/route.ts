import { NextRequest, NextResponse } from "next/server"
import rawSatisfaction from "@/data/satisfaction.json"
import type { SatisfactionEntry, ProgramCategory, ApiResponse } from "@/types"

const satisfaction = rawSatisfaction as SatisfactionEntry[]

// ── Precompute global stats ──────────────────────────────────────────────────
function buildMeta(entries: SatisfactionEntry[]) {
  const all = satisfaction // always compute from full dataset

  const totalResponses = all.reduce((s, e) => s + e.responseCount, 0)
  const weightedCsat   = all.reduce((s, e) => s + e.csatScore * e.responseCount, 0)
  const overallCsat    = parseFloat((weightedCsat / totalResponses).toFixed(2))

  // NPS: weighted average (weight by response count)
  const weightedNps = all.reduce((s, e) => s + e.npsScore * e.responseCount, 0)
  const overallNps  = Math.round(weightedNps / totalResponses)

  // Trending programs
  const trendingUp = all
    .filter((e) => e.trend >= 1.5)
    .sort((a, b) => b.trend - a.trend)
    .slice(0, 3)
    .map((e) => e.programName)

  const trendingDown = all
    .filter((e) => e.trend < 0)
    .sort((a, b) => a.trend - b.trend)
    .slice(0, 3)
    .map((e) => e.programName)

  return {
    total: entries.length,
    overallCsat,
    overallNps,
    totalResponses,
    trending_up: trendingUp,
    trending_down: trendingDown,
    installation: "Camp Pendleton",
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const category  = searchParams.get("category")
  const sort      = searchParams.get("sort") ?? "csat_desc"
  const flagParam = searchParams.get("flag")

  let result = [...satisfaction]

  // Filter by category
  if (category) {
    result = result.filter(
      (e) => e.category === (category as ProgramCategory)
    )
  }

  // Flag filter: only entries with CSAT < 4.0
  if (flagParam === "true") {
    result = result.filter((e) => e.csatScore < 4.0)
  }

  // Sort
  switch (sort) {
    case "csat_asc":
      result.sort((a, b) => a.csatScore - b.csatScore)
      break
    case "nps_desc":
      result.sort((a, b) => b.npsScore - a.npsScore)
      break
    case "nps_asc":
      result.sort((a, b) => a.npsScore - b.npsScore)
      break
    case "csat_desc":
    default:
      result.sort((a, b) => b.csatScore - a.csatScore)
      break
  }

  const response: ApiResponse<SatisfactionEntry[]> = {
    data: result,
    meta: buildMeta(result),
  }

  return NextResponse.json(response)
}
