"use client"

import { useState } from "react"
import {
  X, User, Users, CalendarCheck, CreditCard, FileText,
  Star, Shield, AlertTriangle, Phone, Mail, MapPin,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Patron, LoyaltyTier } from "@/types"

type Tab = "profile" | "family" | "bookings" | "payments" | "notes"

const TIER_STYLES: Record<LoyaltyTier, { bg: string; text: string; border: string }> = {
  Elite:    { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-300" },
  Active:   { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-300"  },
  Standard: { bg: "bg-zinc-50",    text: "text-zinc-600",   border: "border-zinc-200"  },
}

interface Props {
  patron: Patron | null
  open: boolean
  onClose: () => void
}

export default function PatronProfileStaffView({ patron, open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("profile")
  const [staffNote, setStaffNote] = useState("")

  if (!open || !patron) return null

  const p = patron
  const tierStyle = TIER_STYLES[p.loyaltyTier]

  const initials = `${p.firstName[0]}${p.lastName[0]}`

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile",  label: "Profile",  icon: User         },
    { id: "family",   label: "Family",   icon: Users        },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "payments", label: "Payments", icon: CreditCard   },
    { id: "notes",    label: "Notes",    icon: FileText     },
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-100" style={{ backgroundColor: "#003087" }}>
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-base font-bold text-white">{p.rank} {p.firstName} {p.lastName}</h2>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold border", tierStyle.bg, tierStyle.text, tierStyle.border)}>
                    {p.loyaltyTier}
                  </span>
                </div>
                <p className="text-sm text-blue-200">{p.branch} · {p.unit}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-blue-200 hover:text-white rounded-full p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-100 bg-zinc-50 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
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

            {/* ── Profile Tab ── */}
            {tab === "profile" && (
              <div className="px-6 py-5 space-y-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-zinc-200 p-3 text-center">
                    <p className="text-2xl font-bold text-zinc-900">{p.totalBookings}</p>
                    <p className="text-xs text-zinc-500">Total Bookings</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 p-3 text-center">
                    <p className="text-2xl font-bold text-zinc-900">${p.totalSpend.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500">Total Spend</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-2xl font-bold text-zinc-900">{p.csatAvg.toFixed(1)}</p>
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-xs text-zinc-500">CSAT Avg</p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2">
                  {[
                    { icon: Phone, label: p.phone },
                    { icon: Mail,  label: p.email },
                    { icon: MapPin,label: p.address },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                      <Icon className="h-4 w-4 text-zinc-400 shrink-0" />
                      <p className="text-sm text-zinc-700">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Eligibility */}
                <div className="rounded-xl border border-zinc-200 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-zinc-500" />
                    <p className="text-sm font-semibold text-zinc-800">Eligibility</p>
                    {p.eligibilityVerified ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500 ml-auto" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.eligibilityGroups.map(g => (
                      <span key={g} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Expires: {new Date(p.eligibilityExpiry).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>

                {/* Member since */}
                <div className="flex items-center gap-2 text-xs text-zinc-400 border-t border-zinc-100 pt-3">
                  <span>Member since {new Date(p.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                  <span>·</span>
                  <span>Last active {new Date(p.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </div>
            )}

            {/* ── Family Tab ── */}
            {tab === "family" && (
              <div className="px-6 py-5 space-y-3">
                {p.dependents.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No dependents on file</p>
                  </div>
                ) : (
                  p.dependents.map(dep => (
                    <div
                      key={dep.id}
                      className={cn(
                        "rounded-xl border p-4",
                        dep.specialNeeds ? "border-amber-200 bg-amber-50" : "border-zinc-200"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-zinc-900">{dep.firstName} {dep.lastName}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{dep.relationship} · Age {dep.age}</p>
                          <p className="text-xs text-zinc-400">DOB: {dep.dateOfBirth}</p>
                        </div>
                        {dep.specialNeeds && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                            EFMP
                          </span>
                        )}
                      </div>
                      {dep.specialNeeds && (
                        <div className="mt-3 rounded-lg bg-white border border-amber-200 p-3">
                          <p className="text-xs font-semibold text-amber-700 mb-1">Special Needs Note</p>
                          <p className="text-xs text-zinc-700">{dep.specialNeeds}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dep.eligibilityGroups.map(g => (
                          <span key={g} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Bookings Tab ── */}
            {tab === "bookings" && (
              <div className="px-6 py-5 space-y-3">
                {p.bookingHistory.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <CalendarCheck className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No booking history</p>
                  </div>
                ) : (
                  p.bookingHistory.map(b => (
                    <div key={b.reservationId} className="rounded-xl border border-zinc-200 p-4">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-zinc-800 text-sm">{b.programName}</p>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          b.status === "completed"  ? "bg-emerald-100 text-emerald-700" :
                          b.status === "confirmed"  ? "bg-blue-100 text-blue-700" :
                          b.status === "waitlisted" ? "bg-amber-100 text-amber-700" :
                          "bg-zinc-100 text-zinc-600"
                        )}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span>{new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span>·</span>
                        <span className="capitalize">{b.category}</span>
                        <span>·</span>
                        <span className="font-semibold">{b.amount === 0 ? "Free" : `$${b.amount}`}</span>
                      </div>
                      {b.csatScore && (
                        <div className="flex items-center gap-1 mt-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < b.csatScore! ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                              )}
                            />
                          ))}
                          {b.review && <span className="text-xs text-zinc-500 ml-1">"{b.review}"</span>}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Payments Tab ── */}
            {tab === "payments" && (
              <div className="px-6 py-5 space-y-3">
                <div className="rounded-xl border border-zinc-200 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Total Lifetime Spend</p>
                    <p className="text-xs text-zinc-500">{p.totalBookings} bookings</p>
                  </div>
                  <p className="text-2xl font-bold text-zinc-900">${p.totalSpend.toLocaleString()}</p>
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Payment Methods on File</p>
                {p.paymentMethods.map(pm => (
                  <div key={pm.id} className="rounded-xl border border-zinc-200 p-4 flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-zinc-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-800">
                        {pm.type} ···· {pm.last4}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Expires {pm.expiryMonth}/{pm.expiryYear}
                        {pm.nickname ? ` · ${pm.nickname}` : ""}
                      </p>
                    </div>
                    {pm.isDefault && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Notes Tab ── */}
            {tab === "notes" && (
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs text-zinc-500">
                  Staff notes are internal only and not visible to the patron.
                </p>
                <textarea
                  rows={6}
                  value={staffNote}
                  onChange={e => setStaffNote(e.target.value)}
                  placeholder="Add a staff note about this patron…"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 resize-none"
                />
                <button
                  disabled={!staffNote.trim()}
                  className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: "#003087" }}
                  onClick={() => {
                    setStaffNote("")
                  }}
                >
                  Save Note
                </button>

                {/* Preference summary */}
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Patron Preferences</p>
                  {p.preferences.dietaryRestrictions.length > 0 && (
                    <p className="text-xs text-zinc-600">
                      <span className="font-semibold">Diet: </span>
                      {p.preferences.dietaryRestrictions.join(", ")}
                    </p>
                  )}
                  {p.preferences.accessibilityNeeds.length > 0 && (
                    <p className="text-xs text-zinc-600">
                      <span className="font-semibold">Accessibility: </span>
                      {p.preferences.accessibilityNeeds.join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-zinc-600">
                    <span className="font-semibold">Notifications: </span>
                    {p.preferences.preferredNotifications.join(", ")}
                  </p>
                  <p className="text-xs text-zinc-600">
                    <span className="font-semibold">Language: </span>
                    {p.preferences.preferredLanguage === "en" ? "English" : "Spanish"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
