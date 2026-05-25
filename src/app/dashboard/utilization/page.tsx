"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Activity, Building2 } from "lucide-react"
import UtilizationGrid from "@/components/dashboard/UtilizationGrid"
import ChildcareRebalancer from "@/components/dashboard/ChildcareRebalancer"
import { Skeleton } from "@/components/ui/skeleton"

interface UtilMeta {
  avgUtilization: number
  criticalCount: number
  total: number
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-zinc-900",
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color?: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
        <Icon className="h-5 w-5 text-zinc-600" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
        <p className={`font-mono text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  )
}

export default function UtilizationPage() {
  const [meta, setMeta] = useState<UtilMeta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/utilization")
      .then((r) => r.json())
      .then((d) => setMeta(d.meta as UtilMeta))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Facility Utilization</h1>
        <p className="mt-0.5 text-sm text-zinc-500">Camp Pendleton · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : meta ? (
          <>
            <StatCard label="Avg Utilization" value={`${meta.avgUtilization}%`} icon={Activity} />
            <StatCard
              label="Critical Alerts"
              value={meta.criticalCount}
              icon={AlertTriangle}
              color={meta.criticalCount > 0 ? "text-red-600" : "text-zinc-900"}
            />
            <StatCard label="Total Facilities" value={meta.total} icon={Building2} />
          </>
        ) : null}
      </div>

      {/* Critical alert banner */}
      {meta && meta.criticalCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm font-semibold text-red-700">
            {meta.criticalCount} {meta.criticalCount === 1 ? "facility" : "facilities"} at critical capacity — immediate action required
          </p>
        </div>
      )}

      {/* Full grid */}
      <UtilizationGrid />

      {/* Childcare Rebalancer */}
      <ChildcareRebalancer />
    </div>
  )
}
