"use client"

import { useEffect, useState } from "react"
import {
  Dumbbell, Baby, UtensilsCrossed, Tent,
  ShoppingBag, BedDouble, AlertTriangle
} from "lucide-react"
import SearchBar from "@/components/resident/SearchBar"
import QuickActions from "@/components/resident/QuickActions"
import FeaturedPrograms from "@/components/resident/FeaturedPrograms"
import CategoryTile from "@/components/resident/CategoryTile"
import ProgramCard from "@/components/resident/ProgramCard"
import BookingModal from "@/components/resident/BookingModal"
import type { Program, Alert } from "@/types"

const CATEGORIES = [
  {
    category: "fitness"   as const,
    label: "Fitness",
    icon: Dumbbell,
    count: 15,
    href: "/resident/fitness",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    category: "childcare" as const,
    label: "Childcare",
    icon: Baby,
    count: 5,
    href: "/resident/childcare",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    category: "dining"    as const,
    label: "Dining",
    icon: UtensilsCrossed,
    count: 8,
    href: "/resident/dining",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    category: "recreation" as const,
    label: "Recreation",
    icon: Tent,
    count: 7,
    href: "/resident/recreation",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    category: "retail"    as const,
    label: "Shopping",
    icon: ShoppingBag,
    count: 2,
    href: "/resident/fitness", // fallback for demo
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    category: "lodging"   as const,
    label: "Lodging",
    icon: BedDouble,
    count: 3,
    href: "/resident/recreation",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning, Marine"
  if (h < 17) return "Good afternoon, Marine"
  return "Good evening, Marine"
}

export default function ResidentHomePage() {
  const [searchResults, setSearchResults] = useState<Program[] | null>(null)
  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([])
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((d) => {
        const alerts = (d.data as Alert[]).filter((a) => a.level === "critical")
        setCriticalAlerts(alerts)
      })
      .catch(() => {})
  }, [])

  const showResults = searchResults !== null

  return (
    <div>
      {/* Hero */}
      <div
        className="relative px-4 pb-16 pt-10"
        style={{
          background: "linear-gradient(135deg, #003087 0%, #001a4d 100%)",
        }}
      >
        <p className="text-sm font-medium text-blue-200 mb-1">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-white leading-tight mb-1">
          Welcome to MCCS<br />Camp Pendleton
        </h1>
        <p className="text-sm text-blue-200 mb-6">Everything you need, all in one place</p>

        {/* Search bar overlapping bottom edge */}
        <div className="absolute left-4 right-4 bottom-0 translate-y-1/2">
          <div className="rounded-2xl bg-white shadow-lg p-3">
            <SearchBar
              onResults={(programs) => setSearchResults(programs)}
              placeholder="Search fitness classes, dining, childcare..."
            />
          </div>
        </div>
      </div>

      {/* Content — pushed down to clear the overlapping search bar */}
      <div className="mt-14 px-4 space-y-8 pb-8">

        {/* Search results overlay */}
        {showResults && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-700">
                {searchResults.length === 0
                  ? "No results found"
                  : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`}
              </h2>
              <button
                onClick={() => setSearchResults(null)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {searchResults.slice(0, 10).map((p) => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  compact
                  onBook={() => setBookingProgram(p)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Normal home content — hidden while search results showing */}
        {!showResults && (
          <>
            {/* Quick Actions */}
            <section>
              <h2 className="text-base font-bold text-zinc-900 mb-3">What are you looking for?</h2>
              <QuickActions />
            </section>

            {/* Featured Programs */}
            <FeaturedPrograms />

            {/* CDC waitlist alert */}
            {criticalAlerts.length > 0 && (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900 text-sm">Childcare Waitlist</p>
                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                      187 families are currently waitlisted for CDC-1 Mainside. Join the waitlist to be notified of openings.
                    </p>
                    <button
                      className="mt-2 text-xs font-semibold underline"
                      style={{ color: "#C8102E" }}
                      onClick={() => window.location.href = "/resident/childcare"}
                    >
                      Join Waitlist →
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Category Grid */}
            <section>
              <h2 className="text-base font-bold text-zinc-900 mb-3">Browse All Services</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map((cat) => (
                  <CategoryTile key={cat.category} {...cat} />
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center space-y-3 pt-4 pb-2">
              <p className="text-xs text-zinc-400">
                MCCS Camp Pendleton · pendleton.usmc-mccs.org
              </p>
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: "#003087" }}
              >
                Built on Operation StormBreaker
              </div>
              <p className="text-xs text-zinc-400">
                Military/Veterans Crisis Line: <span className="font-semibold">Dial 988</span>
              </p>
            </footer>
          </>
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
