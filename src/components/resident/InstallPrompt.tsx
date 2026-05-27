"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Already running as installed PWA — nothing to show
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Don't show again if dismissed in this session
    if (sessionStorage.getItem("pwa-banner-dismissed")) return

    // iOS detection
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    setIsIOS(ios)

    // Android / Chrome — native install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }
    window.addEventListener("beforeinstallprompt", handler)

    // iOS — show nudge after 3 s
    if (ios) {
      const timer = setTimeout(() => setShowBanner(true), 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener("beforeinstallprompt", handler)
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem("pwa-banner-dismissed", "1")
    setShowBanner(false)
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") setShowBanner(false)
      setDeferredPrompt(null)
    }
  }

  if (isInstalled || !showBanner) return null

  // ── iOS — share-button instructions ──────────────────────────────────────
  if (isIOS) {
    return (
      <div
        className="fixed bottom-[4.5rem] left-3 right-3 z-[60] rounded-xl shadow-2xl overflow-hidden"
        style={{ background: "#0C2340", border: "1px solid rgba(201,168,76,0.45)" }}
        role="banner"
        aria-label="Install app banner"
      >
        <div className="p-4 pr-10 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full text-white/50 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            {/* Mini icon */}
            <div
              className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{ background: "#C8102E" }}
            >
              <span className="text-white font-black text-xs tracking-tight">MCCS</span>
            </div>

            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Install MCCS Camp Pendleton
              </p>
              <p className="text-white/55 text-xs mt-0.5">
                Add to your home screen for the full app experience
              </p>
              <p className="text-xs mt-2 font-semibold" style={{ color: "#C9A84C" }}>
                Tap <strong>Share</strong> ↑ then <strong>&ldquo;Add to Home Screen&rdquo;</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom hint bar */}
        <div
          className="px-4 py-2 text-center text-white/35 text-[10px] uppercase tracking-widest font-bold"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          ↓ Tap the Share icon in Safari&apos;s toolbar
        </div>
      </div>
    )
  }

  // ── Android / Chrome — native install button ──────────────────────────────
  return (
    <div
      className="fixed bottom-[4.5rem] left-3 right-3 z-[60] rounded-xl shadow-2xl overflow-hidden"
      style={{ background: "#0C2340", border: "1px solid rgba(201,168,76,0.45)" }}
      role="banner"
      aria-label="Install app banner"
    >
      <div className="p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: "#C8102E" }}
        >
          <Download className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">Install MCCS App</p>
          <p className="text-white/55 text-xs">Add to home screen — works offline</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="text-white/40 text-xs px-2 py-1 hover:text-white transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="text-xs px-3 py-1.5 rounded font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            style={{ background: "#C8102E" }}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
