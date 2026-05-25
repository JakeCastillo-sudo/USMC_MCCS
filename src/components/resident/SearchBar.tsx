"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Program } from "@/types"

const CATEGORIES = [
  { label: "All",        value: "" },
  { label: "Fitness",    value: "fitness" },
  { label: "Childcare",  value: "childcare" },
  { label: "Dining",     value: "dining" },
  { label: "Recreation", value: "recreation" },
  { label: "Lodging",    value: "lodging" },
  { label: "Retail",     value: "retail" },
]

interface SearchBarProps {
  onResults: (programs: Program[]) => void
  placeholder?: string
}

export default function SearchBar({
  onResults,
  placeholder = "Search fitness classes, dining, childcare...",
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = useCallback(
    (q: string, cat: string) => {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      if (cat) params.set("category", cat)
      fetch(`/api/programs?${params.toString()}`)
        .then((r) => r.json())
        .then((d) => onResults(d.data as Program[]))
        .catch(() => onResults([]))
    },
    [onResults]
  )

  // Debounced query
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      runSearch(query, activeCategory)
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, activeCategory, runSearch])

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat)
    // immediate — don't wait for debounce
    if (timerRef.current) clearTimeout(timerRef.current)
    runSearch(query, cat)
  }

  return (
    <div className="space-y-2">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-10 pr-10 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); runSearch("", activeCategory) }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {CATEGORIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleCategoryClick(value)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === value
                ? "text-white shadow-sm"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            )}
            style={activeCategory === value ? { backgroundColor: "#C8102E" } : {}}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
