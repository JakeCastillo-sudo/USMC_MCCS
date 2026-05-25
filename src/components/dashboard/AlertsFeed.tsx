"use client"

import { useEffect, useState } from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import type { Alert, AlertLevel } from "@/types"
import { alertColor, categoryLabel } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ProgramCategory } from "@/types"

interface AlertsFeedProps {
  filterLevels?: AlertLevel[]
  limit?: number
  title?: string
}

const ICONS: Record<AlertLevel, React.ElementType> = {
  critical: AlertCircle,
  warning:  AlertTriangle,
  success:  CheckCircle2,
  info:     Info,
}

const BORDER_COLOR: Record<AlertLevel, string> = {
  critical: "border-l-red-500",
  warning:  "border-l-amber-500",
  success:  "border-l-emerald-500",
  info:     "border-l-blue-500",
}

const ICON_COLOR: Record<AlertLevel, string> = {
  critical: "text-red-500",
  warning:  "text-amber-500",
  success:  "text-emerald-500",
  info:     "text-blue-500",
}

export default function AlertsFeed({
  filterLevels,
  limit,
  title = "Alerts & Notifications",
}: AlertsFeedProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((d) => setAlerts(d.data as Alert[]))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <Skeleton className="mb-4 h-5 w-36" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load alerts. Please refresh.
      </div>
    )
  }

  let displayed = filterLevels
    ? alerts.filter((a) => filterLevels.includes(a.level))
    : alerts

  if (limit) displayed = displayed.slice(0, limit)

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
          {displayed.length} alerts
        </span>
      </div>

      {displayed.length === 0 ? (
        <div className="py-8 text-center text-zinc-400 text-sm">No alerts at this time.</div>
      ) : (
        <div className="space-y-3">
          {displayed.map((alert, index) => {
            const Icon = ICONS[alert.level]
            const borderCls = BORDER_COLOR[alert.level]
            const iconCls = ICON_COLOR[alert.level]
            const colorCls = alertColor(alert.level)

            return (
              <div
                key={alert.id}
                className={cn(
                  "rounded-lg border border-l-4 p-3 animate-fadeIn",
                  borderCls,
                  colorCls
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconCls)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <p className="text-xs font-semibold">{alert.title}</p>
                      <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-xs">
                        {categoryLabel(alert.category as ProgramCategory)}
                      </span>
                      <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-xs font-mono">
                        {typeof alert.value === "number"
                          ? alert.value.toLocaleString()
                          : alert.value}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-80">{alert.message}</p>
                    {alert.action && (
                      <button
                        className="mt-1.5 text-xs font-semibold"
                        style={{ color: "#C8102E" }}
                      >
                        {alert.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
