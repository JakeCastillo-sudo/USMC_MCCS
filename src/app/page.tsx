import Link from "next/link"
import { Home, LayoutDashboard, ClipboardList } from "lucide-react"
import StormBreakerBadge from "@/components/shared/StormBreakerBadge"

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #003087 0%, #001a4d 60%, #000d2b 100%)" }}
    >
      {/* Brand */}
      <div className="mb-10 text-center">
        <p className="text-5xl font-black tracking-tight text-white mb-1">MCCS</p>
        <p className="text-base font-medium text-blue-200">Marine Corps Community Services</p>
        <p className="text-sm text-blue-300/70 mt-0.5">Camp Pendleton, California</p>
        <div className="mt-5 mx-auto w-16 h-px bg-blue-400/30" />
      </div>

      {/* Role cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Resident card */}
        <Link
          href="/resident"
          className="group relative flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm
            hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-5 group-hover:bg-white/20 transition-colors">
            <Home className="h-8 w-8 text-white" strokeWidth={1.75} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            I&apos;m a Marine or Family Member
          </h2>
          <p className="text-sm text-blue-200/80 leading-relaxed mb-6">
            Find and book MCCS programs, dining, childcare, and recreation at Camp Pendleton
          </p>
          <span className="inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-900 group-hover:bg-zinc-100 transition-colors">
            Enter Patron Portal →
          </span>
        </Link>

        {/* Leadership card */}
        <Link
          href="/dashboard"
          className="group relative flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm
            hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-200 hover:shadow-[0_0_40px_rgba(200,16,46,0.3)]"
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5 group-hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#C8102E" }}
          >
            <LayoutDashboard className="h-8 w-8 text-white" strokeWidth={1.75} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            I&apos;m MCCS Leadership
          </h2>
          <p className="text-sm text-blue-200/80 leading-relaxed mb-6">
            View revenue, utilization, satisfaction metrics, and operational alerts across programs
          </p>
          <span
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity group-hover:opacity-90"
            style={{ backgroundColor: "#C8102E" }}
          >
            Enter Command Dashboard →
          </span>
        </Link>

        {/* Staff card */}
        <Link
          href="/dashboard/staff/reservations"
          className="group relative flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm
            hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-200 hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]"
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5 group-hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#059669" }}
          >
            <ClipboardList className="h-8 w-8 text-white" strokeWidth={1.75} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            I&apos;m MCCS Staff
          </h2>
          <p className="text-sm text-blue-200/80 leading-relaxed mb-6">
            Manage reservations, process payments, and look up patron profiles
          </p>
          <span
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity group-hover:opacity-90"
            style={{ backgroundColor: "#059669" }}
          >
            Enter Staff Portal →
          </span>
        </Link>
      </div>

      {/* StormBreaker badge — large dark */}
      <div className="mt-10 w-full max-w-md">
        <StormBreakerBadge size="lg" variant="dark" />
      </div>

      <p className="mt-4 text-xs text-blue-300/50 font-medium">Platform by Kaizen Labs</p>
    </div>
  )
}
