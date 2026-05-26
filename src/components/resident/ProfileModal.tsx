"use client"

import { useState } from "react"
import {
  X, User, Users, CreditCard, CalendarCheck, Settings,
  Star, Shield, CheckCircle2, Phone, Mail, MapPin,
  Heart, Bell, Utensils, Accessibility,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Patron, LoyaltyTier } from "@/types"

type Tab = "profile" | "family" | "payments" | "bookings" | "preferences"

const TIER_COLORS: Record<LoyaltyTier, { ring: string; badge: string; bg: string }> = {
  Elite:    { ring: "ring-amber-400",  badge: "bg-amber-100 text-amber-700",  bg: "bg-amber-50"  },
  Active:   { ring: "ring-blue-400",   badge: "bg-blue-100 text-blue-700",    bg: "bg-blue-50"   },
  Standard: { ring: "ring-zinc-300",   badge: "bg-zinc-100 text-zinc-600",    bg: "bg-zinc-50"   },
}

interface Props {
  patron: Patron
  open: boolean
  onClose: () => void
}

export default function ProfileModal({ patron: p, open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("profile")

  if (!open) return null

  const tier      = TIER_COLORS[p.loyaltyTier]
  const initials  = `${p.firstName[0]}${p.lastName[0]}`

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile",     label: "My Profile",    icon: User         },
    { id: "family",      label: "My Family",     icon: Users        },
    { id: "payments",    label: "Payment Methods",icon: CreditCard  },
    { id: "bookings",    label: "My Bookings",   icon: CalendarCheck},
    { id: "preferences", label: "Preferences",   icon: Settings     },
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div className="w-full sm:max-w-lg max-h-[92vh] flex flex-col bg-white sm:rounded-2xl shadow-2xl overflow-hidden">

          {/* Hero header */}
          <div
            className="relative px-5 pt-6 pb-4"
            style={{ background: "linear-gradient(135deg, #003087 0%, #001a4d 100%)" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-blue-200 hover:text-white rounded-full p-1 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className={cn("h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold ring-3 shrink-0", tier.ring)}
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-bold text-white">{p.firstName} {p.lastName}</h2>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", tier.badge)}>
                    {p.loyaltyTier}
                  </span>
                </div>
                <p className="text-sm text-blue-200">{p.rank} · {p.branch}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-blue-300">
                  <span>{p.totalBookings} bookings</span>
                  <span>·</span>
                  <span>${p.totalSpend.toLocaleString()} spent</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{p.csatAvg.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-100 bg-zinc-50 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors",
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

            {/* ── My Profile ── */}
            {tab === "profile" && (
              <div className="px-5 py-5 space-y-4">
                {/* Contact */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Contact Information</p>
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
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800">Eligibility Verified</p>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.eligibilityGroups.map(g => (
                      <span key={g} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-emerald-600 mt-2">
                    Valid through {new Date(p.eligibilityExpiry).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Member since */}
                <p className="text-xs text-zinc-400 text-center">
                  MCCS Member since {new Date(p.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            )}

            {/* ── My Family ── */}
            {tab === "family" && (
              <div className="px-5 py-5 space-y-3">
                {p.dependents.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No dependents registered</p>
                    <p className="text-xs mt-1">Visit the MCCS office to add family members</p>
                  </div>
                ) : (
                  p.dependents.map(dep => (
                    <div key={dep.id} className="rounded-xl border border-zinc-200 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-600 shrink-0">
                          {dep.firstName[0]}{dep.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-zinc-900 text-sm">{dep.firstName} {dep.lastName}</p>
                          <p className="text-xs text-zinc-500">{dep.relationship} · Age {dep.age}</p>
                        </div>
                        <span className="text-xs text-zinc-400">DOB: {dep.dateOfBirth}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dep.eligibilityGroups.map(g => (
                          <span key={g} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Payment Methods ── */}
            {tab === "payments" && (
              <div className="px-5 py-5 space-y-3">
                {p.paymentMethods.map(pm => (
                  <div
                    key={pm.id}
                    className={cn(
                      "rounded-xl border p-4 flex items-center gap-3",
                      pm.isDefault ? "border-[#003087]/30 bg-blue-50" : "border-zinc-200"
                    )}
                  >
                    <CreditCard className={cn("h-5 w-5 shrink-0", pm.isDefault ? "text-[#003087]" : "text-zinc-400")} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-900">
                        {pm.type} ···· {pm.last4}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Expires {pm.expiryMonth}/{pm.expiryYear}
                        {pm.nickname ? ` · ${pm.nickname}` : ""}
                      </p>
                    </div>
                    {pm.isDefault && (
                      <span className="rounded-full bg-[#003087] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        Default
                      </span>
                    )}
                  </div>
                ))}
                <p className="text-xs text-zinc-400 text-center pt-2">
                  To add or remove payment methods, visit the MCCS front desk or MCCS Pay app.
                </p>
              </div>
            )}

            {/* ── My Bookings ── */}
            {tab === "bookings" && (
              <div className="px-5 py-5 space-y-3">
                {p.bookingHistory.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <CalendarCheck className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No bookings yet</p>
                  </div>
                ) : (
                  p.bookingHistory.map(b => (
                    <div key={b.reservationId} className="rounded-xl border border-zinc-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-zinc-900 text-sm">{b.programName}</p>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                            <span>{new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span>·</span>
                            <span className="capitalize">{b.category}</span>
                            <span>·</span>
                            <span>{b.amount === 0 ? "Free" : `$${b.amount}`}</span>
                          </div>
                        </div>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold ml-2",
                          b.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                          b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          b.status === "waitlisted"? "bg-amber-100 text-amber-700" :
                          "bg-zinc-100 text-zinc-500"
                        )}>
                          {b.status}
                        </span>
                      </div>
                      {b.csatScore != null && (
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < b.csatScore! ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                              )}
                            />
                          ))}
                          {b.review && (
                            <span className="text-xs text-zinc-500 ml-1 italic">"{b.review}"</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Preferences ── */}
            {tab === "preferences" && (
              <div className="px-5 py-5 space-y-5">
                {/* Favorite categories */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-zinc-400" />
                    <p className="text-sm font-semibold text-zinc-800">Favorite Programs</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.preferences.favoriteCategories.map(c => (
                      <span key={c} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 capitalize">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-zinc-400" />
                    <p className="text-sm font-semibold text-zinc-800">Notifications</p>
                  </div>
                  <div className="flex gap-2">
                    {(["email", "sms", "push"] as const).map(n => (
                      <span
                        key={n}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                          p.preferences.preferredNotifications.includes(n)
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="h-4 w-4 text-zinc-400" />
                    <p className="text-sm font-semibold text-zinc-800">Dietary Preferences</p>
                  </div>
                  {p.preferences.dietaryRestrictions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {p.preferences.dietaryRestrictions.map(d => (
                        <span key={d} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400">No dietary restrictions on file</p>
                  )}
                </div>

                {/* Accessibility */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Accessibility className="h-4 w-4 text-zinc-400" />
                    <p className="text-sm font-semibold text-zinc-800">Accessibility Needs</p>
                  </div>
                  {p.preferences.accessibilityNeeds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {p.preferences.accessibilityNeeds.map(a => (
                        <span key={a} className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400">No accessibility accommodations on file</p>
                  )}
                </div>

                <p className="text-xs text-zinc-400 text-center pt-2 border-t border-zinc-100">
                  To update preferences, contact your MCCS customer service representative.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
