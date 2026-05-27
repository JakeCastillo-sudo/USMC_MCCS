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
  X, ChevronRight, Map as LucideMap, Megaphone,
  Phone, Shield as ShieldIcon,
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
  imageUrl: string
}

interface TileGroup {
  id: string
  title: string
  color: string
  tiles: TileData[]
}

// ── Image-backed Tile component ───────────────────────────────────────────────

interface TileProps extends TileData {
  onAction: (a: TileAction) => void
}

function Tile({ label, sub, badge, href, action, imageUrl, onAction }: TileProps) {
  const content = (
    <div className="tile-hover relative overflow-hidden h-40 sm:h-44 lg:h-48">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340] via-[#0C2340]/45 to-transparent" />
      {badge && (
        <span
          className="absolute top-2 right-2 z-10 text-[8px] font-black uppercase tracking-wider rounded-sm px-1.5 py-0.5 text-white"
          style={{ backgroundColor: badge.bg }}
        >
          {badge.text}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
        <p className="text-white font-black text-xs leading-tight">{label}</p>
        <p className="text-white/55 text-[9px] mt-0.5 leading-tight">{sub}</p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block rounded-sm overflow-hidden">{content}</Link>
  }
  return (
    <button onClick={() => action && onAction(action)} className="block text-left w-full rounded-sm overflow-hidden">
      {content}
    </button>
  )
}

// ── Static Data ───────────────────────────────────────────────────────────────

const U = "https://images.unsplash.com/photo-"

const TILE_GROUPS: TileGroup[] = [
  {
    id: "fitness",
    title: "Recreation & Fitness",
    color: "#C8102E",
    tiles: [
      { icon: Dumbbell,  label: "Fitness Centers",    sub: "3 locations on base",   href: "/resident/fitness",      imageUrl: `${U}1534438327276-14e5300c3a48?w=600` },
      { icon: Users,     label: "Group Fitness",       sub: "Yoga · HIIT · Spin",    href: "/resident/fitness",      imageUrl: `${U}1518611012118-696072aa579a?w=600` },
      { icon: Trophy,    label: "Sports Leagues",      sub: "Register your team",    href: "/resident/recreation",   imageUrl: `${U}1461896836934-ffe607ba8211?w=600` },
      { icon: Waves,     label: "Aquatics & Pool",     sub: "Lap swim · Lessons",    href: "/resident/fitness",      imageUrl: `${U}1571902943202-507ec2618e8f?w=600` },
      { icon: Shield,    label: "Boxing & Combatives", sub: "MMA gym · Open daily",  href: "/resident/fitness",      imageUrl: `${U}1595590424283-b8f17842773f?w=600` },
      { icon: Mountain,  label: "Rock Climbing Wall",  sub: "All skill levels",      href: "/resident/fitness",      imageUrl: `${U}1551632811-561732d1e306?w=600` },
      { icon: MapPin,    label: "Running Trails",      sub: "5K & 10K routes",       href: "/resident/recreation",   imageUrl: `${U}1551632811-561732d1e306?w=600` },
      { icon: Target,    label: "Tennis & Racquet",    sub: "Courts & leagues",      href: "/resident/recreation",   imageUrl: `${U}1593548956842-8e7edd9f01a1?w=600` },
    ],
  },
  {
    id: "outdoor",
    title: "Beach & Outdoor",
    color: "#059669",
    tiles: [
      { icon: Sun,    label: "Del Mar Beach Club", sub: "Rentals · Activities", href: "/resident/recreation", imageUrl: `${U}1507525428034-b723cf961d3e?w=600`, badge: { text: "OPEN", bg: "#059669" } },
      { icon: Anchor, label: "Boat & Water Craft", sub: "Kayaks · Paddleboard",  href: "/resident/recreation", imageUrl: `${U}1473116763249-2faaef81ccda?w=600` },
      { icon: Wind,   label: "Surfboard Rentals",  sub: "All levels · Daily",   href: "/resident/recreation", imageUrl: `${U}1507525428034-b723cf961d3e?w=600` },
      { icon: Tent,   label: "Camping & RV Parks", sub: "Hookups available",    href: "/resident/recreation", imageUrl: `${U}1504280390367-361c6d9f38f4?w=600` },
      { icon: Flag,   label: "Golf Course",         sub: "18-hole championship", href: "/resident/recreation", imageUrl: `${U}1535131749006-b7f58c99034b?w=600` },
      { icon: Star,   label: "Equestrian Center",   sub: "Lessons · Trail rides",href: "/resident/recreation", imageUrl: `${U}1553284965-5dd3b8dbdfe8?w=600` },
    ],
  },
  {
    id: "dining",
    title: "Dining & Entertainment",
    color: "#D97706",
    tiles: [
      { icon: UtensilsCrossed, label: "Dining Facilities",  sub: "Mess halls on base",    href: "/resident/dining",       imageUrl: `${U}1414235077428-338989a2e8c0?w=600` },
      { icon: Coffee,          label: "Café Pendleton",     sub: "Coffee & quick bites",  href: "/resident/dining",       imageUrl: `${U}1414235077428-338989a2e8c0?w=600` },
      { icon: Wine,            label: "Officer's Club",     sub: "Fine dining & events",  href: "/resident/dining",       imageUrl: `${U}1470337458703-46ad1756a187?w=600` },
      { icon: Film,            label: "Movies & Theater",   sub: "Sat 1:30 PM · $5 AD",   action: "events",               imageUrl: `${U}1489599849927-2ee91cede3ba?w=600` },
      { icon: Gamepad2,        label: "Bowling & Arcade",   sub: "Lanes open daily",      href: "/resident/entertainment",imageUrl: `${U}1593548956842-8e7edd9f01a1?w=600`, badge: { text: "NEW", bg: "#D97706" } },
      { icon: Ticket,          label: "ITT Tickets",        sub: "Theme parks · Save 30%", action: "events",              imageUrl: `${U}1436491865332-7a61a109cc05?w=600`, badge: { text: "DEALS", bg: "#059669" } },
      { icon: Monitor,         label: "Entertainment Hub",  sub: "Gaming · Activities",   href: "/resident/entertainment",imageUrl: `${U}1565123409695-7b5ef63a2efb?w=600` },
    ],
  },
  {
    id: "family",
    title: "Child & Family",
    color: "#2563EB",
    tiles: [
      { icon: Baby,          label: "Child Dev. Center", sub: "CDC-1, 2, 3 on base",  action: "waitlist", imageUrl: `${U}1587654780291-39c9404d746b?w=600`, badge: { text: "WAITLIST", bg: "#C8102E" } },
      { icon: Users,         label: "Youth Sports",      sub: "Soccer · Baseball",    href: "/resident/childcare",    imageUrl: `${U}1529156069898-49953e39b3ac?w=600` },
      { icon: GraduationCap, label: "School Age Care",   sub: "K–12 after school",    href: "/resident/childcare",    imageUrl: `${U}1523240795612-9a054b0db644?w=600` },
      { icon: Smartphone,    label: "Teen Programs",     sub: "Ages 13–18",           href: "/resident/recreation",   imageUrl: `${U}1529156069898-49953e39b3ac?w=600` },
      { icon: Calendar,      label: "Family Events",     sub: "Weekend activities",   action: "events",               imageUrl: `${U}1511795409834-ef04bbd61622?w=600` },
      { icon: Heart,         label: "EFMP Resources",    sub: "Special needs support",href: "/resident/childcare",    imageUrl: `${U}1492725764893-90b379c2b6e7?w=600` },
    ],
  },
  {
    id: "services",
    title: "Support & Services",
    color: "#52525B",
    tiles: [
      { icon: Scale,         label: "Legal Services",      sub: "JAG attorneys · Free",  href: "/resident/services", imageUrl: `${U}1481627834876-b7833e8f5570?w=600` },
      { icon: DollarSign,    label: "Financial Counseling",sub: "PFM advisors on base",  href: "/resident/services", imageUrl: `${U}1554224155-6726b3ff858f?w=600` },
      { icon: TrendingUp,    label: "Relocation Assist.",  sub: "PCS moves & housing",   href: "/resident/services", imageUrl: `${U}1436491865332-7a61a109cc05?w=600` },
      { icon: Truck,         label: "Casualty Assistance", sub: "CACO · Survivor help",  href: "/resident/services", imageUrl: `${U}1521737711867-e3b97375f902?w=600` },
      { icon: MessageCircle, label: "Counseling Services", sub: "MCFTB · SARC on base",  href: "/resident/services", imageUrl: `${U}1521737711867-e3b97375f902?w=600` },
      { icon: BookOpen,      label: "Education Programs",  sub: "Tuition assistance",    href: "/resident/services", imageUrl: `${U}1523240795612-9a054b0db644?w=600` },
    ],
  },
  {
    id: "shopping",
    title: "Shopping",
    color: "#9333EA",
    tiles: [
      { icon: ShoppingBag, label: "MCX Exchange",      sub: "Main store & online", href: "/resident/shopping", imageUrl: `${U}1441986300917-64674bd600d8?w=600` },
      { icon: Package,     label: "Military Clothing", sub: "Uniforms & gear",     href: "/resident/shopping", imageUrl: `${U}1441986300917-64674bd600d8?w=600` },
      { icon: Wrench,      label: "Auto Skills Center",sub: "DIY car repair bays", href: "/resident/shopping", imageUrl: `${U}1487754180451-c456f719a1fc?w=600` },
      { icon: Scissors,    label: "Barber & Beauty",   sub: "On-base haircuts",    href: "/resident/shopping", imageUrl: `${U}1503951914875-452162b0f3f1?w=600` },
      { icon: Gift,        label: "Flower & Gift",     sub: "Gifts & arrangements",href: "/resident/shopping", imageUrl: `${U}1511795409834-ef04bbd61622?w=600` },
      { icon: HomeIcon,    label: "Furniture Exchange",sub: "Used furniture deals",href: "/resident/shopping", imageUrl: `${U}1441986300917-64674bd600d8?w=600` },
    ],
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

const FEATURED_WEEKEND = [
  { id: "theater",   title: "Mission: Impossible at Theater",  meta: "Sat · May 31 · 1:30 PM",        price: "From $5",   image: `${U}1489599849927-2ee91cede3ba?w=800`, badge: "🎬 Movies",   color: "#7C3AED" },
  { id: "bbq",       title: "Memorial Day BBQ at Del Mar",     meta: "Mon · May 26 · 11:00 AM",       price: "FREE",      image: `${U}1529543544282-ea669407fca3?w=800`, badge: "🎉 Holiday",  color: "#C8102E" },
  { id: "disneyland",title: "Disneyland Military Tickets",     meta: "Available Year-Round · ITT",    price: "From $89",  image: `${U}1520166012956-add9ba0835cb?w=800`, badge: "🎡 ITT Deal", color: "#059669" },
]

const UPCOMING_EVENTS = [
  { id: "movie",     emoji: "🎬", title: "Mission: Impossible at Theater", date: "May 31", price: "From $5",  free: false },
  { id: "5k",        emoji: "🏃", title: "Hard Corps 5K Race",             date: "Jun 8",  price: "$20 AD",   free: false },
  { id: "concert",   emoji: "🎵", title: "Bands on the Beach",             date: "Jun 21", price: "FREE",     free: true  },
  { id: "golf",      emoji: "⛳", title: "Semper Fi Golf Tournament",       date: "Jun 28", price: "$45",      free: false },
  { id: "fireworks", emoji: "🎆", title: "4th of July Fireworks",          date: "Jul 4",  price: "FREE",     free: true  },
]

const NEWS_ITEMS = [
  { num: 1, category: "Wellness",   title: "Tired of Feeling Tired? New Sleep Readiness Program at Paige Field House" },
  { num: 2, category: "Financial",  title: "What is the Blended Retirement System? A Guide for Marines" },
  { num: 3, category: "Youth",      title: "5 Reasons Your Child Should Be Playing Sports This Summer" },
  { num: 4, category: "Education",  title: "Turn Your Marine Corps Experience Into College Credits" },
  { num: 5, category: "Support",    title: "OSCAR Teams Provide Peer-to-Peer Support for Managing Stress" },
  { num: 6, category: "Family",     title: "Preparing Your Children for Their Next PCS Move" },
  { num: 7, category: "Safety",     title: "Keep Your Family Safe in the Water This Summer" },
]

const QUICK_LINKS = [
  {
    title: "Official Resources",
    links: ["US Marine Corps", "Marine Corps Recruiting", "Military OneSource", "MyNavy HR", "American Forces Travel"],
  },
  {
    title: "Family Support",
    links: ["EFMP Program", "New Parent Support", "Family Advocacy Program", "L.I.N.K.S. Program", "Marine Corps Family Team Building", "FOCUS Program"],
  },
  {
    title: "Education & Career",
    links: ["Voluntary Education Program", "SkillBridge Program", "Marine For Life Network", "Career Services", "MarineNet Online Learning", "Transition Readiness"],
  },
  {
    title: "Legal & Financial",
    links: ["Personal Financial Management", "JAG Legal Services", "Tax Services (VITA)", "Retired Affairs", "Veterans Benefits (va.gov)", "Social Security Administration"],
  },
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning, Marine"
  if (h < 17) return "Good afternoon, Marine"
  return "Good evening, Marine"
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ResidentHomePage() {
  const [searchResults, setSearchResults]   = useState<Program[] | null>(null)
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)
  const [eventsOpen, setEventsOpen]         = useState(false)
  const [mapOpen, setMapOpen]               = useState(false)
  const [waitlistOpen, setWaitlistOpen]     = useState(false)
  const [tickerDismissed, setTickerDismissed] = useState(false)

  function handleTileAction(action: TileAction) {
    if (action === "events")        setEventsOpen(true)
    else if (action === "map")      setMapOpen(true)
    else if (action === "waitlist") setWaitlistOpen(true)
  }

  const showResults = searchResults !== null
  const TICKER_TEXT = "MCCS HOLIDAY HOURS: Memorial Day — Most facilities open 9am–5pm.  |  Summer cottage bookings now open.  |  CDC-1 waitlist: Join online today.  |  Hard Corps 5K Race: June 8 — Register Now.  |  Bands on the Beach Concert: June 21, Del Mar · Free.  |  "

  return (
    <div className="w-full">

      {/* ── Announcement Ticker ── */}
      {!tickerDismissed && (
        <div
          className="relative flex items-center overflow-hidden"
          style={{ backgroundColor: "#92400E", height: 36 }}
        >
          <div className="flex-none flex items-center px-3 gap-2 shrink-0 z-10" style={{ background: "#92400E" }}>
            <Megaphone className="h-3.5 w-3.5 text-amber-200 shrink-0" />
          </div>
          <div className="overflow-hidden flex-1">
            <div className="ticker-scroll text-xs text-amber-100">
              <span className="pr-16">{TICKER_TEXT}</span>
              <span className="pr-16">{TICKER_TEXT}</span>
            </div>
          </div>
          <button
            onClick={() => setTickerDismissed(true)}
            className="flex-none px-3 text-amber-300 hover:text-white transition-colors z-10"
            style={{ background: "#92400E" }}
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Full-bleed Hero ── */}
      <div className="relative h-[380px] md:h-[520px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=1600&q=80"
          alt="Camp Pendleton Marines"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(12,35,64,0.93) 0%, rgba(200,16,46,0.35) 100%)" }}
        />

        {/* Content — left aligned */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <span
              className="inline-block rounded-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] mb-4"
              style={{ backgroundColor: "rgba(201,168,76,0.2)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)" }}
            >
              Marine Corps Community Services
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tight">
              Camp Pendleton
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-2 font-medium">
              {getGreeting()}
            </p>
            <p className="text-sm text-white/50 mb-6 leading-relaxed max-w-lg">
              Serving Marines, families, retirees, and DoD civilians with recreation,
              dining, childcare, and support programs.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="#categories" className="btn-usmc-primary">Explore Programs</a>
              <button onClick={() => setMapOpen(true)} className="btn-usmc-ghost">View Base Map</button>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-2">
              {["50+ Programs", "Open 7 Days", "Free for Active Duty"].map(s => (
                <span key={s} className="rounded-sm px-3 py-1 text-[11px] font-bold text-white/80 uppercase tracking-wide" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Floating stat cards — desktop only */}
          <div className="hidden md:flex absolute right-16 top-1/2 -translate-y-1/2 flex-col gap-3">
            <div className="rounded-sm bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 text-white">
              <p className="usmc-label text-[9px] mb-1">Today&apos;s Weather</p>
              <p className="text-2xl font-black">72°F ☀️</p>
              <p className="text-xs text-white/60">Camp Pendleton, CA</p>
            </div>
            <div className="rounded-sm bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 text-white">
              <p className="usmc-label text-[9px] mb-1">Open Now</p>
              <p className="text-2xl font-black">34</p>
              <p className="text-xs text-white/60">Facilities currently open</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Quick-Link Strip ── */}
      <div className="w-full" style={{ backgroundColor: "#0C2340" }}>
        <div className="flex items-center justify-around px-4 py-3">
          {[
            { icon: Dumbbell,       label: "Fitness",   href: "/resident/fitness"   },
            { icon: Baby,           label: "Childcare", href: "/resident/childcare" },
            { icon: UtensilsCrossed,label: "Dining",    href: "/resident/dining"    },
            { icon: Sun,            label: "Recreation",href: "/resident/recreation"},
            { icon: Calendar,       label: "Events",    href: null, onClick: () => setEventsOpen(true) },
          ].map(({ icon: Icon, label, href, onClick }) =>
            href ? (
              <Link key={label} href={href} className="flex flex-col items-center gap-1 group px-2">
                <Icon className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" strokeWidth={1.75} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/80 transition-colors">{label}</span>
              </Link>
            ) : (
              <button key={label} onClick={onClick ?? undefined} className="flex flex-col items-center gap-1 group px-2">
                <Icon className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" strokeWidth={1.75} />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 group-hover:text-white/80 transition-colors">{label}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="px-4 md:px-10 lg:px-16 py-4 bg-zinc-100">
        <div className="rounded-sm bg-white shadow-md p-3 border-l-4" style={{ borderColor: "#C8102E" }}>
          <SearchBar
            onResults={(programs) => setSearchResults(programs)}
            placeholder="Search fitness classes, dining, childcare…"
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="w-full">

        {/* Search results */}
        {showResults && (
          <div className="px-6 md:px-10 lg:px-16 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-zinc-700 uppercase tracking-wide">
                {searchResults.length === 0 ? "No results found" : `${searchResults.length} Result${searchResults.length !== 1 ? "s" : ""}`}
              </h2>
              <button onClick={() => setSearchResults(null)} className="text-xs font-bold uppercase tracking-wide" style={{ color: "#C8102E" }}>
                Clear ×
              </button>
            </div>
            <div className="space-y-2">
              {searchResults.slice(0, 10).map((p) => (
                <ProgramCard key={p.id} program={p} compact onBook={() => setBookingProgram(p)} />
              ))}
            </div>
          </div>
        )}

        {!showResults && (
          <>
            {/* ── Featured This Weekend ── */}
            <section className="px-6 md:px-10 lg:px-16 py-8">
              <div className="section-header">
                <h2>Featured This Weekend</h2>
                <button onClick={() => setEventsOpen(true)} className="ml-auto text-xs font-bold uppercase tracking-wide" style={{ color: "#C8102E" }}>
                  All Events →
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {FEATURED_WEEKEND.map(card => (
                  <button
                    key={card.id}
                    onClick={() => setEventsOpen(true)}
                    className="tile-hover relative flex-none w-56 h-40 overflow-hidden rounded-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <span className="absolute top-2 left-2 text-[9px] font-black rounded-sm px-2 py-0.5 text-white" style={{ backgroundColor: card.color }}>{card.badge}</span>
                    <div className="absolute bottom-2 left-2 right-2 text-left">
                      <p className="text-[11px] font-black text-white leading-tight line-clamp-2">{card.title}</p>
                      <p className="text-[9px] text-white/60 mt-0.5">{card.meta}</p>
                      <p className="text-[10px] font-black mt-0.5" style={{ color: "#4ade80" }}>{card.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Today on Base ── */}
            <section className="px-6 md:px-10 lg:px-16 pb-6">
              <p className="usmc-label mb-2" style={{ color: "#52525B" }}>Today on Base</p>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
                {TODAY_FACILITIES.map(fac => {
                  const open = isOpenNow(fac.hours)
                  const Icon = fac.icon
                  return (
                    <div key={fac.name} className="flex-none flex items-center gap-1.5 rounded-sm border border-zinc-200 bg-white px-3 py-1.5">
                      <Icon className="h-3 w-3 text-zinc-400" />
                      <span className="text-[10px] font-bold text-zinc-700 whitespace-nowrap">{fac.name}</span>
                      <span className={`text-[8px] font-black rounded-sm px-1.5 py-0.5 uppercase tracking-wide ${open ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                        {open ? "OPEN" : "CLOSED"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* ── Category Tile Groups ── */}
            <div id="categories" className="space-y-10 pb-10">
              {TILE_GROUPS.map(group => (
                <section key={group.id} className="px-6 md:px-10 lg:px-16">
                  <div className="section-header">
                    <div className="h-5 w-1.5 rounded-sm shrink-0" style={{ backgroundColor: group.color }} />
                    <h2>{group.title}</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1.5">
                    {group.tiles.map(tile => (
                      <Tile key={tile.label} {...tile} onAction={handleTileAction} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* ── News & Stories ── */}
            <section className="px-6 md:px-10 lg:px-16 py-10 bg-white">
              <div className="section-header">
                <h2>News &amp; Stories</h2>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-zinc-400">via MCCS</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured story */}
                <div className="tile-hover rounded-sm overflow-hidden border border-zinc-100">
                  <div className="relative h-52">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${U}1569336415962-a4bd9f69cd83?w=800`}
                      alt="Family Readiness"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/80 to-transparent" />
                    <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider rounded-sm px-2 py-0.5 text-white" style={{ backgroundColor: "#C8102E" }}>
                      Family Readiness
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-zinc-900 text-sm leading-snug mb-2">
                      Navigating Paternal Postpartum Depression: Support for Marine Dads
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                      Recognizing the emotional challenges new fathers face after childbirth — and the MCCS resources available right here on base.
                    </p>
                    <button className="text-xs font-black uppercase tracking-wide" style={{ color: "#C8102E" }}>
                      Read More →
                    </button>
                  </div>
                </div>

                {/* News list */}
                <div className="rounded-sm overflow-hidden border border-zinc-100">
                  {NEWS_ITEMS.map((item, i) => (
                    <div
                      key={item.num}
                      className="news-card card-accent flex items-start gap-3"
                      style={{ borderLeftColor: "#C8102E" }}
                    >
                      <span className="text-[10px] font-black text-zinc-300 w-5 shrink-0 mt-0.5">{String(item.num).padStart(2, "0")}</span>
                      <div className="flex-1 min-w-0">
                        <p className="news-card-category">{item.category}</p>
                        <p className="text-xs font-bold text-zinc-900 leading-snug">{item.title}</p>
                        <button className="mt-1 text-[10px] font-black uppercase tracking-wide" style={{ color: "#C8102E" }}>
                          Read More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Upcoming Events Strip ── */}
            <section className="px-6 md:px-10 lg:px-16 py-8 bg-zinc-50">
              <div className="section-header">
                <h2>Upcoming Events</h2>
                <button onClick={() => setEventsOpen(true)} className="ml-auto text-xs font-bold uppercase tracking-wide" style={{ color: "#C8102E" }}>
                  View All →
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {UPCOMING_EVENTS.map(evt => (
                  <button
                    key={evt.id}
                    onClick={() => setEventsOpen(true)}
                    className="tile-hover flex-none rounded-sm bg-white border border-zinc-200 p-3 text-left w-44"
                  >
                    <span className="text-xl mb-1 block">{evt.emoji}</span>
                    <p className="text-[11px] font-black text-zinc-900 leading-tight line-clamp-2">{evt.title}</p>
                    <p className="text-[9px] text-zinc-400 mt-1 font-bold uppercase tracking-wide">{evt.date}</p>
                    <p className="text-[10px] font-black mt-0.5" style={{ color: evt.free ? "#059669" : "#003087" }}>{evt.price}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* ── Map CTA ── */}
            <section className="px-6 md:px-10 lg:px-16 py-8">
              <button
                onClick={() => setMapOpen(true)}
                className="tile-hover w-full rounded-sm p-6 text-left"
                style={{ background: "linear-gradient(135deg, #0C2340 0%, #003087 100%)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="usmc-label text-[9px] mb-1">Base Navigation</p>
                    <h3 className="text-xl font-black text-white">View Base Map</h3>
                    <p className="text-xs text-white/50 mt-1 uppercase tracking-wide">25 Facilities · Real-time Hours</p>
                  </div>
                  <div className="h-14 w-14 rounded-sm bg-white/10 flex items-center justify-center">
                    <LucideMap className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-black text-white/50 uppercase tracking-wider">
                  Open interactive map <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>
            </section>

            {/* ── Crisis & Resource Banner ── */}
            <section className="w-full" style={{ backgroundColor: "#0C2340" }}>
              <div className="px-6 md:px-10 lg:px-16 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  {/* Military OneSource */}
                  <div className="p-6 space-y-2" style={{ backgroundColor: "#0C2340" }}>
                    <Phone className="h-6 w-6 mb-3" style={{ color: "#C9A84C" }} />
                    <p className="text-sm font-black text-white uppercase tracking-wide">Military OneSource</p>
                    <p className="text-xs text-white/55 leading-relaxed">
                      Free counseling, financial advice, and family support — available 24/7 for all Service Members.
                    </p>
                    <p className="text-xs font-bold text-white/80">1-800-342-9647 · militaryonesource.mil</p>
                    <button className="btn-usmc-primary mt-2 text-xs py-1.5 px-4">Get Help Now</button>
                  </div>

                  {/* Veterans Crisis Line */}
                  <div className="p-6 space-y-2" style={{ backgroundColor: "#1a0505" }}>
                    <Heart className="h-6 w-6 mb-3" style={{ color: "#ef4444" }} />
                    <p className="text-sm font-black text-white uppercase tracking-wide">Veterans Crisis Line</p>
                    <p className="text-xs text-white/55 leading-relaxed">
                      If you or someone you know is in crisis — connect now. Confidential support, free of charge.
                    </p>
                    <p className="text-sm font-black text-white">DIAL 988 then Press 1</p>
                    <button className="btn-usmc-primary mt-2 text-xs py-1.5 px-4">Get Help Now</button>
                  </div>

                  {/* SAPR */}
                  <div className="p-6 space-y-2" style={{ backgroundColor: "#0C2340" }}>
                    <ShieldIcon className="h-6 w-6 mb-3" style={{ color: "#C9A84C" }} />
                    <p className="text-sm font-black text-white uppercase tracking-wide">Sexual Assault Prevention &amp; Response</p>
                    <p className="text-xs text-white/55 leading-relaxed">
                      Confidential support available 24/7 for survivors and those affected. You are not alone.
                    </p>
                    <p className="text-xs font-bold text-white/80">Safe Helpline: 1-877-995-5247</p>
                    <button className="btn-usmc-ghost mt-2 text-xs py-1.5 px-4">Learn More</button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Quick Links Footer ── */}
            <footer className="w-full py-10 px-6 md:px-10 lg:px-16" style={{ backgroundColor: "#081929" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                {QUICK_LINKS.map(col => (
                  <div key={col.title}>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: "#C9A84C" }}>
                      {col.title}
                    </p>
                    <ul className="space-y-2">
                      {col.links.map(link => (
                        <li key={link}>
                          <button
                            className="text-[11px] text-white/45 hover:text-white/90 transition-colors text-left leading-snug"
                            onClick={() => {}}
                          >
                            {link}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                  MCCS Camp Pendleton · pendleton.usmc-mccs.org · ATO Compliant
                </p>
                <p className="text-[11px] font-black" style={{ color: "#C9A84C" }}>
                  Military/Veterans Crisis Line — DIAL <span className="text-white">988</span>
                </p>
              </div>
            </footer>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      <EventsModal open={eventsOpen} onClose={() => setEventsOpen(false)} />
      <BaseMapModal open={mapOpen}   onClose={() => setMapOpen(false)} />
      <ChildcareWaitlistForm open={waitlistOpen} onClose={() => setWaitlistOpen(false)} preselectedCDC="cdc-1" />
      <BookingModal program={bookingProgram} open={bookingProgram !== null} onClose={() => setBookingProgram(null)} />
    </div>
  )
}
