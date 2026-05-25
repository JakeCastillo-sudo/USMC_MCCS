import Link from "next/link"
import { Dumbbell, Baby, Calendar, UtensilsCrossed, ChevronRight } from "lucide-react"

const ACTIONS = [
  {
    icon: Dumbbell,
    label: "Book a Fitness Class",
    sub: "12 centers available",
    href: "/resident/fitness",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    urgent: false,
  },
  {
    icon: Baby,
    label: "Find Childcare",
    sub: "187 families waitlisted",
    href: "/resident/childcare",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    urgent: true,
  },
  {
    icon: Calendar,
    label: "Reserve a Facility",
    sub: "Beaches, courts & more",
    href: "/resident/recreation",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    urgent: false,
  },
  {
    icon: UtensilsCrossed,
    label: "View Dining Hours",
    sub: "3 restaurants on base",
    href: "/resident/dining",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    urgent: false,
  },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ACTIONS.map(({ icon: Icon, label, sub, href, iconBg, iconColor, urgent }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-zinc-900 text-sm">{label}</p>
            <p className={`text-xs mt-0.5 ${urgent ? "text-red-600 font-medium" : "text-zinc-400"}`}>{sub}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300" />
        </Link>
      ))}
    </div>
  )
}
