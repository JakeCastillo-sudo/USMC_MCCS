"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Dumbbell, Baby, UtensilsCrossed, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { label: "Home",     icon: Home,            href: "/resident" },
  { label: "Fitness",  icon: Dumbbell,        href: "/resident/fitness" },
  { label: "Childcare",icon: Baby,            href: "/resident/childcare" },
  { label: "Dining",   icon: UtensilsCrossed, href: "/resident/dining" },
  { label: "More",     icon: MoreHorizontal,  href: "/resident/recreation" },
]

export default function ResidentNavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-sm safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        {TABS.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== "/resident" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors",
                isActive ? "text-[#C8102E]" : "text-zinc-400"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
