"use client"

import { useState, useEffect } from "react"
import {
  X, ChevronLeft, ChevronRight, Calendar, MapPin,
  Ticket, Clock, Users, CheckCircle2,
  Film, Plane, Star, Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/hooks/useProfile"

interface EventPricing {
  free: boolean
  adultPrice?: number
  activeDutyPrice?: number
  childPrice?: number
  childFreeUnder?: number
  notes?: string
}

interface MCCSEvent {
  id: string
  title: string
  type: string
  venue: string
  venueId: string
  date: string
  endDate?: string
  time: string
  description: string
  price: EventPricing
  eligibility: string[]
  capacity: number
  registrationRequired: boolean
  registrationOpen: boolean
  spotsRemaining?: number | null
  image: string
  tags: string[]
  featured: boolean
}

type FilterType = "all" | "movie" | "ittt-deal" | "community" | "sport" | "family" | "holiday" | "concert"

const FILTER_LABELS: Record<FilterType, string> = {
  all:        "All Events",
  movie:      "Movies",
  "ittt-deal":"Deals & Tickets",
  community:  "Community",
  sport:      "Sports",
  family:     "Family",
  holiday:    "Holiday",
  concert:    "Concerts",
}

const TYPE_COLORS: Record<string, string> = {
  movie:       "bg-purple-100 text-purple-700",
  "ittt-deal": "bg-blue-100 text-blue-700",
  community:   "bg-zinc-100 text-zinc-600",
  sport:       "bg-emerald-100 text-emerald-700",
  family:      "bg-pink-100 text-pink-700",
  holiday:     "bg-amber-100 text-amber-700",
  concert:     "bg-red-100 text-red-700",
  class:       "bg-indigo-100 text-indigo-700",
}

function PriceDisplay({ price }: { price: EventPricing }) {
  if (price.free) {
    return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">FREE</span>
  }
  return (
    <span className="text-xs text-zinc-600">
      {price.activeDutyPrice
        ? `From $${price.activeDutyPrice} Active Duty · $${price.adultPrice} Adult`
        : `$${price.adultPrice} Adult`}
      {price.childFreeUnder ? ` · Under ${price.childFreeUnder} FREE` : ""}
    </span>
  )
}

function EventDetailView({
  event,
  onBack,
  onRegistered,
}: {
  event: MCCSEvent
  onBack: () => void
  onRegistered: () => void
}) {
  const profile = useProfile()
  const [partySize, setPartySize] = useState(1)
  const [registered, setRegistered] = useState(false)

  function handleRegister() {
    setRegistered(true)
    setTimeout(onRegistered, 1500)
  }

  const dateObj = new Date(event.date + "T12:00:00")
  const dateLabel = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  return (
    <div className="flex flex-col h-full">
      {/* Banner */}
      <div className="relative h-48 shrink-0">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-3 left-3 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-4 right-4">
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", TYPE_COLORS[event.type] ?? "bg-zinc-100 text-zinc-600")}>
            {event.type.toUpperCase().replace("-", " ")}
          </span>
          <h2 className="text-lg font-bold text-white mt-1 leading-snug">{event.title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Meta */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Calendar className="h-4 w-4 text-[#003087]" />
            <span>{dateLabel} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <MapPin className="h-4 w-4 text-[#003087]" />
            <span>{event.venue}</span>
          </div>
          {event.spotsRemaining != null && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Users className="h-4 w-4 text-[#003087]" />
              <span>{event.spotsRemaining} spots remaining</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
          <p className="text-xs font-semibold text-zinc-500 mb-1">Pricing</p>
          {event.price.free ? (
            <p className="text-sm font-bold text-emerald-600">Free — no charge</p>
          ) : (
            <div className="space-y-0.5 text-sm text-zinc-700">
              {event.price.activeDutyPrice != null && (
                <p><span className="font-semibold">Active Duty/Retired:</span> ${event.price.activeDutyPrice}</p>
              )}
              {event.price.adultPrice != null && (
                <p><span className="font-semibold">Adult (12+):</span> ${event.price.adultPrice}</p>
              )}
              {event.price.childPrice != null && (
                <p><span className="font-semibold">Children:</span> ${event.price.childPrice}</p>
              )}
              {event.price.childFreeUnder != null && (
                <p><span className="font-semibold">Under {event.price.childFreeUnder}:</span> FREE</p>
              )}
              {event.price.notes && (
                <p className="text-xs text-zinc-400 mt-1">{event.price.notes}</p>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed">{event.description}</p>

        {/* Eligibility */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">Who can attend</p>
          <div className="flex flex-wrap gap-1">
            {event.eligibility.map(e => (
              <span key={e} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs text-blue-700 font-medium">{e}</span>
            ))}
          </div>
        </div>

        {/* Registration form */}
        {event.registrationRequired && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            {registered ? (
              <div className="flex flex-col items-center py-4 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                <p className="font-bold text-zinc-900">You&apos;re registered!</p>
                <p className="text-xs text-zinc-500 mt-1">A confirmation will be sent to {profile.email}</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-zinc-800">Register for this event</p>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Name</label>
                  <p className="text-sm font-medium text-zinc-900">{profile.rank} {profile.firstName} {profile.lastName}</p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Party Size</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPartySize(p => Math.max(1, p - 1))} className="rounded-full h-8 w-8 border border-zinc-200 flex items-center justify-center text-lg font-bold">-</button>
                    <span className="text-lg font-bold text-zinc-900">{partySize}</span>
                    <button onClick={() => setPartySize(p => Math.min(10, p + 1))} className="rounded-full h-8 w-8 border border-zinc-200 flex items-center justify-center text-lg font-bold">+</button>
                  </div>
                </div>
                <button
                  onClick={handleRegister}
                  className="w-full rounded-xl py-2.5 text-sm font-bold text-white"
                  style={{ backgroundColor: "#C8102E" }}
                >
                  Register — {partySize} {partySize === 1 ? "person" : "people"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Theater section ─────────────────────────────────────────────────────────

function TheaterSection() {
  const PRICING_ROWS = [
    { type: "Adults (12+)",             regular: "$6", threeD: "$7" },
    { type: "Active Duty / Retired",    regular: "$5", threeD: "$6" },
    { type: "Kids (6–11)",              regular: "$3", threeD: "$4" },
    { type: "Kids 5 & Under",           regular: "FREE",threeD:"$1" },
  ]
  const CONCESSIONS = [
    { item: "VIP Combo (2 drinks, lg popcorn, candy)", price: "$14.00" },
    { item: "Matinee Combo (drink, popcorn, candy)",   price: "$11.50" },
    { item: "Kids Combo",                              price: "$6.00" },
  ]
  return (
    <div className="px-4 py-5 space-y-5">
      {/* Hero card */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 flex items-start gap-3">
        <div className="rounded-xl bg-purple-100 p-2.5 shrink-0">
          <Film className="h-6 w-6 text-purple-700" />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900">MCCS Theater — BLDG 1330</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Saturdays 1:30 PM · Doors open 1:00 PM</p>
          <p className="text-xs text-zinc-500">(760) 725-6109</p>
        </div>
      </div>

      {/* Pricing table */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Admission Pricing</p>
        <div className="rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-zinc-600">Ticket Type</th>
                <th className="px-3 py-2.5 text-center font-semibold text-zinc-600">Regular</th>
                <th className="px-3 py-2.5 text-center font-semibold text-zinc-600">3D</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {PRICING_ROWS.map(row => (
                <tr key={row.type}>
                  <td className="px-3 py-2.5 text-zinc-700">{row.type}</td>
                  <td className="px-3 py-2.5 text-center font-semibold text-zinc-900">{row.regular}</td>
                  <td className="px-3 py-2.5 text-center font-semibold text-zinc-900">{row.threeD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Concessions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Concession Combos</p>
        <div className="space-y-2">
          {CONCESSIONS.map(c => (
            <div key={c.item} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2">
              <p className="text-xs text-zinc-700">{c.item}</p>
              <p className="text-xs font-bold text-zinc-900">{c.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
        <p className="text-xs text-amber-700">
          Guests under 17 must be accompanied by someone 18+ for R-rated films.
        </p>
      </div>
    </div>
  )
}

// ── ITT section ─────────────────────────────────────────────────────────────

function ITTSection() {
  return (
    <div className="px-4 py-5 space-y-4">
      {/* ITT card */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="rounded-xl bg-blue-100 p-2.5 shrink-0">
            <Ticket className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">ITT — Information, Tickets & Travel</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Discount tickets to theme parks, shows, cruises, sporting events, and more</p>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-800">Mainside — BLDG 15102</p>
              <p className="text-zinc-500">Mon–Fri 8:30 AM–5:00 PM (closed lunch 1:30–2:30 PM)</p>
              <p className="text-zinc-500">(760) 725-5805</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-800">Pacific Plaza</p>
              <p className="text-zinc-500">Mon–Fri 8:30 AM–5:30 PM</p>
              <p className="text-zinc-500">(760) 763-3183</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
          {["Theme Parks", "Harbor Cruises", "Whale Watching", "Sporting Events", "Dinner Shows", "Skiing", "Island Tours"].map(t => (
            <span key={t} className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700">{t}</span>
          ))}
        </div>
      </div>

      {/* Latitudes Travel card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="rounded-xl bg-emerald-100 p-2.5 shrink-0">
            <Plane className="h-6 w-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900">Latitudes Travel</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Full-service military travel agency — vacations, cruises, airfare, MCRD graduation travel</p>
          </div>
        </div>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-emerald-600" />
            <span className="text-zinc-600">(760) 763-3183 — Pacific Plaza</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-emerald-600" />
            <span className="text-zinc-600">Closed to public Thursdays (Recruit Ticketing)</span>
          </div>
        </div>
      </div>

      {/* American Forces Travel banner */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-900 p-4 flex items-center gap-3">
        <Star className="h-5 w-5 text-amber-400 shrink-0" />
        <div>
          <p className="text-sm font-bold text-white">American Forces Travel</p>
          <p className="text-xs text-zinc-400">Book online at americanforcestravel.com — exclusive military rates on hotels, flights, and vacation packages.</p>
        </div>
      </div>
    </div>
  )
}

// ── Main EventsModal ─────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
}

export default function EventsModal({ open, onClose }: Props) {
  const [events, setEvents] = useState<MCCSEvent[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [selectedEvent, setSelectedEvent] = useState<MCCSEvent | null>(null)
  const [section, setSection] = useState<"events" | "theater" | "itt">("events")

  useEffect(() => {
    if (open) {
      fetch("/api/events")
        .then(r => r.json())
        .then(j => setEvents(j.data))
    }
  }, [open])

  if (!open) return null

  const filtered = filter === "all" ? events : events.filter(e => e.type === filter)

  if (selectedEvent) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <EventDetailView
          event={selectedEvent}
          onBack={() => setSelectedEvent(null)}
          onRegistered={() => setSelectedEvent(null)}
        />
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex flex-col bg-white">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-100 shrink-0" style={{ backgroundColor: "#003087" }}>
          <div className="flex-1">
            <h2 className="text-base font-bold text-white">Events & Entertainment</h2>
            <p className="text-xs text-blue-200">MCCS Camp Pendleton · May 2026 onwards</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white rounded-full p-1 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-zinc-100 bg-zinc-50 shrink-0">
          {[
            { id: "events"  as const, label: "Upcoming Events" },
            { id: "theater" as const, label: "Movies & Theater" },
            { id: "itt"     as const, label: "Deals & Travel" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={cn(
                "flex-1 px-3 py-3 text-xs font-semibold border-b-2 transition-colors",
                section === id
                  ? "border-[#C8102E] text-[#C8102E] bg-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {section === "theater" && <TheaterSection />}
          {section === "itt"     && <ITTSection />}
          {section === "events"  && (
            <>
              {/* Filter chips */}
              <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto">
                {(Object.keys(FILTER_LABELS) as FilterType[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors shrink-0",
                      filter === f
                        ? "bg-[#003087] text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    )}
                  >
                    {FILTER_LABELS[f]}
                  </button>
                ))}
              </div>

              {/* Event list */}
              <div className="px-4 pb-6 space-y-3 pt-1">
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-zinc-400">
                    <Calendar className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No events found</p>
                  </div>
                )}
                {filtered.map(evt => {
                  const dateObj = new Date(evt.date + "T12:00:00")
                  const day   = dateObj.toLocaleDateString("en-US", { day: "2-digit" })
                  const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase()

                  if (evt.featured) {
                    return (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className="w-full text-left rounded-2xl overflow-hidden relative h-44 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", TYPE_COLORS[evt.type] ?? "bg-zinc-100 text-zinc-600")}>
                              {evt.type.toUpperCase().replace("-", " ")}
                            </span>
                            <PriceDisplay price={evt.price} />
                          </div>
                          <p className="font-bold text-white text-sm leading-snug">{evt.title}</p>
                          <p className="text-xs text-white/70 mt-0.5">{evt.venue} · {month} {day}</p>
                        </div>
                      </button>
                    )
                  }

                  return (
                    <button
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full text-left rounded-2xl border border-zinc-200 bg-white p-4 flex items-start gap-4 hover:border-zinc-300 hover:shadow-sm transition-all"
                    >
                      {/* Date block */}
                      <div className="shrink-0 rounded-xl flex flex-col items-center justify-center w-12 py-2" style={{ backgroundColor: "#C8102E" }}>
                        <span className="text-xl font-black text-white leading-none">{day}</span>
                        <span className="text-[9px] font-bold text-red-200 mt-0.5">{month}</span>
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", TYPE_COLORS[evt.type] ?? "bg-zinc-100 text-zinc-600")}>
                            {evt.type.toUpperCase().replace("-", " ")}
                          </span>
                          {evt.registrationRequired && evt.spotsRemaining != null && (
                            <span className="text-[10px] text-amber-600 font-semibold">{evt.spotsRemaining} spots left</span>
                          )}
                        </div>
                        <p className="font-bold text-zinc-900 text-sm leading-snug">{evt.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{evt.venue} · {evt.time}</p>
                        <div className="mt-1.5">
                          <PriceDisplay price={evt.price} />
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-300 shrink-0 mt-1" />
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
