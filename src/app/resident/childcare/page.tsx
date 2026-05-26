"use client"

import { useEffect, useState } from "react"
import { Baby, AlertTriangle, Calculator, Clock, Heart, Phone, MapPin, BookOpen } from "lucide-react"
import ProgramCard from "@/components/resident/ProgramCard"
import BookingModal from "@/components/resident/BookingModal"
import ChildcareWaitlistForm from "@/components/resident/ChildcareWaitlistForm"
import { Skeleton } from "@/components/ui/skeleton"
import type { Program } from "@/types"

// ── DoD Fee Tiers ─────────────────────────────────────────────────────────────
const FEE_TIERS = [
  { tier: 1, income: "< $25,800",       weekly: 72,  monthly: 288  },
  { tier: 2, income: "$25,800–$36,700", weekly: 107, monthly: 428  },
  { tier: 3, income: "$36,701–$47,600", weekly: 144, monthly: 576  },
  { tier: 4, income: "$47,601–$60,600", weekly: 175, monthly: 700  },
  { tier: 5, income: "$60,601–$76,800", weekly: 205, monthly: 820  },
  { tier: 6, income: "> $76,800",       weekly: 243, monthly: 972  },
]

// ── Waitlist trend ────────────────────────────────────────────────────────────
const WAITLIST_HISTORY = [
  { week: "Mar W1", cdc1: 203, cdc2: 51 },
  { week: "Mar W3", cdc1: 199, cdc2: 49 },
  { week: "Apr W1", cdc1: 194, cdc2: 47 },
  { week: "Apr W3", cdc1: 191, cdc2: 46 },
  { week: "May W1", cdc1: 189, cdc2: 45 },
  { week: "May W2", cdc1: 188, cdc2: 44 },
  { week: "May W3", cdc1: 187, cdc2: 43 },
]

// ── CDC Centers ───────────────────────────────────────────────────────────────
const CDC_CENTERS = [
  { id: "cdc-1", name: "CDC-1 Mainside",    area: "Mainside",    capacityPct: 100, waitlist: 187, status: "waitlist" as const, rate: "$180–$250/week based on income" },
  { id: "cdc-2", name: "CDC-2 Las Pulgas",  area: "Las Pulgas",  capacityPct: 100, waitlist: 43,  status: "waitlist" as const, rate: "$180–$250/week based on income" },
  { id: "cdc-3", name: "CDC-3 San Onofre",  area: "San Onofre",  capacityPct: 82,  waitlist: null,status: "limited"  as const, rate: "$180–$250/week based on income" },
]

// ── EFMP Resources ────────────────────────────────────────────────────────────
const EFMP_RESOURCES = [
  {
    icon: Heart,
    title: "EFMP Enrollment & Coordination",
    description: "Families with special needs dependents receive priority consideration for CDC placement. Contact the EFMP coordinator before applying.",
    contact: "EFMP: (760) 725-5819 · BLDG 13150 Mainside · Mon–Fri 8:00 AM–4:30 PM",
  },
  {
    icon: BookOpen,
    title: "Exceptional Family Member Services",
    description: "EFMS provides support planning, respite care referrals, and IEP advocacy for families with enrolled dependents.",
    contact: "EFMS: (760) 725-5816 · Building 13150",
  },
  {
    icon: Phone,
    title: "Military OneSource — Special Needs",
    description: "24/7 confidential counseling and special needs program navigation. Connect with a special needs consultant at no cost.",
    contact: "1-800-342-9647 · militaryonesource.mil",
  },
  {
    icon: MapPin,
    title: "MCFTB Family Counseling",
    description: "Marine Corps Family Team Building provides workshops, support groups, and one-on-one counseling for families navigating EFMP.",
    contact: "MCFTB: (760) 725-9716 · Building 13150",
  },
]

