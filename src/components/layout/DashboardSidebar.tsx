"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  DollarSign,
  Activity,
  Star,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Overview",    href: "/dashboard",              icon: LayoutDashboard },
  { label: "Revenue",     href: "/dashboard/revenue",      icon: DollarSign      },
  { label: "Utilization", href: "/dashboard/utilization",  icon: Activity        },
  { label: "Satisfaction",href: "/dashboard/satisfaction", icon: Star            },
  { label: "Engagement",  href: "/dashboard/engagement",   icon: Users           },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-60 flex-col border-r border-zinc-200 bg-white md:flex">
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        {/* Brand mark (stacked) */}
        <div className="mb-6 px-2">
          <div className="text-lg font-bold leading-none" style={{ color: "#C8102E" }}>
            MCCS
          </div>
          <div className="mt-0.5 text-xs text-zinc-400">Camp Pendleton</div>
          <div
            className="mt-2 inline-flex items-center rounded px-1.5 py-0.5 text-xs text-white"
            style={{ backgroundColor: "#003087" }}
          >
            Kaizen Labs
          </div>
        </div>

        {/* Nav links */}
        <nav className="space-y-0.5">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-l-2 bg-red-50 text-[#C8102E]"
                    : "border-l-2 border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
                style={isActive ? { borderColor: "#C8102E" } : {}}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 p-3 space-y-2">
        {/* StormBreaker badge */}
        <div className="rounded-lg p-3 text-white" style={{ backgroundColor: "#003087" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3.5 w-3.5 text-yellow-300 shrink-0" />
            <span className="text-xs font-semibold leading-tight">
              Operation StormBreaker
            </span>
          </div>
          <p className="text-xs text-blue-200 leading-tight">
            MCCS AWS · Zero Trust · FedRAMP Ready
          </p>
        </div>
        <p className="text-center text-xs text-zinc-400">Kaizen Labs Demo v1.0</p>
      </div>
    </aside>
  )
}
