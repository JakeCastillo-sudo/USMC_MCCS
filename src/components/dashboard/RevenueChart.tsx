"use client"

import { useEffect, useState } from "react"
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, categoryLabel, categoryColor, compareMonths } from "@/lib/utils"
import type { RevenueByMonth, RevenueByCategory, ProgramCategory } from "@/types"

// Month abbreviations for X axis labels
const MONTHS_ABBR: Record<string, string> = {
  January:"Jan", February:"Feb", March:"Mar", April:"Apr",
  May:"May", June:"Jun", July:"Jul", August:"Aug",
  September:"Sep", October:"Oct", November:"Nov", December:"Dec",
  Jan:"Jan", Feb:"Feb", Mar:"Mar", Apr:"Apr",
  Jun:"Jun", Jul:"Jul", Aug:"Aug", Sep:"Sep", Oct:"Oct", Nov:"Nov", Dec:"Dec",
}

function shortMonth(m: string) {
  const [mon] = m.split(" ")
  return MONTHS_ABBR[mon] ?? mon
}

// ── Monthly view types ──────────────────────────────────────────────────────
interface MonthRow {
  month: string
  current: number
  prior: number
}

// ── Custom tooltips ─────────────────────────────────────────────────────────
function MonthlyTooltip({ active, payload, label }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string
}) {
  if (!active || !payload?.length) return null
  const current = payload.find((p) => p.name === "Current Year")?.value ?? 0
  const prior   = payload.find((p) => p.name === "Prior Year")?.value  ?? 0
  const diff    = current - prior
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-lg text-xs">
      <p className="font-semibold text-zinc-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value, true)}
        </p>
      ))}
      {prior > 0 && (
        <p className={diff >= 0 ? "text-emerald-600" : "text-red-600"} >
          YoY: {diff >= 0 ? "+" : ""}{formatCurrency(diff, true)} ({((diff / prior) * 100).toFixed(1)}%)
        </p>
      )}
    </div>
  )
}

function CategoryTooltip({ active, payload }: {
  active?: boolean; payload?: { name: string; value: number; payload: { transactions: number } }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0]
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-lg text-xs">
      <p className="font-semibold text-zinc-700 mb-1">{row.name}</p>
      <p>Revenue: {formatCurrency(row.value, true)}</p>
      <p className="text-zinc-500">{row.payload?.transactions?.toLocaleString()} transactions</p>
    </div>
  )
}

interface RevenueChartProps {
  view?: "monthly" | "category"
  height?: number
}

export default function RevenueChart({ view: initialView = "monthly", height = 300 }: RevenueChartProps) {
  const [activeView, setActiveView] = useState<"monthly" | "category">(initialView)
  const [monthlyData, setMonthlyData] = useState<MonthRow[]>([])
  const [categoryData, setCategoryData] = useState<RevenueByCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    const fetchMonthly = fetch("/api/revenue?view=monthly")
      .then((r) => r.json())
      .then((d) => {
        const current = (d.data as RevenueByMonth[]).sort((a, b) => compareMonths(a.month, b.month))
        return fetch("/api/revenue?view=monthly&year=2025")
          .then((r) => r.json())
          .then((p) => {
            const prior = (p.data as RevenueByMonth[])
            const priorMap = new Map(prior.map((row) => [shortMonth(row.month), row.total]))
            return current.map((row) => ({
              month: shortMonth(row.month),
              current: row.total,
              prior: priorMap.get(shortMonth(row.month)) ?? 0,
            }))
          })
      })

    const fetchCategory = fetch("/api/revenue?view=category")
      .then((r) => r.json())
      .then((d) => d.data as RevenueByCategory[])

    Promise.all([fetchMonthly, fetchCategory])
      .then(([monthly, category]) => {
        setMonthlyData(monthly)
        setCategoryData(category)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load revenue data. Please refresh.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      {/* Header + tabs */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Revenue Analysis</h3>
          <p className="text-xs text-zinc-400">FY Jun 2025 – May 2026 vs prior year</p>
        </div>
        <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 gap-0.5">
          {(["monthly", "category"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                activeView === v
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {v === "monthly" ? "Monthly" : "By Category"}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      {activeView === "monthly" ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => formatCurrency(v, true)}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip content={<MonthlyTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="line"
              wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              name="Current Year"
              stroke="#C8102E"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="prior"
              name="Prior Year"
              stroke="#003087"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={categoryData.map((d) => ({
              name: categoryLabel(d.category as ProgramCategory),
              amount: d.total,
              transactions: d.transactions,
            }))}
            margin={{ top: 5, right: 10, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              angle={-25}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(v, true)}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip content={<CategoryTooltip />} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {categoryData.map((d) => (
                <Cell
                  key={d.category}
                  fill={categoryColor(d.category as ProgramCategory)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
