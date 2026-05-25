"use client"

import { useState } from "react"
import { Clock, Users, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Program } from "@/types"
import ProgramDetailModal from "./ProgramDetailModal"

interface ProgramCardProps {
  program: Program
  onBook?: (program: Program) => void
  compact?: boolean
  featured?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  fitness: "Fitness",
  childcare: "Childcare",
  dining: "Dining",
  recreation: "Recreation",
  retail: "Retail",
  lodging: "Lodging",
  "family-support": "Family Support",
  education: "Education",
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  fitness:          { bg: "bg-red-100",     text: "text-red-700" },
  childcare:        { bg: "bg-blue-100",    text: "text-blue-700" },
  dining:           { bg: "bg-amber-100",   text: "text-amber-700" },
  recreation:       { bg: "bg-emerald-100", text: "text-emerald-700" },
  retail:           { bg: "bg-purple-100",  text: "text-purple-700" },
  lodging:          { bg: "bg-cyan-100",    text: "text-cyan-700" },
  "family-support": { bg: "bg-orange-100",  text: "text-orange-700" },
  education:        { bg: "bg-slate-100",   text: "text-slate-700" },
}

const CDC_WAITLIST_IDS = ["cdc-1-mainside", "cdc-2-las-pulgas"]

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_COLORS[category] ?? { bg: "bg-zinc-100", text: "text-zinc-600" }
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", c.bg, c.text)}>
      {CATEGORY_LABELS[category] ?? category}
    </span>
  )
}

/** Naive "is open now" check based on the simple hours string */
function isOpenNow(hoursStr: string): boolean | null {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0 = Sun

  // If hours string contains "24/7" treat as open
  if (/24\/7/.test(hoursStr)) return true
  // Simple heuristic: open 5am–10pm weekdays
  const isWeekend = day === 0 || day === 6
  if (isWeekend) return hour >= 7 && hour < 20
  return hour >= 5 && hour < 22
}

function OpenBadge({ hours }: { hours: string }) {
  const open = isOpenNow(hours)
  if (open === null) return null
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold",
        open ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
      )}
    >
      {open ? "Open Now" : "Closed"}
    </span>
  )
}

export default function ProgramCard({ program, onBook, compact = false, featured = false }: ProgramCardProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const isFree = program.price === null || program.price === 0
  const hasWaitlist = CDC_WAITLIST_IDS.includes(program.id) || program.waitlistAvailable

  if (compact) {
    return (
      <>
        <div
          className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-3 shadow-sm cursor-pointer hover:border-zinc-200 transition-colors"
          onClick={() => setDetailOpen(true)}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-zinc-900 text-sm truncate">{program.name}</span>
              <CategoryBadge category={program.category} />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isFree ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">FREE</span>
            ) : (
              <span className="font-mono text-sm text-zinc-700">${program.price?.toFixed(2)}</span>
            )}
            {program.bookable && onBook && (
              <button
                onClick={(e) => { e.stopPropagation(); onBook(program) }}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C8102E" }}
              >
                Book
              </button>
            )}
          </div>
        </div>
        <ProgramDetailModal
          program={program}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onBook={onBook}
        />
      </>
    )
  }

  return (
    <>
      <div
        className="relative rounded-2xl bg-white shadow-sm p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setDetailOpen(true)}
      >
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-zinc-900"
              style={{ backgroundColor: "#FFD700" }}>
              FEATURED
            </span>
          </div>
        )}

        {/* Top row */}
        <div className="flex items-start justify-between gap-2 pr-16">
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 text-base leading-snug">{program.name}</h3>
            {program.highlights?.[0] && (
              <p className="text-xs text-zinc-500 mt-0.5 truncate">{program.highlights[0]}</p>
            )}
          </div>
          <CategoryBadge category={program.category} />
        </div>

        {/* Rating + Open badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {program.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-zinc-700">{program.rating.toFixed(1)}</span>
              {program.reviewCount && (
                <span className="text-xs text-zinc-400">({program.reviewCount})</span>
              )}
            </div>
          )}
          <OpenBadge hours={program.hours} />
        </div>

        {/* Hours */}
        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{program.hours}</span>
        </div>

        {/* Eligibility */}
        {program.eligibility.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Users className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
            {program.eligibility.slice(0, 3).map((e) => (
              <span key={e} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                {e}
              </span>
            ))}
            {program.eligibility.length > 3 && (
              <span className="text-xs text-zinc-400">+{program.eligibility.length - 3} more</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">{program.description}</p>

        {/* Amenity pills */}
        {program.amenities && program.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {program.amenities.slice(0, 4).map((a) => (
              <span key={a} className="rounded-full bg-zinc-50 border border-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {isFree ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">FREE</span>
          ) : (
            <span className="font-mono text-lg font-bold text-zinc-900">${program.price?.toFixed(2)}</span>
          )}

          {hasWaitlist ? (
            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
              Waitlist Available
            </span>
          ) : program.bookable && onBook ? (
            <button
              onClick={(e) => { e.stopPropagation(); onBook(program) }}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C8102E" }}
            >
              Book Now →
            </button>
          ) : (
            <button
              className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-50"
              style={{ color: "#003087", borderColor: "#003087" }}
            >
              View Details →
            </button>
          )}
        </div>
      </div>

      <ProgramDetailModal
        program={program}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onBook={onBook}
      />
    </>
  )
}
