"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Trophy, TrendingUp, TrendingDown } from "lucide-react"
import type { UtilizationEntry } from "@/types"
import { categoryLabel } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface UtilizationGridProps {
  limit?: number
}

function utilizationColor(pct: number) {
  if (pct >= 96) return "bg-red-500"
  if (pct >= 81) return "bg-emerald-500"
  if (pct >= 61) return "bg-amber-400"
  return "bg-zinc-300"
}

function utilizationTextColor(pct: number) {
  if (pct >= 96) return "text-red-600"
  if (pct >= 81) return "text-emerald-600"
  if (pct >= 61) return "text-amber-600"
  return "text-zinc-500"
}

function FacilityCard({ entry }: { entry: UtilizationEntry }) {
  const barColor = utilizationColor(entry.capacityPct)
  const textColor = utilizationTextColor(entry.capacityPct)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">{entry.facilityName}</p>
          <span className="mt-0.5 inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
            {categoryLabel(entry.category)}
          </span>
        </div>
        <span className={cn("font-mono text-2xl font-bold shrink-0", textColor)}>
          {entry.capacityPct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${Math.min(entry.capacityPct, 100)}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Peak: {entry.peakHour}</span>
        <span>{entry.avgDailyVisits.toLocaleString()} visits/day</span>
        <span
          className={cn(
            "flex items-center gap-0.5 font-medium",
            entry.trend >= 0 ? "text-emerald-600" : "text-red-500"
          )}
        >
          {entry.trend >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {Math.abs(entry.trend).toFixed(1)}%
        </span>
      </div>

      {/* Waitlist badge */}
      {entry.waitlistCount !== undefined && entry.waitlistCount > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {entry.waitlistCount} families on waitlist
        </div>
      )}
    </div>
  )
}

export default function UtilizationGrid({ limit }: UtilizationGridProps) {
  const [entries, setEntries] = useState<UtilizationEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/utilization?sort=capacity_desc")
      .then((r) => r.json())
      .then((d) => setEntries(d.data as UtilizationEntry[]))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load utilization data. Please refresh.
      </div>
    )
  }

  const displayed = limit ? entries.slice(0, limit) : entries
  const topPerformer = entries[0]
  const underperformer = [...entries].sort((a, b) => a.capacityPct - b.capacityPct)[0]

  return (
    <div className="space-y-4">
      {/* Highlight cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {topPerformer && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <Trophy className="h-8 w-8 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Top Performer
              </p>
              <p className="truncate text-sm font-bold text-zinc-900">{topPerformer.facilityName}</p>
              <p className="text-xs text-zinc-500">{topPerformer.capacityPct}% utilization</p>
            </div>
          </div>
        )}
        {underperformer && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Needs Attention
              </p>
              <p className="truncate text-sm font-bold text-zinc-900">{underperformer.facilityName}</p>
              <p className="text-xs text-zinc-500">{underperformer.capacityPct}% utilization</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div className="py-12 text-center text-zinc-400">No results found for this filter.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((entry) => (
            <FacilityCard key={entry.facilityId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
