"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Dumbbell, Users, Trophy, Waves, Shield, Mountain, MapPin, Target,
  Sun, Anchor, Tent, Flag, Star, Wind,
  UtensilsCrossed, Coffee, Wine, Film, Gamepad2, Ticket, Monitor,
  Baby, BookOpen, Smartphone, Calendar, Heart, GraduationCap,
  Scale, DollarSign, TrendingUp, Truck, MessageCircle,
  ShoppingBag, Package, Wrench, Scissors, Gift, Home as HomeIcon,
  X, ChevronRight, Map as LucideMap, AlertTriangle,
} from "lucide-react"
import SearchBar from "@/components/resident/SearchBar"
import ProgramCard from "@/components/resident/ProgramCard"
import BookingModal from "@/components/resident/BookingModal"
import EventsModal from "@/components/resident/EventsModal"
import BaseMapModal from "@/components/resident/BaseMapModal"
import ChildcareWaitlistForm from "@/components/resident/ChildcareWaitlistForm"
import { isOpenNow } from "@/lib/hours"
import type { Program } from "@/types"

// ── Types ────────────────────────────────────────────────────────────────────

type TileAction = "events" | "map" | "waitlist"

interface TileData {
  icon: React.ElementType
  label: string
  sub: string
  badge?: { text: string; bg: string }
  href?: string
  action?: TileAction
}

interface TileGroup {
  id: string
  title: string
  color: string
  tiles: TileData[]
}

// ── Static Data ───────────────────────────────────────────────────────────────

const BANNERS = [
  {
    id: "memorial-day-hours",
    icon: "⚠️",
    title: "Memorial Day Weekend Hours",
    body: "Some facilities operate on reduced schedules May 24–26. Check each facility page for updated hours.",
    color: "#D97706",
  },
  {
    id: "summer-guide",
    icon: "☀️",
    title: "Summer Recreation Guide Available",
    body: "Pick up your 2026 Summer Guide at any MCCS facility or download it at pendleton.usmc-mccs.org",
    color: "#059669",
  },
  {
    id: "cdc-waitlist-open",
    icon: "🧸",
    title: "CDC Waitlist Open — San Onofre",
    body: "CDC-3 San Onofre is now accepting waitlist applications for Fall 2026. Join early for priority placement.",
    color: "#2563EB",
  },
]

const FEATURED_WEEKEND = [
  {
    id: "theater",
    title: "Mission: Impossible at Base Theater",
    meta: "Sat · May 31 · 1:30 PM",
    price: "From $5",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
    badge: "🎬 Movies",
    color: "#7C3AED",
  },
  {
    id: "bbq",
    title: "Memorial Day BBQ at Del Mar Beach",
    meta: "Mon · May 26 · 11:00 AM",
    price: "FREE Event",
    image: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800",
    badge: "🎉 Holiday",
    color: "#C8102E",
  },
  {
    id: "disneyland",
    title: "Disneyland Military Discount Tickets",
    meta: "Available Year-Round · ITT Office",
    price: "From $89",
    image: "https://images.unsplash.com/photo-1520166012956-add9ba0835cb?w=800",
    badge: "🎡 ITT Deal",
    color: "#059669",
  },
]

const TODAY_FACILITIES = [
  { name: "Mainside Gym",   hours: "Mon–Fri 5:00 AM–10:00 PM · Sat–Sun 7:00 AM–8:00 PM", icon: Dumbbell    },
  { name: "Del Mar Beach",  hours: "Daily 6:00 AM–8:00 PM",                               icon: Sun         },
  { name: "Base Theater",   hours: "Sat 12:00 PM–5:00 PM",                                icon: Film        },
  { name: "MCX Exchange",   hours: "Mon–Sat 9:00 AM–8:00 PM · Sun 10:00 AM–6:00 PM",     icon: ShoppingBag },
  { name: "ITT Office",     hours: "Mon–Fri 8:30 AM–5:00 PM",                             icon: Ticket      },
  { name: "CDC-1 Mainside", hours: "Mon–Fri 5:45 AM–6:30 PM",                             icon: Baby        },
]

