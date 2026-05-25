"use client"

import { useEffect, useState } from "react"
import { UtensilsCrossed, Star, Clock } from "lucide-react"
import BookingModal from "@/components/resident/BookingModal"
import type { Program } from "@/types"

// Today's hours — fake but realistic
const VENUE_HOURS = [
  { name: "Iron Mike's",      open: true,  hours: "Open until 9pm",  id: "iron-mikes" },
  { name: "Pub 1795",         open: true,  hours: "Open until 11pm", id: "pub-1795" },
  { name: "Windmill Canyon",  open: true,  hours: "Open until 10pm", id: "windmill-canyon-gc" },
  { name: "Leatherneck Cafe", open: false, hours: "Closed today",    id: "leatherneck-cafe" },
]

const RESTAURANTS = [
  {
    id: "iron-mikes",
    name: "Iron Mike's",
    description: "Full-service American grill. Burgers, wings, steaks, and daily specials. Family-friendly atmosphere.",
    hours: "Mon–Thu 11am–9pm · Fri–Sat 11am–10pm · Sun 10am–8pm",
    csat: 4.2,
    bookable: true,
    price: null,
  },
  {
    id: "pub-1795",
    name: "Pub 1795",
    description: "Marine Corps tradition since 1775. Craft beers, elevated pub fare, and live entertainment on weekends.",
    hours: "Tue–Sun 4pm–11pm · Closed Mondays",
    csat: 4.4,
    bookable: true,
    price: null,
  },
  {
    id: "windmill-canyon-gc",
    name: "Windmill Canyon Grill",
    description: "Golf course clubhouse restaurant with panoramic views. Breakfast and lunch daily, dinner on weekends.",
    hours: "Daily 7am–3pm · Fri–Sat 5pm–9pm",
    csat: 4.1,
    bookable: true,
    price: null,
  },
]

const PRIVATE_VENUES = [
  { name: "Pacific Views Event Center", cap: "Up to 500 guests", type: "Banquet & Conference" },
  { name: "Eagle's Landing",            cap: "Up to 200 guests", type: "Private Dining" },
  { name: "La Casa Del Mar",            cap: "Up to 150 guests", type: "Beachside Venue" },
  { name: "The Vineyard",               cap: "Up to 80 guests",  type: "Intimate Events" },
  { name: "San Onofre Beach Club",      cap: "Up to 120 guests", type: "Outdoor Events" },
]

const FAST_FOOD = [
  { name: "McDonald's (Main Exchange)",     hours: "Daily 6am–10pm" },
  { name: "Subway (Commissary)",            hours: "Mon–Sat 7am–8pm" },
  { name: "Pizza Hut (Las Pulgas)",         hours: "Daily 11am–9pm" },
  { name: "Starbucks (Paige Field House)",  hours: "Mon–Fri 5:30am–7pm" },
]

// We need a fake Program shape for BookingModal
function makeRestaurantProgram(r: typeof RESTAURANTS[number]): Program {
  return {
    id: r.id,
    name: r.name,
    category: "dining",
    facility: r.name,
    description: r.description,
    hours: r.hours,
    eligibility: ["Active Duty", "Family Members", "Retirees", "Civilians"],
    bookable: true,
    price: null,
    tags: ["dining", "restaurant"],
  }
}

export default function DiningPage() {
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)

  // Suppress unused warning — programs loaded if needed later
  const [, setPrograms] = useState<Program[]>([])
  useEffect(() => {
    fetch("/api/programs?category=dining")
      .then((r) => r.json())
      .then((d) => setPrograms(d.data))
      .catch(() => {})
  }, [])

  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{ background: "linear-gradient(135deg, #d97706 0%, #92400e 100%)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <UtensilsCrossed className="h-5 w-5 text-amber-200" />
          <h1 className="text-xl font-bold text-white">Dining & Entertainment</h1>
        </div>
        <p className="text-sm text-amber-200">Restaurants, events & food on base · Camp Pendleton</p>
      </div>

      {/* Today's hours strip */}
      <div className="bg-white border-b border-zinc-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Today&apos;s Hours</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {VENUE_HOURS.map((v) => (
            <div
              key={v.id}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-1.5"
            >
              <span
                className={`h-2 w-2 rounded-full ${v.open ? "bg-emerald-500" : "bg-zinc-300"}`}
              />
              <div>
                <p className="text-xs font-semibold text-zinc-800 whitespace-nowrap">{v.name}</p>
                <p className={`text-[10px] ${v.open ? "text-emerald-600" : "text-zinc-400"}`}>{v.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Restaurants */}
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-3">Restaurants</h2>
          <div className="space-y-3">
            {RESTAURANTS.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white shadow-sm p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-zinc-900 text-base">{r.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-zinc-700">{r.csat}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">{r.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>{r.hours}</span>
                </div>
                <button
                  onClick={() => setBookingProgram(makeRestaurantProgram(r))}
                  className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#C8102E" }}
                >
                  Make Reservation
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Private Events */}
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-3">Private Event Spaces</h2>
          <div className="space-y-2">
            {PRIVATE_VENUES.map((v) => (
              <div key={v.name} className="flex items-center justify-between rounded-xl bg-white shadow-sm p-4">
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">{v.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{v.type} · {v.cap}</p>
                </div>
                <button
                  className="shrink-0 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-50"
                  style={{ color: "#003087", borderColor: "#003087" }}
                >
                  Request Space →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Fast Food */}
        <section>
          <h2 className="text-base font-bold text-zinc-900 mb-3">Fast Food & Coffee</h2>
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {FAST_FOOD.map((f, i) => (
              <div
                key={f.name}
                className={`flex items-center justify-between px-4 py-3 ${i < FAST_FOOD.length - 1 ? "border-b border-zinc-50" : ""}`}
              >
                <p className="text-sm font-medium text-zinc-800">{f.name}</p>
                <p className="text-xs text-zinc-400">{f.hours}</p>
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
