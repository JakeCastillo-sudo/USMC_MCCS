"use client"

import { useEffect, useState } from "react"
import { Dumbbell, MapPin, Clock, Zap } from "lucide-react"
import ProgramCard from "@/components/resident/ProgramCard"
import BookingModal from "@/components/resident/BookingModal"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Program } from "@/types"

const SUB_NAV = ["All", "Fitness Centers", "Group Classes", "Programs", "Races"]

// Utilization badges derived from utilization fixture
const UTIL_MAP: Record<string, { pct: number; color: string }> = {
  "paige-field-house":      { pct: 88, color: "text-amber-600" },
  "fitness-center-21-area": { pct: 81, color: "text-emerald-600" },
  "fitness-center-41-area": { pct: 73, color: "text-emerald-600" },
  "fitness-center-53-area": { pct: 62, color: "text-zinc-500" },
  "fitness-center-mcas":    { pct: 58, color: "text-zinc-500" },
}

// Fake filter state for toggles
const FILTERS = ["Free Only", "24/7 Access", "Available Now"]

export default function FitnessPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("All")
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)

  useEffect(() => {
    fetch("/api/programs?category=fitness")
      .then((r) => r.json())
      .then((d) => setPrograms(d.data as Program[]))
      .finally(() => setLoading(false))
  }, [])

  function toggleFilter(f: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  // Filter programs by tab
  const filtered = programs.filter((p) => {
    if (activeTab === "All") return true
    if (activeTab === "Fitness Centers") return p.tags?.includes("fitness-center")
    if (activeTab === "Group Classes") return p.tags?.includes("group-class")
    if (activeTab === "Programs") return !p.tags?.includes("fitness-center") && !p.tags?.includes("group-class") && !p.tags?.includes("race")
    if (activeTab === "Races") return p.tags?.includes("race")
    return true
  })

  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{ background: "linear-gradient(135deg, #C8102E 0%, #8b0a1f 100%)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell className="h-5 w-5 text-red-200" />
          <h1 className="text-xl font-bold text-white">Fitness & Recreation</h1>
        </div>
        <p className="text-sm text-red-200">15 centers and programs · Camp Pendleton</p>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-zinc-100">
        {SUB_NAV.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              activeTab === tab ? "text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
            style={activeTab === tab ? { backgroundColor: "#C8102E" } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-white border-b border-zinc-100">
        {FILTERS.map((f) => {
          const active = activeFilters.has(f)
          return (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                active
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {f}
            </button>
          )
        })}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Highlight card — Paige Field House */}
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #003087 0%, #001a4d 100%)" }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                Flagship Facility
              </span>
              <h3 className="text-lg font-bold mt-2">Paige Field House</h3>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-1">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs font-bold text-amber-300">88% Capacity</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200 mb-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>Del Mar, Building 220066</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-200 mb-3">
            <Clock className="h-3.5 w-3.5" />
            <span>Mon–Fri 5am–10pm · Sat–Sun 6am–8pm</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-300 font-medium">
              24/7 Access Available
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
              Olympic Pool
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
              Indoor Track
            </span>
          </div>
          <button
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold"
            style={{ color: "#003087" }}
          >
            View Details →
          </button>
        </div>

        {/* Program grid */}
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <p className="text-center text-zinc-400 py-8 text-sm">No programs match this filter</p>
        ) : (
          filtered.map((p) => {
            const util = UTIL_MAP[p.id]
            return (
              <div key={p.id} className="relative">
                {util && (
                  <div className={`absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold shadow-sm ${util.color}`}>
                    <Zap className="h-3 w-3" />
                    {util.pct}% capacity
                  </div>
                )}
                <ProgramCard program={p} onBook={() => setBookingProgram(p)} />
              </div>
            )
          })
        )}
      </div>

      <BookingModal
        program={bookingProgram}
        open={bookingProgram !== null}
        onClose={() => setBookingProgram(null)}
      />
    </div>
  )
}
