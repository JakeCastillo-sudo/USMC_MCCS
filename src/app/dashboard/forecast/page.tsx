"use client"

import { useEffect, useState, useMemo } from "react"
import {
  ComposedChart, Line, Area, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, AreaChart
} from "recharts"
import { Sparkles, TrendingUp, TrendingDown, Minus, AlertCircle, Users, DollarSign, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { ForecastEntry, ForecastDataPoint, HeatmapEntry } from "@/types"

type ViewMode = "chart" | "heatmap" | "staffing"

const FACILITIES = [
  { id: "paige-field-house",    name: "Paige Field House" },
  { id: "cdc-1-mainside",       name: "CDC-1 Mainside" },
  { id: "marine-memorial-golf", name: "Marine Memorial Golf" },
  { id: "del-mar-cottages",     name: "Del Mar Cottages" },
  { id: "pool-21-area",         name: "21 Area Pool" },
  { id: "leatherneck-lanes",    name: "Leatherneck Lanes" },
  { id: "iron-mikes",           name: "Iron Mike's" },
  { id: "fc-mcas",              name: "MCAS Fitness Center" },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const HOURS = Array.from({ length: 17 }, (_, i) => i + 5) // 5am–9pm

function heatColor(val: number): string {
  if (val === 0) return "#f4f4f5"
  if (val < 40)  return "#d1fae5"   // emerald-100
  if (val < 60)  return "#fef3c7"   // amber-100
  if (val < 80)  return "#fed7aa"   // orange-200
  return "#fca5a5"                   // red-300
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "increasing") return <TrendingUp className="h-4 w-4 text-emerald-500" />
  if (trend === "decreasing") return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-zinc-400" />
}

function InsightCard({ icon: Icon, color, title, value, sub, badge }: {
  icon: React.ElementType; color: string; title: string; value: string; sub: string; badge?: { label: string; color: string }
}) {
  return (
    <div className={cn("rounded-xl border p-4", color)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-zinc-500" />
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</span>
        {badge && (
          <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold", badge.color)}>
            {badge.label}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-zinc-900 mb-0.5">{value}</p>
      <p className="text-xs text-zinc-500">{sub}</p>
    </div>
  )
}

// Custom tooltip for the main chart
function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: {value: number; name: string; color: string}[]; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-lg p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-zinc-700 mb-1.5">
        {label ? new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-bold">{p.value != null ? `${Math.round(p.value)}%` : "—"}</span>
        </div>
      ))}
    </div>
  )
}

// Staffing table data
const STAFFING_ROWS = [
  { day: "Monday",    morning: { n: 4, rec: "add 1" }, afternoon: { n: 3, rec: "ok" }, evening: { n: 2, rec: "ok" }, note: "Peak 6–7am" },
  { day: "Tuesday",   morning: { n: 3, rec: "ok"    }, afternoon: { n: 3, rec: "ok" }, evening: { n: 2, rec: "ok" }, note: "Normal" },
  { day: "Wednesday", morning: { n: 4, rec: "add 1" }, afternoon: { n: 3, rec: "ok" }, evening: { n: 2, rec: "ok" }, note: "Peak 6–7am" },
  { day: "Thursday",  morning: { n: 3, rec: "ok"    }, afternoon: { n: 3, rec: "ok" }, evening: { n: 1, rec: "monitor" }, note: "Monitor PM" },
  { day: "Friday",    morning: { n: 3, rec: "ok"    }, afternoon: { n: 4, rec: "add 1" }, evening: { n: 2, rec: "ok" }, note: "Lunch peak" },
  { day: "Saturday",  morning: { n: 5, rec: "add 2" }, afternoon: { n: 4, rec: "add 1" }, evening: { n: 2, rec: "ok" }, note: "Heavy AM" },
  { day: "Sunday",    morning: { n: 3, rec: "ok"    }, afternoon: { n: 3, rec: "ok" }, evening: { n: 1, rec: "ok" }, note: "Light" },
]

function recColor(rec: string) {
  if (rec.startsWith("add")) return "bg-red-100 text-red-700"
  if (rec === "monitor") return "bg-amber-100 text-amber-700"
  return "bg-emerald-100 text-emerald-700"
}

