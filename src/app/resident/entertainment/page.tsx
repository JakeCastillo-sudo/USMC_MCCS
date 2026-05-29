"use client"

import { useState } from "react"
import {
  Film, Ticket, MapPin, Phone, Clock, ExternalLink,
  Star, DollarSign, Users, Info
} from "lucide-react"

// ── Theater Data ──────────────────────────────────────────────────────────────
const TICKET_PRICES = [
  { category: "Adult",         regular: 6, threeDee: 7  },
  { category: "Active Duty",   regular: 5, threeDee: 6  },
  { category: "Child (3–11)",  regular: 3, threeDee: 4  },
  { category: "Under 3",       regular: 0, threeDee: 1  },
]

const UPCOMING_MOVIES = [
  {
    title: "Mission: Impossible — The Final Reckoning",
    date: "Saturday, May 31, 2026",
    time: "1:30 PM",
    genre: "Action / Thriller",
    rating: "PG-13",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
    note: "Doors open at 1:00 PM",
  },
  {
    title: "Family Night — Animated Feature",
    date: "Saturday, June 7, 2026",
    time: "1:30 PM",
    genre: "Animation / Family",
    rating: "G",
    image: "https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?w=800",
    note: "Great for kids of all ages",
  },
]

const CONCESSIONS = [
  { name: "VIP Combo",     price: "$14.00", items: "Large popcorn, 2 drinks, candy" },
  { name: "Matinee Combo", price: "$11.50", items: "Medium popcorn, drink" },
  { name: "Kids Combo",    price: "$6.00",  items: "Small popcorn, juice box, mini candy" },
]

// ── ITT Data ──────────────────────────────────────────────────────────────────
const ITT_DEALS = [
  {
    id: "disneyland",
    emoji: "🏰",
    title: "Disneyland Resort",
    subtitle: "Single Park & Park Hopper",
    price: "From $89",
    savings: "Save $30+",
    image: "https://images.unsplash.com/photo-1520166012956-add9ba0835cb?w=800",
    color: "#7C3AED",
  },
  {
    id: "zoo",
    emoji: "🦁",
    title: "San Diego Zoo & Safari Park",
    subtitle: "Zoo, Safari Park & Combo",
    price: "From $42",
    savings: "Save $20+",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800",
    color: "#059669",
  },
  {
    id: "knotts",
    emoji: "🎢",
    title: "Knott's Berry Farm",
    subtitle: "Park & Soak City options",
    price: "From $49",
    savings: "Save 30%",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
    color: "#D97706",
  },
  {
    id: "seaworld",
    emoji: "🐬",
    title: "SeaWorld San Diego",
    subtitle: "Day passes · Aquatica combo",
    price: "From $44",
    savings: "Up to 35% off",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    color: "#2563EB",
  },
  {
    id: "legoland",
    emoji: "🧱",
    title: "LEGOLAND California",
    subtitle: "Park + Sea Life Aquarium",
    price: "From $52",
    savings: "Save $25+",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    color: "#C8102E",
  },
  {
    id: "universal",
    emoji: "🎬",
    title: "Universal Studios Hollywood",
    subtitle: "General & front-of-line",
    price: "From $79",
    savings: "Save $30+",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
    color: "#52525B",
  },
]

