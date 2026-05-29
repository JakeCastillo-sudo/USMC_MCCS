import { NextRequest, NextResponse } from "next/server"
import rawMetrics from "@/data/metrics.json"
import type { Metric, ApiResponse } from "@/types"

const metrics = rawMetrics as Metric[]

// Derived reinvestment metric computed from YTD revenue (16% of $38.78M annual)
const reinvestmentMetric: Metric = {
  id: "reinvestment",
  label: "QoL Reinvestment YTD",
  value: 6204800,
  unit: "currency",
  trend: 12.4,
  trendDirection: "up",
  trendSentiment: "positive",
  sparkline: [],
}

export async function GET(_request: NextRequest) {
  const allMetrics = [...metrics, reinvestmentMetric]

  const response: ApiResponse<Metric[]> = {
    data: allMetrics,
    meta: {
      total: allMetrics.length,
      installation: "Camp Pendleton",
      asOf: new Date().toISOString(),
    },
  }

  return NextResponse.json(response)
}
