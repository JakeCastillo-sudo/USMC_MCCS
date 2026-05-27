"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, Calendar, Map } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/hooks/useProfile"
import ProfileModal from "@/components/resident/ProfileModal"
import EventsModal from "@/components/resident/EventsModal"
import BaseMapModal from "@/components/resident/BaseMapModal"

export default function ResidentNavBar() {
  const pathname = usePathname()
  const profile  = useProfile()

  const [profileOpen, setProfileOpen] = useState(false)
  const [eventsOpen,  setEventsOpen]  = useState(false)
  const [mapOpen,     setMapOpen]     = useState(false)

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`
  const isElite  = profile.loyaltyTier === "Elite"

  const isHome    = pathname === "/resident"
  const isExplore = !isHome && pathname.startsWith("/resident")

  // USMC dark navy bar, active = red icon + gold label
  const barBg    = "#0C2340"
  const activeColor = "#C8102E"
  const goldLabel   = "#C9A84C"
  const dimLabel    = "rgba(255,255,255,0.45)"

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-50 md:hidden"
        style={{ backgroundColor: barBg, borderTop: "2px solid rgba(200,16,46,0.55)" }}
        aria-label="Bottom navigation"
      >
        <div
          className="flex items-center justify-around h-14 max-w-2xl mx-auto px-1"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Home */}
          <Link
            href="/resident"
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl"
            aria-label="Home"
          >
            <Home
              className="h-5 w-5"
              strokeWidth={isHome ? 2.5 : 1.75}
              style={{ color: isHome ? activeColor : "rgba(255,255,255,0.45)" }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: isHome ? goldLabel : dimLabel }}
            >
              Home
            </span>
          </Link>

          {/* Explore */}
          <Link
            href="/resident#categories"
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl"
            aria-label="Explore all services"
          >
            <LayoutGrid
              className="h-5 w-5"
              strokeWidth={isExplore ? 2.5 : 1.75}
              style={{ color: isExplore ? activeColor : "rgba(255,255,255,0.45)" }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: isExplore ? goldLabel : dimLabel }}
            >
              Explore
            </span>
          </Link>

          {/* Events */}
          <button
            onClick={() => setEventsOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl"
            aria-label="View events"
          >
            <Calendar className="h-5 w-5" strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.45)" }} />
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: dimLabel }}>
              Events
            </span>
          </button>

          {/* Map */}
          <button
            onClick={() => setMapOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl"
            aria-label="View base map"
          >
            <Map className="h-5 w-5" strokeWidth={1.75} style={{ color: "rgba(255,255,255,0.45)" }} />
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: dimLabel }}>
              Map
            </span>
          </button>

          {/* Profile avatar */}
          <button
            onClick={() => setProfileOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl"
            aria-label="View profile"
          >
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                isElite ? "ring-2 ring-[#C9A84C]" : "ring-2 ring-white/30"
              )}
              style={{ backgroundColor: "#C8102E" }}
            >
              {initials}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: dimLabel }}>
              Profile
            </span>
          </button>
        </div>
      </nav>

      <EventsModal  open={eventsOpen}  onClose={() => setEventsOpen(false)} />
      <BaseMapModal open={mapOpen}     onClose={() => setMapOpen(false)} />
      <ProfileModal
        patron={profile}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  )
}
