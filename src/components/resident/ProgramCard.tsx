"use client"

import { Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Program } from "@/types"

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
  fitness:        { bg: "bg-red-100",     text: "text-red-700" },
  childcare:      { bg: "bg-blue-100",    text: "text-blue-700" },
  dining:         { bg: "bg-amber-100",   text: "text-amber-700" },
  recreation:     { bg: "bg-emerald-100", text: "text-emerald-700" },
  retail:         { bg: "bg-purple-100",  text: "text-purple-700" },
  lodging:        { bg: "bg-cyan-100",    text: "text-cyan-700" },
  "family-support":{ bg: "bg-orange-100", text: "text-orange-700" },
  education:      { bg: "bg-slate-100",   text: "text-slate-700" },
}

// CDC program IDs that have a waitlist
const CDC_WAITLIST_IDS = ["cdc-1-mainside", "cdc-2-las-pulgas"]

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_COLORS[category] ?? { bg: "bg-zinc-100", text: "text-zinc-600" }
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", c.bg, c.text)}>
      {CATEGORY_LABELS[category] ?? category}
    </span>
  )
}

export default function ProgramCard({ program, onBook, compact = false, featured = false }: ProgramCardProps) {
  const isFree = program.price === null || program.price === 0
  const hasWaitlist = CDC_WAITLIST_IDS.includes(program.id)

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-3 shadow-sm">
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
              onClick={() => onBook(program)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C8102E" }}
            >
              Book
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl bg-white shadow-sm p-5 flex flex-col gap-3">
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
        <h3 className="font-semibold text-zinc-900 text-base leading-snug">{program.name}</h3>
        <CategoryBadge category={program.category} />
      </div>

      {/* Hours */}
      <div className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>{program.hours}</span>
      </div>

      {/* Eligibility */}
      {program.eligibility.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Users className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          {program.eligibility.map((e) => (
            <span key={e} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">{program.description}</p>

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
            onClick={() => onBook(program)}
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
  )
}
