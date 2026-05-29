"use client"

import { useState, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { Search, ExternalLink, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { isOpenNow } from "@/lib/hours"
import mapLocationsData from "@/data/mapLocations.json"

interface MapLocation {
  id: string
  name: string
  category: string
  address: string
  building: string
  coordinates: { lat: number; lng: number }
  hours: string
  phone?: string
  description: string
  programIds: string[]
  markerColor: string
}

const locations: MapLocation[] = mapLocationsData as MapLocation[]

const CATEGORY_LABELS: Record<string, string> = {
  fitness:       "Fitness",
  childcare:     "Childcare",
  dining:        "Dining",
  recreation:    "Recreation",
  entertainment: "Entertainment",
  shopping:      "Shopping",
  services:      "Services",
}

const CATEGORY_ORDER = ["fitness", "childcare", "dining", "recreation", "entertainment", "shopping", "services"]

function createColorMarker(color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:22px;height:22px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  })
}

// Sub-component to programmatically move the map
function MapFly({ target }: { target: [number, number] | null }) {
  const map = useMap()
  if (target) {
    map.flyTo(target, 15, { duration: 1 })
  }
  return null
}

interface Props {
  focusLocationId?: string
  onClose: () => void
}

export default function MapInner({ focusLocationId, onClose }: Props) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedId, setSelectedId] = useState<string | null>(focusLocationId ?? null)
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(
    focusLocationId
      ? (() => {
          const loc = locations.find(l => l.id === focusLocationId)
          return loc ? [loc.coordinates.lat, loc.coordinates.lng] : null
        })()
      : null
  )

  const filtered = useMemo(() => {
    return locations.filter(loc => {
      const matchesSearch = !search || loc.name.toLowerCase().includes(search.toLowerCase())
      const matchesCat = categoryFilter === "all" || loc.category === categoryFilter
      return matchesSearch && matchesCat
    })
  }, [search, categoryFilter])

  const selected = locations.find(l => l.id === selectedId)

  function handleSelect(loc: MapLocation) {
    setSelectedId(loc.id)
    setFlyTarget([loc.coordinates.lat, loc.coordinates.lng])
  }

  const center: [number, number] = [33.3008, -117.3112]

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-white">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <div className="w-full md:w-80 flex flex-col border-r border-zinc-200 bg-white z-10 shadow-lg order-2 md:order-1 max-h-[45vh] md:max-h-none">

        {/* Sidebar header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100" style={{ backgroundColor: "#003087" }}>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-white">MCCS Base Map</h2>
            <p className="text-[10px] text-blue-200">Camp Pendleton</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white rounded-full p-1 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search facilities…"
              className="w-full rounded-lg border border-zinc-200 py-2 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setCategoryFilter("all")}
            className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap transition-colors", categoryFilter === "all" ? "bg-[#003087] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200")}
          >
            All
          </button>
          {CATEGORY_ORDER.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap transition-colors", categoryFilter === cat ? "bg-[#003087] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200")}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">No locations found</div>
          ) : (
            filtered.map(loc => {
              const open = isOpenNow(loc.hours)
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-zinc-50 transition-colors",
                    selectedId === loc.id && "bg-blue-50"
                  )}
                >
                  <div
                    className="h-2 w-2 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: loc.markerColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 leading-tight truncate">{loc.name}</p>
                    <p className="text-[10px] text-zinc-400 capitalize">{CATEGORY_LABELS[loc.category]}</p>
                  </div>
                  <span className={cn("text-[9px] font-bold rounded-full px-1.5 py-0.5 shrink-0 mt-0.5", open ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500")}>
                    {open ? "OPEN" : "CLOSED"}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Selected location detail */}
        {selected && (
          <div className="border-t border-zinc-200 p-3 bg-zinc-50 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-zinc-900 leading-snug">{selected.name}</p>
                <p className="text-[10px] text-zinc-500">{selected.building}</p>
              </div>
              <span
                className="text-[9px] font-bold rounded-full px-2 py-0.5 shrink-0"
                style={{ backgroundColor: selected.markerColor, color: "white" }}
              >
                {CATEGORY_LABELS[selected.category]}
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 leading-relaxed line-clamp-2">{selected.description}</p>
            <p className="text-[10px] text-zinc-500">{selected.hours}</p>
            {selected.phone && <p className="text-[10px] text-zinc-500">{selected.phone}</p>}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selected.coordinates.lat},${selected.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold underline"
              style={{ color: "#003087" }}
            >
              Get Directions <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        )}
      </div>

      {/* ── Map area ────────────────────────────────────────────────── */}
      <div className="flex-1 relative order-1 md:order-2 h-[55vh] md:h-full">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {flyTarget && <MapFly target={flyTarget} />}
          {filtered.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.coordinates.lat, loc.coordinates.lng]}
              icon={createColorMarker(loc.markerColor)}
              eventHandlers={{ click: () => handleSelect(loc) }}
            >
              <Popup maxWidth={220}>
                <div className="text-xs space-y-1 py-1">
                  <p className="font-bold text-zinc-900">{loc.name}</p>
                  <p className="text-zinc-500">{loc.hours}</p>
                  {loc.phone && <p className="text-zinc-500">{loc.phone}</p>}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.coordinates.lat},${loc.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl border border-zinc-200 shadow-lg p-3">
          <p className="text-[9px] font-bold uppercase tracking-wide text-zinc-400 mb-1.5">Legend</p>
          <div className="space-y-1">
            {[
              { label: "Fitness",       color: "#C8102E" },
              { label: "Childcare",     color: "#2563EB" },
              { label: "Dining",        color: "#D97706" },
              { label: "Recreation",    color: "#059669" },
              { label: "Entertainment", color: "#7C3AED" },
              { label: "Shopping",      color: "#9333EA" },
              { label: "Services",      color: "#52525B" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-zinc-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
