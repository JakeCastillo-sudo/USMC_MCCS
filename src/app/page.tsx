import Link from "next/link"
import { Home, LayoutDashboard, ClipboardList } from "lucide-react"
import StormBreakerBadge from "@/components/shared/StormBreakerBadge"

const HERO_IMG = "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=1600&q=80"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: "#0C2340" }}>

      {/* ── Background image ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMG}
        alt="United States Marines"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.28 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,35,64,0.97) 0%, rgba(12,35,64,0.72) 45%, rgba(12,35,64,0.97) 100%)",
        }}
      />

      {/* ── Top micro-bar ── */}
      <div className="relative z-10 w-full border-b border-white/10 py-2 px-6 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
          ★ United States Marine Corps
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#C9A84C" }}>
          Official MCCS Platform
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* Brand */}
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: "#C9A84C" }}
          >
            Marine Corps Community Services
          </p>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-3">
            Camp Pendleton
          </h1>
          <p className="text-lg text-white/60 mb-1">Serving those who serve.</p>
          <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
            Your gateway to recreation, dining, childcare, family support, and more —
            for Marines, families, retirees, and DoD civilians.
          </p>
        </div>

        {/* Role cards */}
        <div className="w-full max-w-5xl grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Patron card */}
          <Link
            href="/resident"
            className="group flex flex-col overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "rgba(12,35,64,0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: "4px solid #C8102E",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Image strip */}
            <div className="relative h-20 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600"
                alt="Marines"
                className="w-full h-full object-cover"
                style={{ opacity: 0.4 }}
              />
            </div>

            <div className="flex flex-col flex-1 p-6">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-white" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-black text-white mb-1 tracking-tight">
                Marines &amp; Families
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#C9A84C" }}>
                Recreation · Dining · Childcare · Support
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-6 flex-1">
                Access all MCCS programs, book facilities, and manage your family&apos;s services.
              </p>
              <span className="btn-usmc-primary text-center w-full block">
                Enter Portal
              </span>
            </div>
          </Link>

          {/* Leadership card */}
          <Link
            href="/dashboard"
            className="group flex flex-col overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "rgba(12,35,64,0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: "4px solid #003087",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="relative h-20 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600"
                alt="Leadership"
                className="w-full h-full object-cover"
                style={{ opacity: 0.35 }}
              />
            </div>
            <div className="flex flex-col flex-1 p-6">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <LayoutDashboard className="h-6 w-6 text-white" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-black text-white mb-1 tracking-tight">
                MCCS Leadership
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#C9A84C" }}>
                Revenue · Utilization · Satisfaction
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-6 flex-1">
                View metrics, operational alerts, and program performance across all facilities.
              </p>
              <span
                className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#003087" }}
              >
                Command Dashboard
              </span>
            </div>
          </Link>

          {/* Staff card */}
          <Link
            href="/dashboard/staff/reservations"
            className="group flex flex-col overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "rgba(12,35,64,0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: "4px solid #059669",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="relative h-20 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600"
                alt="Staff Operations"
                className="w-full h-full object-cover"
                style={{ opacity: 0.35 }}
              />
            </div>
            <div className="flex flex-col flex-1 p-6">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-white" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-black text-white mb-1 tracking-tight">
                MCCS Staff
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#C9A84C" }}>
                Reservations · Payments · Patrons
              </p>
              <p className="text-sm text-white/55 leading-relaxed mb-6 flex-1">
                Manage reservations, process payments, and access the patron directory.
              </p>
              <span
                className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#059669" }}
              >
                Staff Portal
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="relative z-10 w-full border-t border-white/10 py-4 px-6"
        style={{ backgroundColor: "rgba(12,35,64,0.9)" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <StormBreakerBadge />
            <span className="hidden sm:flex items-center gap-2 text-xs text-white/30">
              <span className="h-1 w-1 rounded-full bg-white/20" />
              ATO Compliant
              <span className="h-1 w-1 rounded-full bg-white/20" />
              DoD IL2 Ready
            </span>
          </div>
          <p className="text-xs font-bold text-center" style={{ color: "#C9A84C" }}>
            Military/Veterans Crisis Line — DIAL{" "}
            <span className="text-white">988</span> then Press 1
          </p>
        </div>
      </div>
    </div>
  )
}
