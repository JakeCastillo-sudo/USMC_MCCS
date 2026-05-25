import Link from "next/link"
import { Home, LayoutDashboard, Zap, ShieldCheck } from "lucide-react"

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
      <div className="w-full max-w-2xl grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            Enter Resident Portal →
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
      </div>

      {/* Footer compliance strip */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <Zap className="h-3.5 w-3.5 text-blue-300" />
          <span className="text-xs text-blue-200 font-medium">
            Deployed on Operation StormBreaker · MCCS AWS Landing Zone
          </span>
        </div>
        <p className="text-xs text-blue-300/50 font-medium">Platform by Kaizen Labs</p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {["ATO Compliant", "Zero Trust", "FedRAMP Ready"].map((chip) => (
            <div
              key={chip}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"
            >
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] text-blue-200/60 font-medium">{chip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
