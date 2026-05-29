"use client"

import dynamic from "next/dynamic"

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/80">
      <div className="rounded-2xl bg-white p-8 text-center">
        <div className="h-10 w-10 rounded-full border-4 border-[#003087] border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-zinc-700">Loading map…</p>
      </div>
    </div>
  ),
})

interface BaseMapModalProps {
  open: boolean
  onClose: () => void
  focusLocationId?: string
}

export default function BaseMapModal({ open, onClose, focusLocationId }: BaseMapModalProps) {
  if (!open) return null
  return <MapInner focusLocationId={focusLocationId} onClose={onClose} />
}
