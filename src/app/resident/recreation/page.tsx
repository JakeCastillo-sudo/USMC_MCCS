"use client"

import { useEffect, useState } from "react"
import { Waves, Anchor, Fish, Mountain, Bike, ChevronRight, Flag, Home } from "lucide-react"
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

// Tee times for next 7 days
const TEE_TIMES = [
  { day: "Mon 5/25", slots: ["6:00 AM", "7:30 AM", "9:00 AM", "1:00 PM"], available: [true, true, false, true] },
  { day: "Tue 5/26", slots: ["6:30 AM", "8:00 AM", "10:30 AM"], available: [false, true, true] },
  { day: "Wed 5/27", slots: ["7:00 AM", "9:00 AM", "11:00 AM", "2:00 PM"], available: [true, true, true, false] },
  { day: "Thu 5/28", slots: ["6:00 AM", "7:30 AM", "12:00 PM"], available: [true, false, true] },
  { day: "Fri 5/29", slots: ["6:30 AM", "9:00 AM", "1:30 PM"], available: [true, true, true] },
  { day: "Sat 5/30", slots: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"], available: [false, false, true, true] },
  { day: "Sun 5/31", slots: ["7:00 AM", "8:30 AM", "10:00 AM"], available: [false, true, true] },
]

// Beach cottage calendar (30 days)
const today = new Date(2026, 4, 25) // May 25, 2026
const COTTAGE_CALENDAR = Array.from({ length: 35 }, (_, i) => {
  const d = new Date(today)
  d.setDate(d.getDate() + i - today.getDay())
  const isWeekend = d.getDay() === 0 || d.getDay() === 6
  const isPast = d < today
  const status = isPast ? "past" : isWeekend && i < 14 ? "booked" : i === 6 || i === 13 ? "limited" : "available"
  return { date: d, status }
})

const EQUIPMENT_CATEGORIES = [
  { name: "Surfboards", icon: "🏄", items: ["6'8\" Shortboard", "9'0\" Longboard", "7'6\" Funboard"], pricePerDay: 15 },
  { name: "Kayaks", icon: "🛶", items: ["Single Kayak", "Tandem Kayak", "Sea Kayak"], pricePerDay: 25 },
  { name: "Camping Gear", icon: "⛺", items: ["4-person Tent", "Sleeping Bags", "Camp Stove"], pricePerDay: 20 },
  { name: "Stand-Up Paddle", icon: "🏊", items: ["SUP Board + Paddle", "iSUP Inflatable"], pricePerDay: 30 },
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
      {/* ── Hero banner (split — left beach / right golf) ── */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(140px, 35vw, 280px)" }}>
        {/* Left half — beach */}
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
            alt="Del Mar Beach"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Right half — golf */}
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80"
            alt="Golf Course"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Unified dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(12,35,64,0.4) 0%, rgba(12,35,64,0.88) 100%)" }}
        />
        {/* Center divider */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
        {/* Text — centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 md:pb-8 px-6">
          <p className="usmc-label text-[10px] md:text-xs mb-1 md:mb-2 text-center">Recreation &amp; Outdoor</p>
          <h1 className="text-xl md:text-4xl font-black text-white tracking-tight text-center mb-0.5 md:mb-1">
            Beaches, Golf &amp; Beyond
          </h1>
          <p className="hidden md:block text-sm text-white/65 text-center">Camping, pools, equipment rental · Camp Pendleton</p>
        </div>
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

        {/* Tee Time Availability */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Flag className="h-4 w-4 text-emerald-600" />
            <h2 className="text-base font-bold text-zinc-900">Golf Tee Times — Next 7 Days</h2>
          </div>
          <div className="space-y-2">
            {TEE_TIMES.map((day) => (
              <div key={day.day} className="rounded-xl bg-white shadow-sm p-4">
                <p className="text-xs font-semibold text-zinc-500 mb-2">{day.day}</p>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot, i) => (
                    <button
                      key={slot}
                      disabled={!day.available[i]}
                      onClick={() => setBookingProgram(makeOutdoorProgram("marine-memorial-golf", "Marine Memorial Golf Course", `Tee time: ${slot}`))}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        day.available[i]
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-zinc-100 text-zinc-400 cursor-not-allowed line-through"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Beach Cottage Calendar */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Home className="h-4 w-4 text-cyan-600" />
            <h2 className="text-base font-bold text-zinc-900">Del Mar Beach Cottages — May/Jun</h2>
          </div>
          <div className="rounded-2xl bg-white shadow-sm p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-zinc-400 py-1">{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {COTTAGE_CALENDAR.map((entry, i) => {
                const isPast = entry.status === "past"
                const isBooked = entry.status === "booked"
                const isLimited = entry.status === "limited"
                return (
                  <button
                    key={i}
                    disabled={isPast || isBooked}
                    onClick={() => !isPast && !isBooked && setBookingProgram(makeOutdoorProgram("del-mar-cottages", "Del Mar Beach Cottages", `Check-in: ${entry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`))}
                    className={`rounded text-center py-1.5 text-xs font-medium transition-all ${
                      isPast ? "text-zinc-300 cursor-default" :
                      isBooked ? "bg-red-100 text-red-400 cursor-not-allowed" :
                      isLimited ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
                      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {entry.date.getDate()}
                  </button>
                )
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 justify-center">
              {[
                { color: "bg-emerald-100", label: "Available" },
                { color: "bg-amber-100", label: "Limited" },
                { color: "bg-red-100", label: "Booked" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`h-3 w-3 rounded ${color}`} />
                  <span className="text-[10px] text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Rental */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Bike className="h-4 w-4 text-orange-600" />
            <h2 className="text-base font-bold text-zinc-900">Equipment Rental</h2>
          </div>
          <div className="space-y-3">
            {EQUIPMENT_CATEGORIES.map((cat) => (
              <div key={cat.name} className="rounded-2xl bg-white shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-semibold text-zinc-900 text-sm">{cat.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400">from ${cat.pricePerDay}/day</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cat.items.map((item) => (
                    <span key={item} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                      {item}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setBookingProgram(makeOutdoorProgram("outdoor-adventures", "Outdoor Adventures Equipment Rental", cat.name))}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: "#003087" }}
                >
                  Reserve Equipment
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
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