const ITT_OFFICES = [
  {
    name: "ITT Mainside",
    address: "Building 13292, Mainside",
    phone: "(760) 725-5805",
    hours: "Mon–Fri 8:30 AM–5:00 PM\nClosed 1:30–2:30 PM (lunch)\nClosed weekends & federal holidays",
  },
  {
    name: "ITT Pacific Plaza",
    address: "Pacific Plaza Shopping Center",
    phone: "(760) 763-3183",
    hours: "Mon–Fri 8:30 AM–5:30 PM\nOpen through lunch\nClosed weekends & federal holidays",
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = "theater" | "deals"

export default function EntertainmentPage() {
  const [tab, setTab] = useState<Tab>("theater")

  return (
    <div className="pb-4">
      {/* Header */}
      <div
        className="px-4 pt-6 pb-5"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Film className="h-5 w-5 text-purple-200" />
          <h1 className="text-xl font-bold text-white">Movies & Entertainment</h1>
        </div>
        <p className="text-sm text-purple-200">Theater · ITT Deals · Travel · Activities</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-200 bg-white sticky top-16 z-10">
        <button
          onClick={() => setTab("theater")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === "theater"
              ? "border-b-2 text-[#7C3AED]"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
          style={tab === "theater" ? { borderColor: "#7C3AED" } : {}}
        >
          🎬 Movies & Theater
        </button>
        <button
          onClick={() => setTab("deals")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === "deals"
              ? "border-b-2 text-[#7C3AED]"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
          style={tab === "deals" ? { borderColor: "#7C3AED" } : {}}
        >
          🎡 Tickets & Travel
        </button>
      </div>

      {/* ── THEATER TAB ── */}
      {tab === "theater" && (
        <div className="px-4 py-5 space-y-5">

          {/* Theater Info Card */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100" style={{ backgroundColor: "#7C3AED12" }}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <Film className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-zinc-900">MCCS Theater</h2>
                  <p className="text-xs text-zinc-500">Building 1330 · Mainside · Camp Pendleton</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>Saturdays 1:30 PM (doors open 1:00 PM)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>(760) 725-6109</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Users className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>Capacity: 220 seats · Concessions available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Info className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>No registration required · Walk-ins welcome</span>
              </div>
            </div>
          </div>

          {/* Upcoming Showtimes */}
          <section>
            <h2 className="text-base font-bold text-zinc-900 mb-3">Upcoming Showtimes</h2>
            <div className="space-y-3">
              {UPCOMING_MOVIES.map((movie) => (
                <div key={movie.title} className="rounded-2xl bg-white shadow-sm overflow-hidden">
                  <div className="relative h-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold rounded-full bg-white/20 px-2 py-0.5 text-white backdrop-blur-sm">
                          {movie.rating}
                        </span>
                        <span className="text-[10px] text-white/70">{movie.genre}</span>
                      </div>
                      <p className="text-sm font-bold text-white leading-tight">{movie.title}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">{movie.date}</p>
                        <p className="text-xs text-zinc-500">{movie.time} · BLDG 1330</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-400">{movie.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ticket Prices */}
          <section>
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <h2 className="text-sm font-bold text-zinc-900">Ticket Prices</h2>
              </div>
              <div className="p-4">
                <div className="rounded-xl overflow-hidden border border-zinc-100">
                  {/* Header */}
                  <div className="grid grid-cols-3 bg-zinc-50 px-4 py-2.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Category</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide text-center">2D/Regular</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide text-center">3D</span>
                  </div>
                  {TICKET_PRICES.map((row, i) => (
                    <div
                      key={row.category}
                      className={`grid grid-cols-3 px-4 py-3 ${i !== TICKET_PRICES.length - 1 ? "border-b border-zinc-100" : ""}`}
                    >
                      <span className="text-xs font-medium text-zinc-700">{row.category}</span>
                      <span className="text-xs font-bold text-zinc-900 text-center">
                        {row.regular === 0 ? "FREE" : `$${row.regular}.00`}
                      </span>
                      <span className="text-xs font-bold text-center" style={{ color: "#7C3AED" }}>
                        {row.threeDee === 0 ? "FREE" : `$${row.threeDee}.00`}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 text-center">
                  Children under 3 attend FREE · Cash & MCCS Pay accepted
                </p>
              </div>
            </div>
          </section>

          {/* Concessions */}
          <section>
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-zinc-900">🍿 Concession Combos</h2>
              </div>
              <div className="divide-y divide-zinc-100">
                {CONCESSIONS.map((item) => (
                  <div key={item.name} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.items}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: "#7C3AED" }}>{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Star Rating Info */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <p className="text-xs text-purple-700 leading-relaxed">
                <span className="font-bold">No pre-registration required.</span> Just show up with your military ID.
                Active duty and their dependents get the best military rates. Films subject to change — check with
                the theater at <span className="font-semibold">(760) 725-6109</span> for confirmed showings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── DEALS TAB ── */}
      {tab === "deals" && (
        <div className="px-4 py-5 space-y-5">

          {/* ITT Office Info */}
          <section>
            <h2 className="text-base font-bold text-zinc-900 mb-3">ITT Office Locations</h2>
            <div className="space-y-3">
              {ITT_OFFICES.map((office) => (
                <div key={office.name} className="rounded-2xl bg-white shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Ticket className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-900 text-sm">{office.name}</p>
                      <div className="mt-1.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                          <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
                          {office.address}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                          <Phone className="h-3 w-3 text-zinc-400 shrink-0" />
                          {office.phone}
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-zinc-600">
                          <Clock className="h-3 w-3 text-zinc-400 shrink-0 mt-0.5" />
                          <span className="whitespace-pre-line">{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ticket Deals Grid */}
          <section>
            <h2 className="text-base font-bold text-zinc-900 mb-3">Military Discount Tickets</h2>
            <div className="grid grid-cols-2 gap-3">
              {ITT_DEALS.map((deal) => (
                <div key={deal.id} className="rounded-2xl bg-white shadow-sm overflow-hidden border border-zinc-100">
                  <div className="relative h-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span
                        className="text-[9px] font-bold rounded-full px-2 py-0.5 text-white"
                        style={{ backgroundColor: deal.color }}
                      >
                        {deal.savings}
                      </span>
                    </div>
                    <span className="absolute bottom-2 left-2 text-xl">{deal.emoji}</span>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-[11px] font-bold text-zinc-900 leading-tight">{deal.title}</p>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{deal.subtitle}</p>
                    <p className="text-sm font-bold mt-1.5" style={{ color: deal.color }}>{deal.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-3 text-center">
              Visit either ITT office with your military ID to purchase. Prices subject to change.
            </p>
          </section>

          {/* Latitudes Travel */}
          <section>
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-zinc-900">✈️ Latitudes Travel</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Full-service travel agency at the ITT Mainside office</p>
              </div>
              <div className="px-5 py-4 space-y-2">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Latitudes Travel offers military travel discounts on flights, hotels, cruises, vacation packages,
                  and car rentals. Personalized service from agents who understand military schedules and PCS needs.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {["Cruises", "Vacation Packages", "Flights", "Hotel Stays", "Car Rentals", "Resorts"].map(service => (
                    <div key={service} className="flex items-center gap-1.5 text-xs text-zinc-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* American Forces Travel */}
          <section>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-blue-900 text-sm">American Forces Travel</p>
                  <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                    Book hotels, flights, and rental cars directly online at exclusive military rates —
                    available 24/7 at <span className="font-semibold">americanforcestravel.com</span>
                  </p>
                  <a
                    href="https://americanforcestravel.com"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold underline"
                    style={{ color: "#003087" }}
                  >
                    Visit americanforcestravel.com <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  )
}
