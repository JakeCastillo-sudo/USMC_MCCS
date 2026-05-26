"use client"

import { useState } from "react"
import {
  X, User, CreditCard, Clock, FileText,
  CheckCircle2, AlertCircle, CalendarClock, MessageSquare,
  Phone, Mail, Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Reservation, ReservationStatus } from "@/types"
import { toast } from "sonner"
import PaymentProcessor from "./PaymentProcessor"

type Tab = "details" | "patron" | "payment" | "history"

const STATUS_OPTIONS: ReservationStatus[] = [
  "pending", "confirmed", "waitlisted", "rescheduled", "cancelled", "completed", "no-show",
]

const STATUS_STYLES: Record<ReservationStatus, string> = {
  pending:     "bg-amber-100 text-amber-700",
  confirmed:   "bg-emerald-100 text-emerald-700",
  waitlisted:  "bg-blue-100 text-blue-700",
  rescheduled: "bg-purple-100 text-purple-700",
  cancelled:   "bg-zinc-100 text-zinc-500",
  completed:   "bg-zinc-100 text-zinc-600",
  "no-show":   "bg-red-100 text-red-700",
}

interface Props {
  reservation: Reservation | null
  open: boolean
  onClose: () => void
  onUpdate: (updated: Reservation) => void
}

export default function ReservationDetailModal({ reservation, open, onClose, onUpdate }: Props) {
  const [tab, setTab] = useState<Tab>("details")
  const [status, setStatus] = useState<ReservationStatus>("pending")
  const [staffNotes, setStaffNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [sendingConfirmation, setSendingConfirmation] = useState(false)

  if (!open || !reservation) return null

  // Safe alias — guaranteed non-null below
  const r = reservation

  async function handleStatusChange(newStatus: ReservationStatus) {
    setStatus(newStatus)
    setSaving(true)
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, status: newStatus }),
      })
      const json = await res.json()
      onUpdate(json.data)
      toast.success(`Status updated to ${newStatus}`)
    } catch {
      toast.error("Failed to update status")
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveNotes() {
    setSaving(true)
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, staffNotes: staffNotes || r.staffNotes }),
      })
      const json = await res.json()
      onUpdate(json.data)
      toast.success("Staff notes saved")
    } catch {
      toast.error("Failed to save notes")
    } finally {
      setSaving(false)
    }
  }

  async function handleSendConfirmation() {
    setSendingConfirmation(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(`Confirmation sent to ${r.patronEmail}`)
    setSendingConfirmation(false)
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "details", label: "Details",  icon: FileText    },
    { id: "patron",  label: "Patron",   icon: User        },
    { id: "payment", label: "Payment",  icon: CreditCard  },
    { id: "history", label: "History",  icon: Clock       },
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-100" style={{ backgroundColor: "#003087" }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-blue-200">{r.id}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", STATUS_STYLES[r.status])}>
                  {r.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-white">{r.programName}</h2>
              <p className="text-sm text-blue-200 mt-0.5">{r.patronName} · {r.date} at {r.time}</p>
            </div>
            <button onClick={onClose} className="text-blue-200 hover:text-white rounded-full p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-100 bg-zinc-50">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors",
                  tab === id
                    ? "border-[#003087] text-[#003087] bg-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">

            {/* ── Details Tab ── */}
            {tab === "details" && (
              <div className="px-6 py-5 space-y-5">
                {/* Booking info grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Facility",    value: r.facilityName },
                    { label: "Category",    value: r.category, capitalize: true },
                    { label: "Date",        value: r.date },
                    { label: "Time",        value: r.time },
                    { label: "Duration",    value: `${r.duration} min` },
                    { label: "Party Size",  value: `${r.partySize} guest${r.partySize !== 1 ? "s" : ""}` },
                  ].map(({ label, value, capitalize }) => (
                    <div key={label}>
                      <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">{label}</p>
                      <p className={cn("text-sm font-medium text-zinc-800 mt-0.5", capitalize && "capitalize")}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Status change */}
                <div className="rounded-xl border border-zinc-200 p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Change Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={saving || r.status === s}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold border transition-all",
                          r.status === s
                            ? "border-[#003087] bg-[#003087] text-white"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patron notes */}
                {r.notes && (
                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Patron Notes</p>
                    <p className="text-sm text-blue-800">{r.notes}</p>
                  </div>
                )}

                {/* Staff notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
                    Staff Notes
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={r.staffNotes}
                    onChange={e => setStaffNotes(e.target.value)}
                    placeholder="Add internal notes…"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={saving}
                      className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: "#003087" }}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Patron Tab ── */}
            {tab === "patron" && (
              <div className="px-6 py-5 space-y-4">
                {/* Patron summary card */}
                <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                    style={{ backgroundColor: "#003087" }}
                  >
                    {r.patronName.split(" ").slice(-2).map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{r.patronName}</p>
                    <p className="text-sm text-zinc-500">{r.patronRank}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                    <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-400">Phone</p>
                      <p className="text-sm font-medium text-zinc-800">{r.patronPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                    <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-xs text-zinc-400">Email</p>
                      <p className="text-sm font-medium text-zinc-800">{r.patronEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSendConfirmation}
                    disabled={sendingConfirmation}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#003087" }}
                  >
                    <Send className="h-4 w-4" />
                    {sendingConfirmation ? "Sending…" : "Send Confirmation"}
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Send Reminder
                  </button>
                </div>
              </div>
            )}

            {/* ── Payment Tab ── */}
            {tab === "payment" && (
              <div className="px-6 py-5">
                <PaymentProcessor reservation={r} onUpdate={onUpdate} />
              </div>
            )}

            {/* ── History Tab ── */}
            {tab === "history" && (
              <div className="px-6 py-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Activity Log</p>
                <div className="space-y-2">
                  {[
                    { icon: CheckCircle2, color: "text-emerald-500", label: "Reservation created", time: r.createdAt },
                    r.confirmationSentAt
                      ? { icon: Send,          color: "text-blue-500",    label: "Confirmation sent",    time: r.confirmationSentAt }
                      : null,
                    r.reminderSentAt
                      ? { icon: CalendarClock, color: "text-purple-500",  label: "Reminder sent",        time: r.reminderSentAt }
                      : null,
                    r.updatedAt !== r.createdAt
                      ? { icon: AlertCircle,   color: "text-amber-500",   label: "Record updated",       time: r.updatedAt }
                      : null,
                  ].filter(Boolean).map((entry, i) => {
                    const e = entry!
                    const Icon = e.icon
                    return (
                      <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-3">
                        <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", e.color)} />
                        <div>
                          <p className="text-sm font-medium text-zinc-800">{e.label}</p>
                          <p className="text-xs text-zinc-400">
                            {new Date(e.time).toLocaleString("en-US", {
                              month: "short", day: "numeric",
                              hour: "numeric", minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
