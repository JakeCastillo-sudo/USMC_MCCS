"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Dialog({ open, onClose, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return
    const down = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg">
        {children}
      </div>
    </div>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

export function DialogContent({ children, className, onClose }: DialogContentProps) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col",
        className
      )}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="overflow-y-auto flex-1">{children}</div>
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pt-5 pb-4 border-b border-zinc-100", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-bold text-zinc-900", className)}>{children}</h2>
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4 border-t border-zinc-100 bg-zinc-50 flex gap-3 flex-col sm:flex-row-reverse", className)}>{children}</div>
}