// Seasonal trend data (12 months)
const SEASONAL_DATA = [
  { month: "Jun 25", actual: 68, predicted: null, season: "summer" },
  { month: "Jul 25", actual: 78, predicted: null, season: "summer" },
  { month: "Aug 25", actual: 82, predicted: null, season: "summer" },
  { month: "Sep 25", actual: 72, predicted: null, season: "fall" },
  { month: "Oct 25", actual: 65, predicted: null, season: "fall" },
  { month: "Nov 25", actual: 60, predicted: null, season: "fall" },
  { month: "Dec 25", actual: 58, predicted: null, season: "winter" },
  { month: "Jan 26", actual: 61, predicted: null, season: "winter" },
  { month: "Feb 26", actual: 63, predicted: null, season: "winter" },
  { month: "Mar 26", actual: 70, predicted: null, season: "spring" },
  { month: "Apr 26", actual: 75, predicted: null, season: "spring" },
  { month: "May 26", actual: 82, predicted: 84,   season: "spring" },
  { month: "Jun 26", actual: null, predicted: 91, season: "summer" },
  { month: "Jul 26", actual: null, predicted: 97, season: "summer" },
  { month: "Aug 26", actual: null, predicted: 95, season: "summer" },
]

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<ForecastEntry[]>([])
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFacility, setSelectedFacility] = useState("paige-field-house")
  const [viewMode, setViewMode] = useState<ViewMode>("chart")

  useEffect(() => {
    Promise.all([
      fetch("/api/forecast").then((r) => r.json()),
      fetch("/api/forecast?view=heatmap").then((r) => r.json()),
    ])
      .then(([fData, hData]) => {
        setForecasts(fData.data as ForecastEntry[])
        setHeatmap(hData.data as HeatmapEntry[])
      })
      .finally(() => setLoading(false))
  }, [])

  const activeForecast = useMemo(
    () => forecasts.find((f) => f.facilityId === selectedFacility),
    [forecasts, selectedFacility]
  )

  const facilityHeatmap = useMemo(
    () => heatmap.filter((h) => h.facilityId === selectedFacility),
    [heatmap, selectedFacility]
  )

  // Build heatmap grid: [day][hour] = avgVisits
  const heatmapGrid = useMemo(() => {
    const grid: Record<string, Record<number, number>> = {}
    DAYS.forEach((d) => { grid[d] = {} })
    facilityHeatmap.forEach((h) => {
      if (!grid[h.dayOfWeek]) grid[h.dayOfWeek] = {}
      grid[h.dayOfWeek][h.hour] = h.avgVisits
    })
    return grid
  }, [facilityHeatmap])

  // Chart data with event markers separated out
  const chartData = useMemo(() => {
    if (!activeForecast?.dataPoints) return []
    return activeForecast.dataPoints.map((pt: ForecastDataPoint) => ({
      date: pt.date,
      predicted: pt.predicted,
      lower: pt.lower,
      upper: pt.upper,
      actual: pt.actual ?? undefined,
      event: pt.event ?? undefined,
    }))
  }, [activeForecast])

  const peakPoint = useMemo(() => {
    if (!activeForecast?.dataPoints) return null
    return [...activeForecast.dataPoints].sort((a: ForecastDataPoint, b: ForecastDataPoint) => b.predicted - a.predicted)[0] as ForecastDataPoint
  }, [activeForecast])

  const daysUntilPeak = useMemo(() => {
    if (!peakPoint) return null
    const diff = new Date(peakPoint.date).getTime() - new Date("2026-05-25").getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }, [peakPoint])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Demand Forecasting</h1>
          <p className="mt-0.5 text-sm text-zinc-500">AI-powered utilization predictions · Camp Pendleton</p>
        </div>
        {/* AI model badge */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-xs font-bold text-blue-800">Kaizen Predict</p>
            <p className="text-[10px] text-blue-500">24-month training data · Updated May 25, 2026</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Facility selector */}
        <select
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        >
          {FACILITIES.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex rounded-xl border border-zinc-200 overflow-hidden bg-white">
          {([
            { id: "chart",    label: "Line Chart",  icon: TrendingUp },
            { id: "heatmap",  label: "Heatmap",     icon: BarChart3 },
            { id: "staffing", label: "Staffing",     icon: Users },
          ] as { id: ViewMode; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-r border-zinc-200 last:border-0",
                viewMode === id
                  ? "text-white"
                  : "text-zinc-600 hover:bg-zinc-50"
              )}
              style={viewMode === id ? { backgroundColor: "#003087" } : {}}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-72 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        </div>
      ) : !activeForecast ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
          <p className="text-sm text-zinc-500">Forecast data not yet available for this facility.</p>
          <p className="text-xs text-zinc-400 mt-1">Check back after 30 days of operational data.</p>
        </div>
      ) : (
        <>
          {/* ── LINE CHART VIEW ─────────────────────────────────────────── */}
          {viewMode === "chart" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{activeForecast.facilityName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <TrendIcon trend={activeForecast.trend} />
                    <span className="text-xs text-zinc-500 capitalize">{activeForecast.trend} trend</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                      {activeForecast.confidenceScore}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 110]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconSize={10}
                    wrapperStyle={{ fontSize: 11 }}
                    formatter={(value) => value === "band" ? "Confidence Interval" : value}
                  />

                  {/* Critical threshold */}
                  <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 4"
                    label={{ value: "Critical Threshold", fontSize: 10, fill: "#ef4444", position: "insideTopRight" }}
                  />
                  {/* High demand */}
                  <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4"
                    label={{ value: "High Demand", fontSize: 10, fill: "#f59e0b", position: "insideTopRight" }}
                  />

                  {/* Confidence band */}
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="none"
                    fill="#C8102E"
                    fillOpacity={0.08}
                    legendType="none"
                    name="Upper Bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="none"
                    fill="#ffffff"
                    fillOpacity={1}
                    legendType="none"
                    name="Lower Bound"
                  />

                  {/* Historical actual */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#003087"
                    strokeWidth={2}
                    dot={false}
                    name="Actual"
                    connectNulls={false}
                  />

                  {/* Predicted */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#C8102E"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 3"
                    name="Predicted"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Event markers legend */}
              {chartData.some((d) => d.event) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {chartData.filter((d) => d.event).map((d) => (
                    <span key={d.date} className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: {d.event}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── HEATMAP VIEW ────────────────────────────────────────────── */}
          {viewMode === "heatmap" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 overflow-x-auto">
              <h3 className="text-sm font-bold text-zinc-900 mb-4">
                {activeForecast.facilityName} — Hourly Utilization Heatmap
              </h3>

              {facilityHeatmap.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-zinc-400">Heatmap data not available for this facility.</p>
                </div>
              ) : (
                <div className="min-w-[500px]">
                  {/* Hour axis */}
                  <div className="flex gap-0.5 mb-1 ml-16">
                    {HOURS.map((h) => (
                      <div key={h} className="flex-1 text-center text-[9px] text-zinc-400 min-w-[28px]">
                        {h === 12 ? "12p" : h > 12 ? `${h-12}p` : `${h}a`}
                      </div>
                    ))}
                  </div>
                  {/* Grid */}
                  {DAYS.map((day) => (
                    <div key={day} className="flex items-center gap-0.5 mb-0.5">
                      <span className="w-14 shrink-0 text-xs text-zinc-500 text-right pr-2">{day}</span>
                      {HOURS.map((h) => {
                        const val = heatmapGrid[day]?.[h] ?? 0
                        return (
                          <div
                            key={h}
                            title={`${day} ${h > 12 ? `${h-12}pm` : `${h}am`}: ${val}% avg utilization`}
                            className="flex-1 h-7 rounded-sm transition-colors min-w-[28px]"
                            style={{ backgroundColor: heatColor(val) }}
                          />
                        )
                      })}
                    </div>
                  ))}
                  {/* Legend */}
                  <div className="flex items-center gap-3 mt-3 ml-16">
                    {[
                      { color: "#d1fae5", label: "< 40%" },
                      { color: "#fef3c7", label: "40–60%" },
                      { color: "#fed7aa", label: "60–80%" },
                      { color: "#fca5a5", label: "> 80%" },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <div className="h-3 w-5 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-zinc-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STAFFING VIEW ───────────────────────────────────────────── */}
          {viewMode === "staffing" && (
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900">
                  Recommended Staffing — {activeForecast.facilityName}
                </h3>
                <button
                  className="text-xs font-semibold hover:underline"
                  style={{ color: "#003087" }}
                >
                  Export Plan →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <th className="text-left px-4 py-2.5 font-semibold text-zinc-500">Day</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-zinc-500">Morning 6am–2pm</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-zinc-500">Afternoon 2pm–8pm</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-zinc-500">Evening 8pm–Close</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-zinc-500">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STAFFING_ROWS.map((row, i) => (
                      <tr key={row.day} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                        <td className="px-4 py-3 font-semibold text-zinc-800">{row.day}</td>
                        {[row.morning, row.afternoon, row.evening].map((shift, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-zinc-900">{shift.n} staff</span>
                              {shift.rec !== "ok" && (
                                <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold", recColor(shift.rec))}>
                                  {shift.rec}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-zinc-400 italic">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── INSIGHT CARDS ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InsightCard
              icon={AlertCircle}
              color="border-red-200 border bg-red-50"
              title="Peak Demand"
              value={peakPoint ? `${peakPoint.predicted}% on ${new Date(peakPoint.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "—"}
              sub={daysUntilPeak != null && daysUntilPeak > 0 ? `${daysUntilPeak} days from today` : "Past"}
              badge={peakPoint && peakPoint.predicted >= 95 ? { label: "Action Required", color: "bg-red-100 text-red-700" } : { label: "Monitoring", color: "bg-zinc-100 text-zinc-600" }}
            />
            <InsightCard
              icon={Users}
              color="border-blue-200 border bg-blue-50"
              title="Staffing Recommendation"
              value={`${activeForecast.staffingNeeded} staff needed`}
              sub={activeForecast.trend === "increasing" ? "Increase from current level" : "Current staffing may be sufficient"}
            />
            <InsightCard
              icon={DollarSign}
              color="border-emerald-200 border bg-emerald-50"
              title="Revenue Projection"
              value={activeForecast.revenueProjection > 0
                ? `$${(activeForecast.revenueProjection / 1000).toFixed(0)}K`
                : "No-charge facility"}
              sub={`${activeForecast.month} forecast · ${activeForecast.confidenceScore}% model confidence`}
            />
          </div>

          {/* ── ALL FACILITIES RANKED ───────────────────────────────────── */}
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">All Facilities — 30-Day Forecast Ranking</h3>
            </div>
            <div className="divide-y divide-zinc-50">
              {[...forecasts]
                .sort((a, b) => b.forecastedVisits - a.forecastedVisits)
                .map((f) => {
                  const peak = Math.max(...f.dataPoints.map((d: ForecastDataPoint) => d.predicted))
                  const needsAttention = f.trend === "decreasing" || peak >= 95
                  return (
                    <div key={f.facilityId} className="flex items-center gap-4 px-5 py-3">
                      <button
                        onClick={() => setSelectedFacility(f.facilityId)}
                        className="text-sm font-medium text-left hover:underline flex-1 min-w-0"
                        style={{ color: "#003087" }}
                      >
                        {f.facilityName}
                      </button>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <TrendIcon trend={f.trend} />
                        <span className="text-xs text-zinc-500 capitalize">{f.trend}</span>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span>Peak</span>
                          <span className={peak >= 95 ? "font-bold text-red-600" : ""}>{peak}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", peak >= 95 ? "bg-red-500" : peak >= 80 ? "bg-amber-400" : "bg-emerald-400")}
                            style={{ width: `${Math.min(peak, 100)}%` }}
                          />
                        </div>
                      </div>
                      {needsAttention && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 shrink-0">
                          Attention
                        </span>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>

          {/* ── SEASONAL TREND ──────────────────────────────────────────── */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Seasonal Trend — 15-Month View</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SEASONAL_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#a1a1aa" }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 9, fill: "#a1a1aa" }} domain={[40, 110]} />
                <Tooltip formatter={(v) => typeof v === "number" ? `${v}%` : v} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#003087"
                  fill="#003087"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Actual"
                  connectNulls={false}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#C8102E"
                  fill="#C8102E"
                  fillOpacity={0.08}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  name="Predicted"
                  connectNulls={false}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            {/* Season annotations */}
            <div className="flex gap-3 mt-3 flex-wrap">
              {[
                { label: "Spring",  color: "bg-emerald-100" },
                { label: "Summer",  color: "bg-amber-100" },
                { label: "Fall",    color: "bg-blue-100" },
                { label: "Winter",  color: "bg-zinc-200" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={cn("h-3 w-5 rounded", color)} />
                  <span className="text-[10px] text-zinc-500">{label}</span>
                </div>
              ))}
              <span className="text-[10px] text-zinc-400 ml-2">Peak events: Memorial Day · Summer Break · Back to School · Holiday Season</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
