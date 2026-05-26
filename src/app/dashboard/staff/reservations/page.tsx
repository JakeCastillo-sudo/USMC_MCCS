"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search, Filter, CalendarCheck, Clock, CheckCircle2,
  XCircle, AlertCircle, ChevronDown, RefreshCw, Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Reservation, ReservationStatus, ProgramCategory } from "@/types"
import ReservationDetailModal from "@/components/staff/ReservationDetailModal"

// ── Status helpers ──────────────────────────────────────────────────────────

const STATUS_STYLES: Record<ReservationStatus, { bg: string; text: string; dot: string }> = {
  pending:     { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  confirmed:   { bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-500" },
  waitlisted:  { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  rescheduled: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  cancelled:   { bg: "bg-zinc-100",   text: "text-zinc-500",   dot: "bg-zinc-400"   },
  completed:   { bg: "bg-zinc-100",   text: "text-zinc-600",   dot: "bg-zinc-500"   },
  "no-show":   { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
}

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending:     "Pending",
  confirmed:   "Confirmed",
  waitlisted:  "Waitlisted",
  rescheduled: "Rescheduled",
  cancelled:   "Cancelled",
  completed:   "Completed",
  "no-show":   "No-Show",
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", s.bg, s.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {STATUS_LABELS[status]}
    </span>
  )
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: "", label: "All Categories" },
  { value: "fitness",        label: "Fitness"        },
  { value: "childcare",      label: "Childcare"      },
  { value: "dining",         label: "Dining"         },
  { value: "recreation",     label: "Recreation"     },
  { value: "lodging",        label: "Lodging"        },
  { value: "retail",         label: "Retail"         },
  { value: "family-support", label: "Family Support" },
]

const STATUSES: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
]

// ── Stat card ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  color: string
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 flex items-center gap-3">
      <div className={cn("rounded-lg p-2.5", color)}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-zinc-900">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter)   params.set("status",   statusFilter)
    if (categoryFilter) params.set("category", categoryFilter)
    if (search)         params.set("search",   search)
    const res = await fetch(`/api/reservations?${params}`)
    const json = await res.json()
    setReservations(json.data)
    setLoading(false)
  }, [statusFilter, categoryFilter, search])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  // Stats derived from full list (unfiltered) — fetch once
  const [allStats, setAllStats] = useState({ pending: 0, confirmed: 0, waitlisted: 0, total: 0 })
  useEffect(() => {
    fetch("/api/reservations").then(r => r.json()).then(j => {
      const all: Reservation[] = j.data
      setAllStats({
        total:     all.length,
        pending:   all.filter(r => r.status === "pending").length,
        confirmed: all.filter(r => r.status === "confirmed").length,
        waitlisted:all.filter(r => r.status === "waitlisted").length,
      })
    })
  }, [])

  function openModal(r: Reservation) {
    setSelected(r)
    setModalOpen(true)
  }

  function handleUpdate(updated: Reservation) {
    setReservations(prev => prev.map(r => r.id === updated.id ? updated : r))
    setSelected(updated)
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selectedIds.size === reservations.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(reservations.map(r => r.id)))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Reservations</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Manage and track all patron bookings</p>
        </div>
        <button
          onClick={fetchReservations}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CalendarCheck} label="Total Bookings"   value={allStats.total}     color="bg-[#003087]" />
        <StatCard icon={Clock}         label="Pending Review"   value={allStats.pending}   color="bg-amber-500" />
        <StatCard icon={CheckCircle2}  label="Confirmed Today"  value={allStats.confirmed} color="bg-emerald-500" />
        <StatCard icon={Users}         label="On Waitlist"      value={allStats.waitlisted}color="bg-blue-500" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patron, program, ID…"
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
            <Filter className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-amber-700">{selectedIds.size} selected</span>
            <button
              className="ml-2 text-xs font-bold text-[#C8102E] underline"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300"
                    checked={selectedIds.size === reservations.length && reservations.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">ID / Date</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Patron</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Program</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Payment</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-zinc-100 animate-pulse" style={{ width: j === 0 ? 24 : "80%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-zinc-400">
                    <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    No reservations found
                  </td>
                </tr>
              ) : (
                reservations.map(r => (
                  <tr
                    key={r.id}
                    className={cn(
                      "hover:bg-zinc-50 cursor-pointer transition-colors",
                      selectedIds.has(r.id) && "bg-blue-50"
                    )}
                    onClick={() => openModal(r)}
                  >
                    <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleSelect(r.id) }}>
                      <input
                        type="checkbox"
                        className="rounded border-zinc-300"
                        checked={selectedIds.has(r.id)}
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-zinc-500">{r.id}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{r.date} · {r.time}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-900">{r.patronName}</p>
                      <p className="text-xs text-zinc-400">{r.patronRank}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-800 max-w-[180px] truncate">{r.programName}</p>
                      <p className="text-xs text-zinc-400 capitalize">{r.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        r.paymentStatus === "paid"     ? "bg-emerald-100 text-emerald-700" :
                        r.paymentStatus === "unpaid"   ? "bg-red-100 text-red-700" :
                        r.paymentStatus === "refunded" ? "bg-zinc-100 text-zinc-600" :
                        r.paymentStatus === "partial"  ? "bg-amber-100 text-amber-700" :
                        "bg-zinc-100 text-zinc-500"
                      )}>
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      {r.paymentAmount === 0 ? (
                        <span className="text-emerald-600 text-xs font-bold">FREE</span>
                      ) : (
                        `$${r.paymentAmount}`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                        onClick={e => { e.stopPropagation(); openModal(r) }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {!loading && reservations.length > 0 && (
          <div className="border-t border-zinc-100 px-4 py-3 flex items-center justify-between text-xs text-zinc-400">
            <span>Showing {reservations.length} reservation{reservations.length !== 1 ? "s" : ""}</span>
            {selectedIds.size > 0 && (
              <span className="font-semibold text-amber-600">{selectedIds.size} selected</span>
            )}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <ReservationDetailModal
        reservation={selected}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
