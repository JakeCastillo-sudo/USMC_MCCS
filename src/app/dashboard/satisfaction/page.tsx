import SatisfactionTable from "@/components/dashboard/SatisfactionTable"
import { Star, TrendingDown } from "lucide-react"

export default function SatisfactionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Customer Satisfaction & Feedback
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Camp Pendleton · Based on patron surveys, May 2026
        </p>
      </div>

      {/* Full table (all programs, sortable) */}
      <SatisfactionTable showHeader />

      {/* Spotlight cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top performer */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
              Top Performer
            </span>
          </div>
          <p className="text-xl font-bold text-zinc-900 mb-1">
            ITT / Latitudes Travel Desk
          </p>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-xs text-zinc-500">CSAT</p>
              <p className="font-mono text-2xl font-bold text-emerald-600">4.8</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">NPS</p>
              <p className="font-mono text-2xl font-bold text-emerald-600">+71</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-600 italic">
            "Incredible discounts — savings civilians can&apos;t get"
          </p>
        </div>

        {/* Needs attention */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
              Needs Attention
            </span>
          </div>
          <p className="text-xl font-bold text-zinc-900 mb-1">21 Area Pool</p>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-xs text-zinc-500">CSAT</p>
              <p className="font-mono text-2xl font-bold text-red-600">3.7</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">NPS</p>
              <p className="font-mono text-2xl font-bold text-amber-600">+4</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Trend</p>
              <p className="font-mono text-2xl font-bold text-red-600">−4.2</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-600 italic">
            "Pool hours inconsistent, facility showing age"
          </p>
          <button
            className="mt-3 text-xs font-semibold hover:underline"
            style={{ color: "#C8102E" }}
          >
            Review maintenance schedule →
          </button>
        </div>
      </div>
    </div>
  )
}
