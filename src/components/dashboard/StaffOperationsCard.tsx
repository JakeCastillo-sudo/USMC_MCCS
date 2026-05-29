"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarCheck, CreditCard, BookUser,
  Clock, AlertCircle, CheckCircle2, ChevronRight,
} from "lucide-react"
import type { Reservation, PaymentTransaction } from "@/types"

interface Stats {
  pendingReservations: number
  confirmedToday:      number
  pendingPayments:     number
  todayCheckIns:       number
}

export default function StaffOperationsCard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function load() {
      const [resRes, payRes] = await Promise.all([
        fetch("/api/reservations"),
        fetch("/api/payments"),
      ])
      const [resJson, payJson] = await Promise.all([resRes.json(), payRes.json()])

      const reservations: Reservation[]       = resJson.data
      const payments:     PaymentTransaction[] = payJson.data

      const today = new Date().toISOString().split("T")[0]

      setStats({
        pendingReservations: reservations.filter(r => r.status === "pending").length,
        confirmedToday:      reservations.filter(r => r.status === "confirmed" && r.date === today).length,
        pendingPayments:     payments.filter(p => p.status === "pending").length,
        todayCheckIns:       reservations.filter(r => r.date === today && r.status !== "cancelled" && r.status !== "no-show").length,
      })
    }
    load()
  }, [])

  const LINKS = [
    {
      href:  "/dashboard/staff/reservations",
      icon:  CalendarCheck,
      label: "Reservations",
      value: stats?.pendingReservations ?? "—",
      sub:   "pending review",
      color: "bg-amber-50 text-amber-600",
      ring:  "ring-amber-200",
    },
    {
      href:  "/dashboard/staff/payments",
      icon:  CreditCard,
      label: "Payments",
      value: stats?.pendingPayments ?? "—",
      sub:   "pending collection",
      color: "bg-red-50 text-red-600",
      ring:  "ring-red-200",
    },
    {
      href:  "/dashboard/staff/patrons",
      icon:  BookUser,
      label: "Patron Directory",
      value: "15",
      sub:   "patrons on file",
      color: "bg-blue-50 text-blue-600",
      ring:  "ring-blue-200",
    },
  ]

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-amber-100 p-2">
          <CalendarCheck className="h-4 w-4 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-amber-900">Staff Operations</h3>
          <p className="text-xs text-amber-600">Today&apos;s operational snapshot</p>
        </div>
        <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
          STAFF
        </span>
      </div>

      {/* Today's summary row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-white border border-amber-200 p-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-500 shrink-0" />
          <div>
            <p className="text-lg font-bold text-zinc-900">{stats?.todayCheckIns ?? "—"}</p>
            <p className="text-[10px] text-zinc-500">today&apos;s check-ins</p>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-emerald-200 p-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <div>
            <p className="text-lg font-bold text-zinc-900">{stats?.confirmedToday ?? "—"}</p>
            <p className="text-[10px] text-zinc-500">confirmed today</p>
          </div>
        </div>
      </div>

      {/* Quick-access links */}
      <div className="grid grid-cols-3 gap-3">
        {LINKS.map(({ href, icon: Icon, label, value, sub, color, ring }) => (
          <Link
            key={href}
            href={href}
            className={`group rounded-xl border bg-white p-3 ring-1 ${ring} hover:shadow-sm transition-all`}
          >
            <div className={`rounded-lg p-2 ${color} w-fit mb-2`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-lg font-bold text-zinc-900">{value}</p>
            <p className="text-[10px] text-zinc-400">{sub}</p>
            <div className="flex items-center gap-0.5 mt-1.5 text-[10px] font-semibold text-zinc-500 group-hover:text-[#003087] transition-colors">
              {label}
              <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      {stats && stats.pendingReservations > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-100 border border-amber-200 px-3 py-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">
            <span className="font-bold">{stats.pendingReservations} reservation{stats.pendingReservations !== 1 ? "s" : ""}</span> need staff review
          </p>
          <Link
            href="/dashboard/staff/reservations?status=pending"
            className="ml-auto text-xs font-bold text-amber-700 underline"
          >
            Review →
          </Link>
        </div>
      )}
    </div>
  )
}
