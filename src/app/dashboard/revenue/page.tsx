"use client"

import { useEffect, useState } from "react"
import KPICard from "@/components/dashboard/KPICard"
import RevenueChart from "@/components/dashboard/RevenueChart"
import ReinvestmentTracker from "@/components/dashboard/ReinvestmentTracker"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Metric, RevenueByCategory, ProgramCategory } from "@/types"
import { formatCurrency, categoryLabel } from "@/lib/utils"
import { cn } from "@/lib/utils"

const KPI_IDS = ["monthly-revenue", "ytd-revenue", "reinvestment"]

// Synthetic top-10 program revenue data derived from fixtures
const TOP_PROGRAMS = [
  { name: "Child Development Centers (All)",   category: "childcare",   monthly: 980000,  mom: 4.1 },
  { name: "Fitness Centers (12 facilities)",   category: "fitness",     monthly: 850000,  mom: 3.8 },
  { name: "Paige Field House",                 category: "fitness",     monthly: 250000,  mom: 5.2 },
  { name: "Pacific Views Event Center",        category: "dining",      monthly: 210000,  mom: 2.1 },
  { name: "Marine Memorial Golf Course",       category: "recreation",  monthly: 175000,  mom: -1.4 },
  { name: "MCX Main Store",                    category: "retail",      monthly: 168000,  mom: 1.6 },
  { name: "Iron Mike's",                       category: "dining",      monthly: 142000,  mom: -0.8 },
  { name: "Del Mar Beach Cottages",            category: "recreation",  monthly: 138000,  mom: 6.3 },
  { name: "School Age Care",                   category: "childcare",   monthly: 120000,  mom: 2.4 },
  { name: "Leatherneck Lanes",                 category: "recreation",  monthly: 98000,   mom: 1.2 },
]

export default function RevenuePage() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((d) => {
        const filtered = KPI_IDS
          .map((id) => (d.data as Metric[]).find((m) => m.id === id))
          .filter((m): m is Metric => Boolean(m))
        setMetrics(filtered)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Revenue Analysis</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Fiscal Year Jun 2025 – May 2026 · Camp Pendleton
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          : metrics.map((m) => <KPICard key={m.id} metric={m} />)
        }
      </div>

      {/* Monthly chart — large */}
      <RevenueChart view="monthly" height={400} />

      {/* Category chart */}
      <RevenueChart view="category" height={300} />

      {/* Top 10 programs */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-base font-semibold text-zinc-900">Top 10 Revenue Programs</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Sorted by monthly revenue</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-xs text-zinc-400">
                <th className="py-2.5 pl-5 text-left font-medium">#</th>
                <th className="py-2.5 text-left font-medium">Program</th>
                <th className="py-2.5 text-left font-medium">Category</th>
                <th className="py-2.5 text-right font-medium">Monthly Rev</th>
                <th className="py-2.5 pr-5 text-right font-medium">MoM Change</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PROGRAMS.map((p, i) => (
                <tr key={p.name} className="border-b border-zinc-50 hover:bg-zinc-50">
                  <td className="py-3 pl-5 font-mono text-xs text-zinc-400">{i + 1}</td>
                  <td className="py-3 font-medium text-zinc-900">{p.name}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                      {categoryLabel(p.category as ProgramCategory)}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-zinc-900">
                    {formatCurrency(p.monthly, true)}
                  </td>
                  <td className="py-3 pr-5 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-xs font-semibold",
                        p.mom >= 0 ? "text-emerald-600" : "text-red-500"
                      )}
                    >
                      {p.mom >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {p.mom >= 0 ? "+" : ""}{p.mom.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReinvestmentTracker />
    </div>
  )
}
