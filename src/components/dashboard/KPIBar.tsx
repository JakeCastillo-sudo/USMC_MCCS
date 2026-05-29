"use client"

import { useEffect, useState } from "react"
import type { Metric } from "@/types"
import KPICard from "./KPICard"
import { Skeleton } from "@/components/ui/skeleton"

// IDs to show (in order) — reinvestment metric is excluded from the bar
const DISPLAY_IDS = [
  "monthly-revenue",
  "ytd-revenue",
  "avg-csat",
  "facility-utilization",
  "active-patrons",
  "bookings-this-month",
]

export default function KPIBar() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((d) => {
        const ordered = DISPLAY_IDS
          .map((id) => (d.data as Metric[]).find((m) => m.id === id))
          .filter((m): m is Metric => Boolean(m))
        setMetrics(ordered)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-zinc-200 bg-white p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load metrics. Please refresh.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m) => (
        <KPICard key={m.id} metric={m} />
      ))}
    </div>
  )
}
