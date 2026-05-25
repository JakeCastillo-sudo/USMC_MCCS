import { NextRequest, NextResponse } from "next/server"
import forecastData from "@/data/forecast.json"
import type { ForecastEntry, HeatmapEntry } from "@/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const facilityId = searchParams.get("facilityId")
  const category = searchParams.get("category")
  const view = searchParams.get("view")

  if (view === "heatmap") {
    let heatmap = forecastData.heatmap as HeatmapEntry[]
    if (facilityId) {
      heatmap = heatmap.filter((h) => h.facilityId === facilityId)
    }
    return NextResponse.json({
      data: heatmap,
      meta: { total: heatmap.length, view: "heatmap" },
    })
  }

  let forecasts = forecastData.forecasts as ForecastEntry[]

  if (facilityId) {
    forecasts = forecasts.filter((f) => f.facilityId === facilityId)
  }
  if (category) {
    forecasts = forecasts.filter((f) => f.category === category)
  }

  // Sort by confidence desc by default
  forecasts = [...forecasts].sort((a, b) => b.confidenceScore - a.confidenceScore)

  return NextResponse.json({
    data: forecasts,
    meta: {
      total: forecasts.length,
      facilities: [...new Set(forecasts.map((f) => f.facilityId))],
    },
  })
}
