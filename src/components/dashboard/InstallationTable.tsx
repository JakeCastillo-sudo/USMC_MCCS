"use client"

import { useEffect, useState } from "react"
import { Lock } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Installation } from "@/types"
import { formatCurrency, formatCsat, formatPercent } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function InstallationTable() {
  const [installations, setInstallations] = useState<Installation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/installations")
      .then((r) => r.json())
      .then((d) => setInstallations(d.data as Installation[]))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="p-5">
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load installation data. Please refresh.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-100 px-5 py-4">
        <h3 className="text-base font-semibold text-zinc-900">Enterprise Installation View</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Camp Pendleton pilot active — {installations.length - 1} installations in pipeline
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100 bg-zinc-50">
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Installation</TableHead>
              <TableHead className="text-xs">Location</TableHead>
              <TableHead className="text-xs">Population</TableHead>
              <TableHead className="text-xs">Annual Revenue</TableHead>
              <TableHead className="text-xs">CSAT</TableHead>
              <TableHead className="text-xs">Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installations.map((inst) => {
              const isLive = inst.status === "live"
              return (
                <TableRow
                  key={inst.id}
                  className={cn(
                    "border-zinc-100",
                    isLive ? "bg-red-50 hover:bg-red-50" : "opacity-60 hover:bg-zinc-50"
                  )}
                >
                  {/* Status */}
                  <TableCell>
                    {isLive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        LIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                        Coming Soon
                      </span>
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell className="font-semibold text-sm text-zinc-900">
                    {inst.name}
                  </TableCell>

                  {/* Location */}
                  <TableCell className="text-sm text-zinc-600">{inst.location}</TableCell>

                  {/* Population */}
                  <TableCell className="text-sm text-zinc-700 font-mono">
                    {inst.marinePopulation.toLocaleString()}
                  </TableCell>

                  {/* Revenue */}
                  <TableCell>
                    {isLive && inst.revenue !== null ? (
                      <span className="font-mono text-sm font-semibold text-zinc-900">
                        {formatCurrency(inst.revenue, true)}
                      </span>
                    ) : (
                      <Lock className="h-4 w-4 text-zinc-300" />
                    )}
                  </TableCell>

                  {/* CSAT */}
                  <TableCell>
                    {isLive && inst.csatAvg !== null ? (
                      <span className="font-mono text-sm font-semibold text-emerald-600">
                        {formatCsat(inst.csatAvg)}
                      </span>
                    ) : (
                      <Lock className="h-4 w-4 text-zinc-300" />
                    )}
                  </TableCell>

                  {/* Utilization */}
                  <TableCell>
                    {isLive && inst.utilizationAvg !== null ? (
                      <span className="font-mono text-sm font-semibold text-zinc-900">
                        {formatPercent(inst.utilizationAvg, 0)}
                      </span>
                    ) : (
                      <Lock className="h-4 w-4 text-zinc-300" />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* CTA */}
      <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Ready to expand to your installation?
            </p>
            <p className="text-xs text-zinc-500">
              Kaizen + StormBreaker deploys into your existing ATO — no new authority required.
            </p>
          </div>
          <button
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#C8102E" }}
          >
            Contact Kaizen Labs →
          </button>
        </div>
      </div>
    </div>
  )
}
