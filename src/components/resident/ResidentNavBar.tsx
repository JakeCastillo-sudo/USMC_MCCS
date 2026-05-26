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

  const tabCls     = "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors"
  const activeCls  = "text-[#C8102E]"
  const inactiveCls = "text-zinc-400"

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-sm safe-area-bottom md:hidden"
        aria-label="Bottom navigation"
      >
        <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-1">

          {/* Home */}
          <Link
            href="/resident"
            className={cn(tabCls, isHome ? activeCls : inactiveCls)}
            aria-label="Home"
          >
            <Home className="h-5 w-5" strokeWidth={isHome ? 2.5 : 1.75} />
            <span className={cn("text-[10px] font-medium", isHome && "font-bold")}>Home</span>
          </Link>

          {/* Explore */}
          <Link
            href="/resident#categories"
            className={cn(tabCls, isExplore ? activeCls : inactiveCls)}
            aria-label="Explore all services"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={isExplore ? 2.5 : 1.75} />
            <span className={cn("text-[10px] font-medium", isExplore && "font-bold")}>Explore</span>
          </Link>

          {/* Events — opens modal */}
          <button
            onClick={() => setEventsOpen(true)}
            className={cn(tabCls, inactiveCls)}
            aria-label="View events"
          >
            <Calendar className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-[10px] font-medium">Events</span>
          </button>

          {/* Map — opens modal */}
          <button
            onClick={() => setMapOpen(true)}
            className={cn(tabCls, inactiveCls)}
            aria-label="View base map"
          >
            <Map className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-[10px] font-medium">Map</span>
          </button>

          {/* Profile avatar */}
          <button
            onClick={() => setProfileOpen(true)}
            className={cn(tabCls)}
            aria-label="View profile"
          >
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                isElite ? "ring-2 ring-amber-400" : "ring-2 ring-zinc-300"
              )}
              style={{ backgroundColor: "#003087" }}
            >
              {initials}
            </div>
            <span className="text-[10px] font-medium text-zinc-400">Profile</span>
          </button>

        </div>
      </nav>

      {/* Modals */}
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
