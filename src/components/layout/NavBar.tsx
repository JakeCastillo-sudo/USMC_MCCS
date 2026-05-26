"use client"

import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavBarProps {
  activeRole: "resident" | "dashboard"
}

export default function NavBar({ activeRole }: NavBarProps) {
  const router = useRouter()

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* ── Left: Brand ── */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight" style={{ color: "#C8102E" }}>
              MCCS
            </span>
            <span className="text-sm text-zinc-500 hidden sm:inline">Camp Pendleton</span>
          </div>
          <span
            className="hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: "#003087" }}
          >
            Powered by Kaizen Labs
          </span>
        </div>

        {/* ── Right: Role switcher + ATO badge ── */}
        <div className="flex items-center gap-3">
          {/* Role switcher */}
          <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5">
            <button
              onClick={() => router.push("/resident")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                activeRole === "resident"
                  ? "text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              )}
              style={activeRole === "resident" ? { backgroundColor: "#C8102E" } : {}}
            >
              Patron Portal
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                activeRole === "dashboard"
                  ? "text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              )}
              style={activeRole === "dashboard" ? { backgroundColor: "#C8102E" } : {}}
            >
              Leadership Dashboard
            </button>
          </div>

          {/* ATO badge */}
          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>ATO Compliant</span>
          </div>
        </div>
      </div>
    </header>
  )
}
