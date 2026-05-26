"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search, Star, Shield, Users, ChevronDown, AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Patron, LoyaltyTier } from "@/types"
import PatronProfileStaffView from "@/components/staff/PatronProfileStaffView"

const TIER_STYLES: Record<LoyaltyTier, { badge: string; ring: string }> = {
  Elite:    { badge: "bg-amber-100 text-amber-700",  ring: "ring-amber-300"  },
  Active:   { badge: "bg-blue-100 text-blue-700",    ring: "ring-blue-300"   },
  Standard: { badge: "bg-zinc-100 text-zinc-600",    ring: "ring-zinc-200"   },
}

const BRANCH_OPTIONS = ["", "USMC", "USN", "USA", "USAF", "USSF", "Retired", "DoD Civilian"]
const TIER_OPTIONS: (LoyaltyTier | "")[] = ["", "Elite", "Active", "Standard"]

function PatronCard({ patron, onClick }: { patron: Patron; onClick: () => void }) {
  const tierStyle = TIER_STYLES[patron.loyaltyTier]
  const initials  = `${patron.firstName[0]}${patron.lastName[0]}`
  const hasEFMP   = patron.dependents.some(d => d.eligibilityGroups.includes("EFMP"))

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-zinc-200 bg-white p-4 hover:border-[#003087]/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2", tierStyle.ring)}
          style={{ backgroundColor: "#003087" }}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-zinc-900 text-sm">
              {patron.rank} {patron.firstName} {patron.lastName}
            </p>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", tierStyle.badge)}>
              {patron.loyaltyTier}
            </span>
            {hasEFMP && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                EFMP
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{patron.unit}</p>
          <p className="text-xs text-zinc-400">{patron.branch}</p>
        </div>

        {/* Stats */}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 justify-end mb-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-700">{patron.csatAvg.toFixed(1)}</span>
          </div>
          <p className="text-xs text-zinc-500">{patron.totalBookings} bookings</p>
          <p className="text-xs font-semibold text-zinc-700">${patron.totalSpend.toLocaleString()}</p>
        </div>
      </div>

      {/* Eligibility row */}
      <div className="mt-3 flex items-center gap-2">
        {patron.eligibilityVerified ? (
          <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        ) : (
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        )}
        <div className="flex flex-wrap gap-1">
          {patron.eligibilityGroups.slice(0, 2).map(g => (
            <span key={g} className="text-[10px] text-zinc-500 bg-zinc-50 rounded px-1.5 py-0.5">
              {g}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-zinc-400 ml-auto">
          Last active {new Date(patron.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </button>
  )
}

export default function PatronsPage() {
  const [patrons, setPatrons] = useState<Patron[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")
  const [tier, setTier]       = useState<LoyaltyTier | "">("")
  const [branch, setBranch]   = useState("")
  const [selected, setSelected] = useState<Patron | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchPatrons = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (tier)   params.set("loyaltyTier", tier)
    if (branch) params.set("branch", branch)
    const res  = await fetch(`/api/patrons?${params}`)
    const json = await res.json()
    setPatrons(json.data)
    setLoading(false)
  }, [search, tier, branch])

  useEffect(() => { fetchPatrons() }, [fetchPatrons])

  function openPatron(p: Patron) {
    setSelected(p)
    setModalOpen(true)
  }

  const eliteCount    = patrons.filter(p => p.loyaltyTier === "Elite").length
  const activeCount   = patrons.filter(p => p.loyaltyTier === "Active").length
  const efmpCount     = patrons.filter(p => p.dependents.some(d => d.eligibilityGroups.includes("EFMP"))).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Patron Directory</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Browse and manage patron profiles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {[
          { label: "Total Patrons", value: patrons.length, icon: Users,  color: "bg-[#003087]" },
          { label: "Elite Tier",    value: eliteCount,     icon: Star,   color: "bg-amber-500" },
          { label: "Active Tier",   value: activeCount,    icon: Shield, color: "bg-blue-500"  },
          { label: "EFMP Families", value: efmpCount,      icon: AlertTriangle, color: "bg-amber-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4 flex items-center gap-3">
            <div className={cn("rounded-lg p-2.5", color)}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900">{value}</p>
              <p className="text-xs text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, rank, email, unit…"
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
          />
        </div>

        <div className="relative">
          <select
            value={tier}
            onChange={e => setTier(e.target.value as LoyaltyTier | "")}
            className="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none"
          >
            {TIER_OPTIONS.map(t => (
              <option key={t} value={t}>{t === "" ? "All Tiers" : t}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>

        <div className="relative">
          <select
            value={branch}
            onChange={e => setBranch(e.target.value)}
            className="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none"
          >
            {BRANCH_OPTIONS.map(b => (
              <option key={b} value={b}>{b === "" ? "All Branches" : b}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>
      </div>

      {/* Patron grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 h-28 animate-pulse">
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-zinc-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-100 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : patrons.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white py-20 text-center text-zinc-400">
          <Users className="mx-auto h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No patrons found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patrons.map(p => (
            <PatronCard key={p.id} patron={p} onClick={() => openPatron(p)} />
          ))}
        </div>
      )}

      {!loading && patrons.length > 0 && (
        <p className="text-xs text-zinc-400 text-center">
          Showing {patrons.length} patron{patrons.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Profile modal */}
      <PatronProfileStaffView
        patron={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
