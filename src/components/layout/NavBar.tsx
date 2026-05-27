"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavBarProps {
  activeRole: "resident" | "dashboard"
}

export default function NavBar({ activeRole }: NavBarProps) {
  const router = useRouter()

  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ backgroundColor: "#0C2340" }}>
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">

        {/* ── Left: Brand ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-black tracking-tight text-white">MCCS</span>
          <span
            className="hidden sm:block text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#C9A84C" }}
          >
            Camp Pendleton
          </span>
        </Link>

        {/* ── Center: Nav links (resident desktop only) ── */}
        {activeRole === "resident" && (
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {[
              { label: "HOME",    href: "/resident" },
              { label: "EXPLORE", href: "/resident#categories" },
              { label: "EVENTS",  href: "/resident" },
              { label: "MAP",     href: "/resident" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[11px] font-bold tracking-widest uppercase transition-colors"
                style={{ color: "rgba(255,255,255,0.75)" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "#C9A84C" }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.75)" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* ── Right: Role switcher + ATO ── */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-full border border-white/20 bg-white/5 p-0.5">
            <button
              onClick={() => router.push("/resident")}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase transition-all",
                activeRole === "resident" ? "text-white" : "text-white/40 hover:text-white/70"
              )}
              style={activeRole === "resident" ? { backgroundColor: "#C8102E" } : {}}
            >
              Patron
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase transition-all",
                activeRole === "dashboard" ? "text-white" : "text-white/40 hover:text-white/70"
              )}
              style={activeRole === "dashboard" ? { backgroundColor: "#003087" } : {}}
            >
              Leadership
            </button>
            <button
              onClick={() => router.push("/dashboard/staff/reservations")}
              className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase text-white/40 hover:text-white/70 transition-all"
            >
              Staff
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/50">
            <ShieldCheck className="h-3 w-3" />
            <span>ATO</span>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-[3px]" style={{ backgroundColor: "#C8102E" }} />
    </header>
  )
}
