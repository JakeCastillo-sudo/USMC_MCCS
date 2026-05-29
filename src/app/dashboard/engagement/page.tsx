"use client"

import { useEffect, useState } from "react"
import { Users, CalendarCheck, Repeat } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import AlertsFeed from "@/components/dashboard/AlertsFeed"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metric } from "@/types"
import { formatCount } from "@/lib/utils"

// Enrollment distribution by category (derived from programs.json counts)
const ENROLLMENT_DATA = [
  { name: "Fitness",        value: 28, color: "#C8102E" },
  { name: "Childcare",      value: 22, color: "#003087" },
  { name: "Dining",         value: 18, color: "#FFD700" },
  { name: "Recreation",     value: 16, color: "#059669" },
  { name: "Retail",         value: 10, color: "#D97706" },
  { name: "Family Support", value:  6, color: "#71717a" },
]

const MONTH_LABELS = [
  "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov '25",
  "Dec '25", "Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26",
]

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
        <Icon className="h-5 w-5 text-zinc-600" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
        <p className="font-mono text-2xl font-bold text-zinc-900">{value}</p>
        {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function PatronTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-zinc-700 mb-1">{label}</p>
      <p className="font-mono text-zinc-900">{formatCount(payload[0].value)} patrons</p>
    </div>
  )
}

export default function EngagementPage() {
  const [activePatrons, setActivePatrons] = useState<Metric | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((d) => {
        const m = (d.data as Metric[]).find((x) => x.id === "active-patrons")
        if (m) setActivePatrons(m)
      })
      .finally(() => setLoading(false))
  }, [])

  // Build chart data from sparkline
  const patronChartData =
    activePatrons?.sparkline?.map((v, i) => ({
      month: MONTH_LABELS[i] ?? `M${i + 1}`,
      patrons: v,
    })) ?? []

  // Derived stats (consistent with metrics fixture)
  const currentPatrons = activePatrons ? formatCount(activePatrons.value as number) : "—"
  const bookings = "22,400" // matches bookings-month metric
  const newReturning = "34 / 66 %" // new vs returning split

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Patron Engagement</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Camp Pendleton · May 2026 · Active usage across all programs
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Active Patrons"
              value={currentPatrons}
              sub={activePatrons ? `+${activePatrons.trend}% vs last month` : undefined}
              icon={Users}
            />
            <StatCard
              label="Bookings This Month"
              value={bookings}
              sub="Across all bookable programs"
              icon={CalendarCheck}
            />
            <StatCard
              label="New vs Returning"
              value={newReturning}
              sub="New patrons are growing YoY"
              icon={Repeat}
            />
          </>
        )}
      </div>

      {/* Monthly Active Patron Trend */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h3 className="text-base font-semibold text-zinc-900">Monthly Active Patron Trend</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Unique active patrons · Jun 2025 – May 2026</p>
        </div>
        <div className="p-5">
          {loading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={patronChartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={40}
                />
                <Tooltip content={<PatronTooltip />} />
                <Line
                  type="monotone"
                  dataKey="patrons"
                  stroke="#C8102E"
                  strokeWidth={2.5}
                  dot={{ fill: "#C8102E", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#C8102E" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row: Donut + Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enrollment by Category donut */}
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h3 className="text-base font-semibold text-zinc-900">Enrollment by Category</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Share of active patrons per program category</p>
          </div>
          <div className="p-5 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={ENROLLMENT_DATA}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ENROLLMENT_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: "#52525b" }}>{value}</span>
                  )}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Share"]}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e4e4e7",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts — info + success only */}
        <AlertsFeed
          filterLevels={["info", "success"]}
          title="Program Highlights"
          limit={6}
        />
      </div>
    </div>
  )
}
