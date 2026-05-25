"use client"

import { useEffect, useState } from "react"
import { Heart, Zap } from "lucide-react"
import type { Metric } from "@/types"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const TARGET = 6_500_000

export default function ReinvestmentTracker() {
  const [metric, setMetric] = useState<Metric | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((d) => {
        const m = (d.data as Metric[]).find((m) => m.id === "reinvestment")
        setMetric(m ?? null)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <Skeleton className="mb-3 h-6 w-56" />
        <Skeleton className="mb-2 h-10 w-40" />
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
    )
  }

  if (error || !metric) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load reinvestment data.
      </div>
    )
  }

  const pct = Math.min((metric.value / TARGET) * 100, 100)

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6">
      {/* Background watermark */}
      <Zap
        className="absolute right-4 top-4 h-20 w-20 text-zinc-50"
        aria-hidden
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              QoL Program Reinvestment
            </span>
          </div>

          {/* Big number */}
          <p className="font-mono text-4xl font-bold" style={{ color: "#C8102E" }}>
            {formatCurrency(metric.value, true)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            reinvested into quality-of-life programs this year
          </p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-zinc-400">
              <span>Progress toward {formatCurrency(TARGET, true)} target</span>
              <span className="font-mono font-semibold text-zinc-700">
                {formatPercent(pct, 0)}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: "#C8102E" }}
              />
            </div>
          </div>
        </div>

        {/* StormBreaker note */}
        <div
          className="shrink-0 rounded-lg p-4 text-white sm:max-w-xs"
          style={{ backgroundColor: "#003087" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3.5 w-3.5 text-yellow-300" />
            <span className="text-xs font-semibold">Operation StormBreaker</span>
          </div>
          <p className="text-xs text-blue-200 leading-relaxed">
            Funded directly from MCCS service revenue per the StormBreaker mission — reinvestment flows back to Marines and families.
          </p>
        </div>
      </div>
    </div>
  )
}
