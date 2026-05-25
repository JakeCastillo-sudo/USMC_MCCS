"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import ProgramCard from "./ProgramCard"
import BookingModal from "./BookingModal"
import { Skeleton } from "@/components/ui/skeleton"
import type { Program, ProgramCategory } from "@/types"

// One featured program per category (prioritized by bookable)
const FEATURED_CATEGORIES: ProgramCategory[] = ["fitness", "recreation", "dining", "childcare"]

export default function FeaturedPrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingProgram, setBookingProgram] = useState<Program | null>(null)

  useEffect(() => {
    fetch("/api/programs?bookable=true")
      .then((r) => r.json())
      .then((d) => {
        const all = d.data as Program[]
        // Pick one representative per featured category
        const featured: Program[] = []
        for (const cat of FEATURED_CATEGORIES) {
          const match = all.find((p) => p.category === cat)
          if (match) featured.push(match)
        }
        setPrograms(featured)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5" style={{ color: "#FFD700", fill: "#FFD700" }} />
        <h2 className="text-lg font-bold text-zinc-900">Featured This Week</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-[280px] shrink-0 rounded-2xl" />
            ))
          : programs.map((p) => (
              <div key={p.id} className="w-[280px] shrink-0 snap-start">
                <ProgramCard
                  program={p}
                  featured
                  onBook={() => setBookingProgram(p)}
                />
              </div>
            ))
        }
      </div>

      <BookingModal
        program={bookingProgram}
        open={bookingProgram !== null}
        onClose={() => setBookingProgram(null)}
      />
    </section>
  )
}