const UPCOMING_EVENTS = [
  { id: "movie",     emoji: "🎬", title: "Mission: Impossible at Theater", date: "May 31", price: "From $5",  free: false },
  { id: "5k",        emoji: "🏃", title: "Hard Corps 5K Race",            date: "Jun 8",  price: "$20 AD",   free: false },
  { id: "concert",   emoji: "🎵", title: "Bands on the Beach",            date: "Jun 21", price: "FREE",     free: true  },
  { id: "golf",      emoji: "⛳", title: "Semper Fi Golf Tournament",      date: "Jun 28", price: "$45",      free: false },
  { id: "fireworks", emoji: "🎆", title: "4th of July Fireworks",         date: "Jul 4",  price: "FREE",     free: true  },
]

const TILE_GROUPS: TileGroup[] = [
  {
    id: "fitness",
    title: "Recreation & Fitness",
    color: "#C8102E",
    tiles: [
      { icon: Dumbbell,  label: "Fitness Centers",     sub: "3 locations on base",   href: "/resident/fitness"     },
      { icon: Users,     label: "Group Fitness",        sub: "Yoga · HIIT · Spin",    href: "/resident/fitness"     },
      { icon: Trophy,    label: "Sports Leagues",       sub: "Register your team",    href: "/resident/recreation"  },
      { icon: Waves,     label: "Aquatics & Pool",      sub: "Lap swim · Lessons",    href: "/resident/fitness"     },
      { icon: Shield,    label: "Boxing & Combatives",  sub: "MMA gym · Open daily",  href: "/resident/fitness"     },
      { icon: Mountain,  label: "Rock Climbing Wall",   sub: "All skill levels",      href: "/resident/fitness"     },
      { icon: MapPin,    label: "Running Trails",       sub: "5K & 10K routes",       href: "/resident/recreation"  },
      { icon: Target,    label: "Tennis & Racquet",     sub: "Courts & leagues",      href: "/resident/recreation"  },
    ],
  },
  {
    id: "outdoor",
    title: "Beach & Outdoor",
    color: "#059669",
    tiles: [
      { icon: Sun,    label: "Del Mar Beach Club", sub: "Rentals · Activities",  href: "/resident/recreation", badge: { text: "OPEN", bg: "#059669" } },
      { icon: Anchor, label: "Boat & Water Craft", sub: "Kayaks · Paddleboard",  href: "/resident/recreation" },
      { icon: Wind,   label: "Surfboard Rentals",  sub: "All levels · Daily",    href: "/resident/recreation" },
      { icon: Tent,   label: "Camping & RV Parks", sub: "Hookups available",     href: "/resident/recreation" },
      { icon: Flag,   label: "Golf Course",        sub: "18-hole championship",  href: "/resident/recreation" },
      { icon: Star,   label: "Equestrian Center",  sub: "Lessons · Trail rides", href: "/resident/recreation" },
    ],
  },
  {
    id: "dining",
    title: "Dining & Entertainment",
    color: "#D97706",
    tiles: [
      { icon: UtensilsCrossed, label: "Dining Facilities",   sub: "Mess halls on base",    href: "/resident/dining"        },
      { icon: Coffee,          label: "Café Pendleton",       sub: "Coffee & quick bites",  href: "/resident/dining"        },
      { icon: Wine,            label: "Officer's Club",       sub: "Fine dining & events",  href: "/resident/dining"        },
      { icon: Film,            label: "Movies & Theater",     sub: "Sat 1:30 PM · $5 AD",   action: "events"                },
      { icon: Gamepad2,        label: "Bowling & Arcade",     sub: "Lanes open daily",      href: "/resident/entertainment", badge: { text: "NEW", bg: "#D97706" } },
      { icon: Ticket,          label: "ITT Tickets & Tours",  sub: "Theme parks · Save 30%",action: "events",               badge: { text: "DEALS", bg: "#059669" } },
      { icon: Monitor,         label: "Entertainment Hub",    sub: "Gaming & activities",   href: "/resident/entertainment" },
    ],
  },
  {
    id: "family",
    title: "Child & Family",
    color: "#2563EB",
    tiles: [
      { icon: Baby,          label: "Child Dev. Center",  sub: "CDC-1, 2, 3 on base",    action: "waitlist", badge: { text: "WAITLIST", bg: "#C8102E" } },
      { icon: Users,         label: "Youth Sports",       sub: "Soccer · Baseball",       href: "/resident/childcare" },
      { icon: GraduationCap, label: "School Age Care",    sub: "K–12 after school",       href: "/resident/childcare" },
      { icon: Smartphone,    label: "Teen Programs",      sub: "Ages 13–18",              href: "/resident/recreation" },
      { icon: Calendar,      label: "Family Events",      sub: "Weekend activities",      action: "events" },
      { icon: Heart,         label: "EFMP Resources",     sub: "Special needs support",   href: "/resident/childcare" },
    ],
  },
  {
    id: "services",
    title: "Support & Services",
    color: "#52525B",
    tiles: [
      { icon: Scale,         label: "Legal Services",       sub: "JAG attorneys · Free",  href: "/resident/services" },
      { icon: DollarSign,    label: "Financial Counseling", sub: "PFM advisors on base",  href: "/resident/services" },
      { icon: TrendingUp,    label: "Relocation Assist.",   sub: "PCS moves & housing",   href: "/resident/services" },
      { icon: Truck,         label: "Casualty Assistance",  sub: "CACO · Survivor help",  href: "/resident/services" },
      { icon: MessageCircle, label: "Counseling Services",  sub: "MCFTB · SARC on base",  href: "/resident/services" },
      { icon: BookOpen,      label: "Education Programs",   sub: "Tuition assistance",    href: "/resident/services" },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    color: "#9333EA",
    tiles: [
      { icon: ShoppingBag, label: "MCX Exchange",      sub: "Main store & online",  href: "/resident/shopping" },
      { icon: Package,     label: "Military Clothing", sub: "Uniforms & gear",      href: "/resident/shopping" },
      { icon: Wrench,      label: "Auto Skills Center",sub: "DIY car repair bays",  href: "/resident/shopping" },
      { icon: Scissors,    label: "Barber & Beauty",   sub: "On-base haircuts",     href: "/resident/shopping" },
      { icon: Gift,        label: "Flower & Gift Shop",sub: "Gifts & arrangements", href: "/resident/shopping" },
      { icon: HomeIcon,    label: "Furniture Exchange",sub: "Used furniture deals", href: "/resident/shopping" },
    ],
  },
]

// ── Helper: Tile component ────────────────────────────────────────────────────

interface TileProps extends TileData {
  color: string
  onAction: (action: TileAction) => void
}

function Tile({ icon: Icon, label, sub, badge, href, action, color, onAction }: TileProps) {
  const content = (
    <div className="rounded-xl border border-zinc-100 bg-white p-2.5 w-full h-full flex flex-col gap-1 transition-all hover:border-zinc-200 hover:shadow-sm active:scale-[0.97]" style={{ minHeight: 80 }}>
      <div className="flex items-start gap-1.5">
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        {badge && (
          <span
            className="mt-0.5 text-[7px] font-bold rounded-full px-1.5 py-0.5 leading-tight shrink-0 text-white whitespace-nowrap"
            style={{ backgroundColor: badge.bg }}
          >
            {badge.text}
          </span>
        )}
      </div>
      <p className="text-[11px] font-bold text-zinc-900 leading-snug">{label}</p>
      <p className="text-[9px] text-zinc-400 leading-tight">{sub}</p>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }
  return (
    <button onClick={() => action && onAction(action)} className="block text-left w-full">
      {content}
    </button>
  )
}

// ── Greeting ─────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning, Marine"
  if (h < 17) return "Good afternoon, Marine"
  return "Good evening, Marine"
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ResidentHomePage() {
  const [searchResults, setSearchResults]     = useState<Program[] | null>(null)
  const [bookingProgram, setBookingProgram]   = useState<Program | null>(null)
  const [eventsOpen, setEventsOpen]           = useState(false)
  const [mapOpen, setMapOpen]                 = useState(false)
  const [waitlistOpen, setWaitlistOpen]       = useState(false)
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())

  function handleTileAction(action: TileAction) {
    if (action === "events")   setEventsOpen(true)
    else if (action === "map") setMapOpen(true)
    else if (action === "waitlist") setWaitlistOpen(true)
  }

  function dismissBanner(id: string) {
    setDismissedBanners(prev => new Set([...prev, id]))
  }

  const visibleBanners = BANNERS.filter(b => !dismissedBanners.has(b.id))
  const showResults    = searchResults !== null

  return (
    <div>
      {/* ── Hero ── */}
      <div
        className="relative px-4 pb-16 pt-10"
        style={{ background: "linear-gradient(135deg, #003087 0%, #001a4d 100%)" }}
      >
        <p className="text-sm font-medium text-blue-200 mb-1">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-white leading-tight mb-1">
          MCCS Camp Pendleton
        </h1>
        <p className="text-sm text-blue-200 mb-3">Everything you need, all in one place</p>

        {/* Stat pills */}
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white">
            24 Programs Open
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white">
            4 Events This Weekend
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white">
            ITT Deals Available
          </span>
        </div>

        {/* Search bar — overlaps bottom edge */}
        <div className="absolute left-4 right-4 bottom-0 translate-y-1/2">
          <div className="rounded-2xl bg-white shadow-lg p-3">
            <SearchBar
              onResults={(programs) => setSearchResults(programs)}
              placeholder="Search fitness, dining, childcare…"
            />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mt-14 px-4 space-y-6 pb-10">

        {/* Search results */}
        {showResults && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-700">
                {searchResults.length === 0
                  ? "No results found"
                  : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`}
              </h2>
              <button
                onClick={() => setSearchResults(null)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {searchResults.slice(0, 10).map((p) => (
                <ProgramCard key={p.id} program={p} compact onBook={() => setBookingProgram(p)} />
              ))}
            </div>
          </section>
        )}

        {!showResults && (
          <>
            {/* ── Announcement Banners ── */}
            {visibleBanners.length > 0 && (
              <section className="space-y-2">
                {visibleBanners.map(banner => (
                  <div
                    key={banner.id}
                    className="rounded-2xl border p-3 flex items-start gap-3"
                    style={{ borderColor: `${banner.color}50`, backgroundColor: `${banner.color}0A` }}
                  >
                    <span className="text-base shrink-0 mt-0.5">{banner.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900">{banner.title}</p>
                      <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">{banner.body}</p>
                    </div>
                    <button
                      onClick={() => dismissBanner(banner.id)}
                      className="text-zinc-300 hover:text-zinc-500 shrink-0 mt-0.5"
                      aria-label="Dismiss"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </section>
            )}

            {/* ── Featured This Weekend ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-zinc-900">Featured This Weekend</h2>
                <button
                  onClick={() => setEventsOpen(true)}
                  className="text-xs font-semibold"
                  style={{ color: "#C8102E" }}
                >
                  See all →
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                {FEATURED_WEEKEND.map(card => (
                  <button
                    key={card.id}
                    onClick={() => setEventsOpen(true)}
                    className="relative flex-none w-52 h-36 rounded-2xl overflow-hidden shadow-sm active:scale-[0.97] transition-transform"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <span
                        className="text-[9px] font-bold rounded-full px-2 py-0.5 text-white"
                        style={{ backgroundColor: card.color }}
                      >
                        {card.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-left">
                      <p className="text-[11px] font-bold text-white leading-tight line-clamp-2">{card.title}</p>
                      <p className="text-[9px] text-white/70 mt-0.5">{card.meta}</p>
                      <p className="text-[10px] font-bold text-emerald-300 mt-0.5">{card.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Today on Base ── */}
            <section>
              <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Today on Base
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                {TODAY_FACILITIES.map(fac => {
                  const open = isOpenNow(fac.hours)
                  const Icon = fac.icon
                  return (
                    <div
                      key={fac.name}
                      className="flex-none flex items-center gap-1.5 rounded-full border border-zinc-100 bg-white px-3 py-1.5 shadow-sm"
                    >
                      <Icon className="h-3 w-3 text-zinc-400" />
                      <span className="text-[10px] font-semibold text-zinc-700 whitespace-nowrap">
                        {fac.name}
                      </span>
                      <span
                        className={`text-[8px] font-bold rounded-full px-1.5 py-0.5 whitespace-nowrap ${
                          open
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {open ? "OPEN" : "CLOSED"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* ── Category Tile Groups ── */}
            <div id="categories" className="space-y-7">
              {TILE_GROUPS.map(group => (
                <section key={group.id}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="h-4 w-1 rounded-full shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                    <h2 className="text-sm font-bold text-zinc-900">{group.title}</h2>
                  </div>

                  {/* 3-column tile grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {group.tiles.map(tile => (
                      <Tile
                        key={tile.label}
                        {...tile}
                        color={group.color}
                        onAction={handleTileAction}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* ── Upcoming Events Strip ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-zinc-900">Upcoming Events</h2>
                <button
                  onClick={() => setEventsOpen(true)}
                  className="text-xs font-semibold"
                  style={{ color: "#C8102E" }}
                >
                  View all →
                </button>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                {UPCOMING_EVENTS.map(evt => (
                  <button
                    key={evt.id}
                    onClick={() => setEventsOpen(true)}
                    className="flex-none rounded-2xl bg-white border border-zinc-100 shadow-sm p-3 text-left w-40 hover:border-zinc-200 hover:shadow-md transition-all active:scale-[0.97]"
                  >
                    <span className="text-xl mb-1 block">{evt.emoji}</span>
                    <p className="text-[11px] font-bold text-zinc-900 leading-tight line-clamp-2">{evt.title}</p>
                    <p className="text-[9px] text-zinc-500 mt-1">{evt.date}</p>
                    <p
                      className="text-[10px] font-bold mt-0.5"
                      style={{ color: evt.free ? "#059669" : "#003087" }}
                    >
                      {evt.price}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Map CTA ── */}
            <section>
              <button
                onClick={() => setMapOpen(true)}
                className="w-full rounded-2xl p-5 text-left transition-all hover:opacity-95 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #003087 0%, #001a4d 100%)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-200 mb-0.5">Base Navigation</p>
                    <h3 className="text-lg font-bold text-white">View Base Map</h3>
                    <p className="text-xs text-blue-300 mt-1">25 facilities · Real-time open hours</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <LucideMap className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-300">
                  Open interactive map <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>
            </section>

            {/* ── Footer ── */}
            <footer className="text-center space-y-3 pt-2 pb-2">
              <p className="text-xs text-zinc-400">
                MCCS Camp Pendleton · pendleton.usmc-mccs.org
              </p>
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: "#003087" }}
              >
                Built on Operation StormBreaker
              </div>
              <p className="text-xs text-zinc-400">
                Military/Veterans Crisis Line:{" "}
                <span className="font-semibold">Dial 988</span>
              </p>
            </footer>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      <EventsModal open={eventsOpen} onClose={() => setEventsOpen(false)} />
      <BaseMapModal open={mapOpen}   onClose={() => setMapOpen(false)} />
      <ChildcareWaitlistForm
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        preselectedCDC="cdc-1"
      />
      <BookingModal
        program={bookingProgram}
        open={bookingProgram !== null}
        onClose={() => setBookingProgram(null)}
      />
    </div>
  )
}
