"use client"

import { X, Clock, Users, Phone, Mail, Globe, Star, MapPin, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Program, HoursEntry } from "@/types"

interface ProgramDetailModalProps {
  program: Program | null
  open: boolean
  onClose: () => void
  onBook?: (program: Program) => void
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  fitness:        "from-red-600 to-red-800",
  childcare:      "from-blue-600 to-blue-900",
  dining:         "from-amber-600 to-amber-900",
  recreation:     "from-emerald-600 to-emerald-900",
  retail:         "from-purple-600 to-purple-900",
  lodging:        "from-cyan-600 to-cyan-900",
  "family-support": "from-orange-600 to-orange-900",
  education:      "from-slate-600 to-slate-900",
}

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-3.5 w-3.5",
            n <= Math.floor(rating) ? "text-amber-400 fill-amber-400" :
            n === Math.ceil(rating) && rating % 1 >= 0.5 ? "text-amber-400 fill-amber-200" :
            "text-zinc-300 fill-zinc-100"
          )}
        />
      ))}
    </div>
  )
}

function PopularTimesGrid({ times }: { times: Program["popularTimes"] }) {
  if (!times || times.length === 0) return null

  const hours = Array.from({ length: 17 }, (_, i) => i + 6) // 6am–10pm
  const maxLoad = Math.max(...times.map((t) => t.relativeLoad), 1)

  function getLoad(day: string, hour: number) {
    return times?.find((t) => t.day === day && t.hour === hour)?.relativeLoad ?? 0
  }

  function loadColor(load: number) {
    const pct = load / maxLoad
    if (pct === 0) return "bg-zinc-100"
    if (pct < 0.3) return "bg-emerald-200"
    if (pct < 0.6) return "bg-amber-200"
    if (pct < 0.85) return "bg-orange-300"
    return "bg-red-400"
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[360px]">
        {/* Hour labels */}
        <div className="flex gap-0.5 mb-1 ml-8">
          {hours.filter((h) => h % 2 === 0).map((h) => (
            <div key={h} className="w-5 text-[9px] text-zinc-400 text-center" style={{ minWidth: 20 }}>
              {h > 12 ? `${h - 12}p` : h === 12 ? "12p" : `${h}a`}
            </div>
          ))}
        </div>
        {/* Grid */}
        {DAY_ORDER.map((day) => (
          <div key={day} className="flex items-center gap-0.5 mb-0.5">
            <span className="w-7 text-[10px] text-zinc-500 shrink-0">{day}</span>
            {hours.map((h) => {
              const load = getLoad(day, h)
              return (
                <div
                  key={h}
                  title={`${day} ${h > 12 ? `${h-12}pm` : `${h}am`}: ${load}% busy`}
                  className={cn("rounded-sm flex-1 h-4 transition-colors", loadColor(load))}
                  style={{ minWidth: 18 }}
                />
              )
            })}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center gap-2 mt-2 ml-8">
          {["Not busy", "Busy", "Very busy"].map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div className={cn("h-3 w-3 rounded-sm", ["bg-emerald-200", "bg-amber-200", "bg-red-400"][i])} />
              <span className="text-[9px] text-zinc-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HoursTable({ hours, simpleHours }: { hours?: HoursEntry[]; simpleHours: string }) {
  if (!hours || hours.length === 0) {
    return <p className="text-sm text-zinc-600">{simpleHours}</p>
  }
  return (
    <table className="w-full text-xs">
      <tbody>
        {hours.map((h, i) => (
          <tr key={i} className={cn("border-b border-zinc-50", i % 2 === 0 ? "bg-zinc-50" : "bg-white")}>
            <td className="py-1.5 px-2 font-medium text-zinc-700 w-24">{h.days}</td>
            <td className="py-1.5 px-2 text-zinc-600">{h.open} – {h.close}</td>
            {h.note && <td className="py-1.5 px-2 text-zinc-400 italic">{h.note}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function ProgramDetailModal({ program, open, onClose, onBook }: ProgramDetailModalProps) {
  if (!open || !program) return null

  const gradient = CATEGORY_GRADIENTS[program.category] ?? "from-zinc-600 to-zinc-900"
  const isFree = program.price === null || program.price === 0
  const heroColors = program.photos ?? ["#003087", "#C8102E"]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-xl max-h-[95vh] flex flex-col bg-white sm:rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
        {/* Hero */}
        <div
          className={cn("relative h-40 bg-gradient-to-br flex-shrink-0", gradient)}
          style={{ background: `linear-gradient(135deg, ${heroColors[0]} 0%, ${heroColors[1] ?? heroColors[0]} 100%)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-black/30 p-1.5 text-white hover:bg-black/50"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Rating badge */}
          {program.rating && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1">
              <StarRating rating={program.rating} />
              <span className="text-xs font-bold text-zinc-800">{program.rating.toFixed(1)}</span>
              {program.reviewCount && (
                <span className="text-[10px] text-zinc-400">({program.reviewCount})</span>
              )}
            </div>
          )}

          <div className="absolute bottom-3 left-4">
            <h2 className="text-xl font-bold text-white leading-tight drop-shadow-sm">
              {program.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="h-3 w-3 text-white/70" />
              <span className="text-xs text-white/80">{program.facility}</span>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Price + Book */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div>
              {isFree ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">FREE</span>
              ) : (
                <div>
                  <span className="text-2xl font-bold text-zinc-900">${program.price?.toFixed(0)}</span>
                  <span className="text-xs text-zinc-400 ml-1">/ session</span>
                </div>
              )}
            </div>
            {program.bookable && onBook && (
              <button
                onClick={() => { onClose(); onBook(program) }}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C8102E" }}
              >
                Book Now →
              </button>
            )}
          </div>

          <div className="px-5 py-4 space-y-6">
            {/* Description */}
            <section>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {program.extendedDescription ?? program.description}
              </p>
            </section>

            {/* Highlights */}
            {program.highlights && program.highlights.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Highlights</h3>
                <div className="space-y-1.5">
                  {program.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#C8102E] mt-0.5" />
                      <span className="text-sm text-zinc-700">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Amenity pills */}
            {program.amenities && program.amenities.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-1.5">
                  {program.amenities.map((a) => (
                    <span key={a} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Hours */}
            <section>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-zinc-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Hours of Operation</h3>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-100">
                <HoursTable hours={program.structuredHours} simpleHours={program.hours} />
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="h-4 w-4 text-zinc-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Who Can Use This</h3>
              </div>
              {program.structuredEligibility ? (
                <div className="space-y-1">
                  {program.structuredEligibility.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 border-b border-zinc-50 last:border-0">
                      {e.allowed
                        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        : <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />}
                      <span className="text-sm font-medium text-zinc-700">{e.group}</span>
                      {e.note && <span className="text-xs text-zinc-400">({e.note})</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {program.eligibility.map((e) => (
                    <span key={e} className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      <CheckCircle2 className="h-3 w-3" />
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Restrictions */}
            {program.restrictions && program.restrictions.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Restrictions</h3>
                <div className="space-y-1">
                  {program.restrictions.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                      <span className="text-xs text-zinc-600">{r}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Times */}
            {program.popularTimes && program.popularTimes.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-3">Popular Times</h3>
                <PopularTimesGrid times={program.popularTimes} />
              </section>
            )}

            {/* Waitlist info */}
            {program.waitlistAvailable && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Waitlist Active</p>
                    {program.currentWaitlistCount != null && (
                      <p className="text-xs text-amber-700 mt-0.5">
                        {program.currentWaitlistCount} families currently on waitlist
                      </p>
                    )}
                    <button
                      className="mt-2 text-xs font-bold underline"
                      style={{ color: "#C8102E" }}
                    >
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            {program.contactInfo && (
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Contact</h3>
                <div className="space-y-2">
                  {program.contactInfo.phone && (
                    <a href={`tel:${program.contactInfo.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <Phone className="h-3.5 w-3.5" />
                      {program.contactInfo.phone}
                    </a>
                  )}
                  {program.contactInfo.email && (
                    <a href={`mailto:${program.contactInfo.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <Mail className="h-3.5 w-3.5" />
                      {program.contactInfo.email}
                    </a>
                  )}
                  {program.contactInfo.website && (
                    <a href={program.contactInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <Globe className="h-3.5 w-3.5" />
                      {program.contactInfo.website}
                    </a>
                  )}
                  {program.contactInfo.buildingNumber && (
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                      Building {program.contactInfo.buildingNumber}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Last updated */}
            {program.lastUpdated && (
              <p className="text-[10px] text-zinc-300 text-right">
                Last updated: {new Date(program.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
