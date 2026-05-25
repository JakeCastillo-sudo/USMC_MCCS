import Link from "next/link"
import type { ProgramCategory } from "@/types"

interface CategoryTileProps {
  category: ProgramCategory
  label: string
  icon: React.ElementType
  count: number
  href: string
  bgColor: string      // tailwind bg class e.g. "bg-red-50"
  textColor: string    // tailwind text class e.g. "text-red-600"
}

export default function CategoryTile({
  label,
  icon: Icon,
  count,
  href,
  bgColor,
  textColor,
}: CategoryTileProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center
        ${bgColor}
        hover:scale-105 active:scale-95 transition-transform duration-150
        shadow-sm hover:shadow-md`}
    >
      <div className={`${textColor}`}>
        <Icon className="h-10 w-10" strokeWidth={1.75} />
      </div>
      <div>
        <p className={`font-semibold text-zinc-900`}>{label}</p>
        <span className="mt-1 inline-block rounded-full bg-white/70 px-2.5 py-0.5 text-xs text-zinc-500 font-medium">
          {count} programs
        </span>
      </div>
    </Link>
  )
}
