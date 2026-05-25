"use client"

import { useEffect, useState } from "react"
import { Baby, AlertTriangle } from "lucide-react"
import ProgramCard from "@/components/resident/ProgramCard"
import BookingModal from "@/components/resident/BookingModal"
import { Skeleton } from "@/components/ui/skeleton"
import type { Program } from "@/types"

const CDC_CENTERS = [
  {
    id: "cdc-1-mainside",
    name: "CDC-1 Mainside",
    area: "Mainside",
    capacityPct: 100,
    waitlist: 187,
    status: "waitlist" as const,
    rate: "$180–$250/week based on income",
  },
  {
    id: "cdc-2-las-pulgas",
    name: "CDC-2 Las Pulgas",
    area: "Las Pulgas",
    capacityPct: 100,
    waitlist: 43,
    status: "waitlist" as const,
    rate: "$180–$250/week based on income",
  },
  {
    id: "cdc-3-san-onofre",
    name: "CDC-3 San Onofre",
    area: "San Onofre",
    capacityPct: 82,
    waitlist: null,
    status: "limited" as const,
    rate: "$180–$250/week based on income",
  },
]

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

export default function ChildcarePage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)

  useEffect(() => {
    fetch("/api/programs?category=childcare")
      .then((r) => r.json())
      .then((d) => setPrograms(d.data as Program[]))
      .finally(() => setLoading(false))
  }, [])

  // Exclude CDC entries from "other programs" (they're shown separately above)
  const otherPrograms = programs.filter(
    (p) => !p.id.startsWith("cdc-") && !p.id.startsWith("child-development")
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

      {/* Critical notice banner */}
      <div className="mx-4 mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">High Demand: CDC Waitlists Active</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Childcare demand exceeds current capacity. Register early and join a waitlist to be notified of openings.
            </p>
            <a
              href="#cdc-section"
              className="mt-1.5 inline-block text-xs font-semibold underline"
              style={{ color: "#C8102E" }}
            >
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
                  className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: cdc.status === "waitlist" ? "#C8102E" : "#003087" }}
                >
                  {cdc.status === "waitlist" ? "Join Waitlist" : "Check Availability"}
                </button>
              </div>
            ))}
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
              {otherPrograms.length === 0 && programs.length > 0 && (
                // Fallback: show all non-CDC programs from API
                programs
                  .filter((p) => !CDC_CENTERS.find((c) => c.id === p.id))
                  .map((p) => (
                    <ProgramCard key={p.id} program={p} onBook={() => setBookingProgram(p)} />
                  ))
              )}
            </div>
          )}
        </section>
      </div>

      <BookingModal
        program={bookingProgram}
        open={bookingProgram !== null}
        onClose={() => setBookingProgram(null)}
      />
    </div>
  )
}