// ── Capacity Bar ──────────────────────────────────────────────────────────────
function CapacityBar({ pct, status }: { pct: number; status: "waitlist" | "limited" | "open" }) {
  const color =
    status === "waitlist" ? "bg-red-500" : status === "limited" ? "bg-amber-500" : "bg-emerald-500"
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-zinc-500 mb-1">
        <span>Availability</span>
        <span className="font-medium">
          {status === "waitlist" ? "WAITLIST" : status === "limited" ? "Limited" : "Open"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ChildcarePage() {
  const [programs, setPrograms]           = useState<Program[]>([])
  const [loading, setLoading]             = useState(true)
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)
  const [selectedTier, setSelectedTier]   = useState<number | null>(null)
  const [waitlistCdc, setWaitlistCdc]     = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/programs?category=childcare")
      .then((r) => r.json())
      .then((d) => setPrograms(d.data as Program[]))
      .finally(() => setLoading(false))
  }, [])

  const otherPrograms = programs.filter(
    (p) => !CDC_CENTERS.find(c => p.id.startsWith(c.id))
  )

  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{ background: "linear-gradient(135deg, #003087 0%, #001a4d 100%)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Baby className="h-5 w-5 text-blue-200" />
          <h1 className="text-xl font-bold text-white">Child & Youth Programs</h1>
        </div>
        <p className="text-sm text-blue-200">CDC, School Age Care & Youth Programs · Camp Pendleton</p>
      </div>

      {/* Critical notice */}
      <div className="mx-4 mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">High Demand: CDC Waitlists Active</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Childcare demand exceeds current capacity. Register early and join a waitlist to be notified of openings.
            </p>
            <a href="#cdc-section" className="mt-1.5 inline-block text-xs font-semibold underline" style={{ color: "#C8102E" }}>
              Check Availability →
            </a>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">

        {/* CDC Section */}
        <section id="cdc-section">
          <h2 className="text-base font-bold text-zinc-900 mb-3">Child Development Centers</h2>
          <div className="space-y-3">
            {CDC_CENTERS.map((cdc) => (
              <div key={cdc.id} className="rounded-2xl bg-white shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-900">{cdc.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{cdc.area} · Ages 6 weeks – 5 years</p>
                  </div>
                  {cdc.status === "waitlist" && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 shrink-0">
                      WAITLIST
                    </span>
                  )}
                  {cdc.status === "limited" && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 shrink-0">
                      LIMITED
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  <span className="font-medium text-zinc-700">Rate:</span> {cdc.rate}
                </p>
                <CapacityBar pct={cdc.capacityPct} status={cdc.status} />
                {cdc.waitlist && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {cdc.waitlist} families currently on waitlist
                  </p>
                )}
                <button
                  onClick={() => setWaitlistCdc(cdc.id)}
                  className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: cdc.status === "waitlist" ? "#C8102E" : "#003087" }}
                >
                  {cdc.status === "waitlist" ? "Join Waitlist" : "Check Availability"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* EFMP Info Card */}
        <section>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">
                  Exceptional Family Member Program (EFMP)
                </p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Families with special needs dependents enrolled in EFMP receive priority consideration
                  for childcare placement. EFMP enrollment is required before applying for CDC care if
                  your child has special medical or educational needs.
                </p>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-blue-700">📞 EFMP Coordinator: (760) 725-5819</p>
                  <p className="text-xs text-blue-700">📍 Building 13150, Mainside</p>
                  <p className="text-xs text-blue-700">🕐 Mon–Fri 8:00 AM–4:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tuition Calculator */}
        <section>
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#003087]" />
              <h2 className="text-sm font-bold text-zinc-900">Income-Based Tuition Calculator</h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-zinc-500 mb-3">
                DoD CDC fees are based on Total Family Income (TFI). Select your income tier to see your rate.
              </p>
              <div className="space-y-1">
                {FEE_TIERS.map((tier) => (
                  <button
                    key={tier.tier}
                    onClick={() => setSelectedTier(selectedTier === tier.tier ? null : tier.tier)}
                    className={`w-full text-left rounded-xl px-4 py-2.5 transition-all border ${
                      selectedTier === tier.tier
                        ? "border-[#003087] bg-blue-50"
                        : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-700">
                        Tier {tier.tier} · {tier.income}
                      </span>
                      <div className="flex gap-4 text-xs">
                        <span className="font-bold text-zinc-800">${tier.weekly}/wk</span>
                        <span className="font-bold" style={{ color: "#003087" }}>${tier.monthly}/mo</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {selectedTier && (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs text-[#003087] font-semibold mb-1">Your estimated rate (Tier {selectedTier})</p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-zinc-500">Weekly</p>
                      <p className="text-2xl font-bold" style={{ color: "#003087" }}>
                        ${FEE_TIERS[selectedTier - 1].weekly}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Monthly</p>
                      <p className="text-2xl font-bold" style={{ color: "#003087" }}>
                        ${FEE_TIERS[selectedTier - 1].monthly}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Annual</p>
                      <p className="text-2xl font-bold" style={{ color: "#003087" }}>
                        ${(FEE_TIERS[selectedTier - 1].monthly * 12).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-2">
                    * Rates reflect full-day infant/toddler care. Preschool and school-age rates may vary.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Waitlist Trend */}
        <section>
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold text-zinc-900">Waitlist Trend (8 Weeks)</h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-zinc-500 mb-4">
                Waitlist positions for CDC-1 Mainside and CDC-2 Las Pulgas are updated weekly.
              </p>
              <div className="space-y-3">
                {WAITLIST_HISTORY.map((w, i) => {
                  const maxCdc1 = 210
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="text-zinc-500 w-16">{w.week}</span>
                        <div className="flex gap-4">
                          <span className="text-red-600 font-mono">{w.cdc1} (CDC-1)</span>
                          <span className="text-amber-600 font-mono">{w.cdc2} (CDC-2)</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-red-400 transition-all"
                            style={{ width: `${(w.cdc1 / maxCdc1) * 100}%` }}
                          />
                        </div>
                        <div className="w-24 h-2 rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400 transition-all"
                            style={{ width: `${(w.cdc2 / 55) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-zinc-500 mt-4">
                Estimated wait:{" "}
                <span className="font-bold text-zinc-700">8–14 months</span> for CDC-1 ·{" "}
                <span className="font-bold text-zinc-700">4–6 months</span> for CDC-2
              </p>
            </div>
          </div>
        </section>

        {/* Other Programs */}
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-3">Other Programs</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {otherPrograms.map((p) => (
                <ProgramCard key={p.id} program={p} onBook={() => setBookingProgram(p)} />
              ))}
            </div>
          )}
        </section>

        {/* Special Needs & EFMP Resources */}
        <section id="efmp">
          <h2 className="text-base font-bold text-zinc-900 mb-3">Special Needs & EFMP Resources</h2>
          <div className="space-y-3">
            {EFMP_RESOURCES.map(resource => (
              <div key={resource.title} className="rounded-2xl bg-white shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <resource.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900">{resource.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{resource.description}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1.5">{resource.contact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Modals */}
      <BookingModal
        program={bookingProgram}
        open={bookingProgram !== null}
        onClose={() => setBookingProgram(null)}
      />

      <ChildcareWaitlistForm
        open={waitlistCdc !== null}
        onClose={() => setWaitlistCdc(null)}
        preselectedCDC={waitlistCdc ?? undefined}
      />
    </div>
  )
}
