"use client"

import { useEffect, useState } from "react"
import { Trees, Waves, Anchor, Fish, Mountain, Bike, ChevronRight } from "lucide-react"
import BookingModal from "@/components/resident/BookingModal"
import ProgramCard from "@/components/resident/ProgramCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { Program } from "@/types"

const OUTDOOR_FEATURES = [
  {
    id: "del-mar-beach",
    name: "Del Mar Beach & Marina",
    tagline: "Book a Beach Cottage",
    icon: Waves,
    color: "from-cyan-500 to-blue-600",
    badge: "Seasonal",
  },
  {
    id: "lake-oneill",
    name: "Lake O'Neill",
    tagline: "Camping & Fishing",
    icon: Fish,
    color: "from-emerald-500 to-green-700",
    badge: "Open Year-Round",
  },
  {
    id: "marine-memorial-golf",
    name: "Marine Memorial Golf Course",
    tagline: "Book a Tee Time",
    icon: Mountain,
    color: "from-lime-500 to-emerald-600",
    badge: "18 Holes",
  },
  {
    id: "stepp-stables",
    name: "Stepp Stables",
    tagline: "Trail Rides",
    icon: Bike,
    color: "from-amber-500 to-orange-600",
    badge: "Weekend Only",
  },
]

const AQUATICS = [
  {
    id: "13-area-pool",
    name: "13 Area Pool",
    hours: "Mon–Fri 6am–8pm · Sat–Sun 8am–6pm",
    capacityPct: 65,
    alert: "good" as const,
  },
  {
    id: "21-area-pool",
    name: "21 Area Pool",
    hours: "Mon–Sat 6am–7pm · Sun 8am–5pm",
    capacityPct: 78,
    alert: "warning" as const,
  },
]

// Fake program shape for modal
function makeOutdoorProgram(id: string, name: string, tagline: string): Program {
  return {
    id,
    name,
    category: "recreation",
    facility: name,
    description: tagline,
    hours: "See facility for current hours",
    eligibility: ["Active Duty", "Family Members", "Retirees"],
    bookable: true,
    price: null,
    tags: ["recreation", "outdoor"],
  }
}

export default function RecreationPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)

  useEffect(() => {
    fetch("/api/programs?category=recreation")
      .then((r) => r.json())
      .then((d) => setPrograms(d.data as Program[]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{ background: "linear-gradient(135deg, #16a34a 0%, #14532d 100%)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Trees className="h-5 w-5 text-emerald-200" />
          <h1 className="text-xl font-bold text-white">Recreation & Outdoor</h1>
        </div>
        <p className="text-sm text-emerald-200">Beaches, golf, camping, pools & more · Camp Pendleton</p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Featured outdoor experiences */}
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-3">Featured Outdoor Experiences</h2>
          <div className="grid grid-cols-2 gap-3">
            {OUTDOOR_FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <button
                  key={f.id}
                  onClick={() => setBookingProgram(makeOutdoorProgram(f.id, f.name, f.tagline))}
                  className={`relative rounded-2xl bg-gradient-to-br ${f.color} p-4 text-left text-white shadow-sm hover:shadow-md active:scale-95 transition-all`}
                >
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-medium">
                    {f.badge}
                  </span>
                  <Icon className="h-7 w-7 mb-2 opacity-90" strokeWidth={1.75} />
                  <p className="font-bold text-sm leading-snug">{f.name}</p>
                  <p className="text-xs text-white/75 mt-0.5">{f.tagline}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Indoor Recreation */}
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-3">Indoor Recreation</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map((p) => (
                <ProgramCard key={p.id} program={p} onBook={() => setBookingProgram(p)} />
              ))}
            </div>
          )}
        </section>

        {/* Aquatics */}
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-3">Aquatics</h2>
          <div className="space-y-3">
            {AQUATICS.map((pool) => (
              <div key={pool.id} className="rounded-2xl bg-white shadow-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-zinc-900">{pool.name}</h3>
                  <Anchor className="h-4 w-4 text-cyan-500" />
                </div>
                <p className="text-xs text-zinc-500 mb-3">{pool.hours}</p>
                <div className="mb-1 flex justify-between text-xs text-zinc-400">
                  <span>Current Capacity</span>
                  <span
                    className={
                      pool.capacityPct >= 80 ? "font-semibold text-amber-600" : "text-emerald-600"
                    }
                  >
                    {pool.capacityPct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pool.capacityPct >= 80 ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                    style={{ width: `${pool.capacityPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equipment Rental */}
        <section>
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-center">
            <Bike className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
            <h3 className="font-semibold text-zinc-700">Recreation Equipment Rental</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Rent camping gear, kayaks, bikes, surfboards and more
            </p>
            <button
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "#003087" }}
            >
              Browse Equipment
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
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
