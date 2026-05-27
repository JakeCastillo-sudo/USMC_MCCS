# MCCS Camp Pendleton — Unified Platform Demo

> **Built for the Kaizen Labs Head of Federal interview**  
> A full-stack modernization demo for Marine Corps Community Services at Camp Pendleton, deployed on Operation StormBreaker's AWS DevSecOps infrastructure.

---

## What This Is

Marine Corps Community Services (MCCS) serves 70,000+ patrons at Camp Pendleton across fitness centers, childcare, dining, recreation, retail, and lodging. Today that means 5+ disconnected websites, paper waitlists, and zero real-time operational visibility for leadership.

This demo shows what it looks like when Kaizen Labs fixes that — two surfaces, one platform:

| Surface | Audience | Purpose |
|---------|----------|---------|
| **Resident Portal** `/resident` | Marines & families | Discover, book, and pay for MCCS programs |
| **Leadership Dashboard** `/dashboard` | MCCS command staff | Revenue, utilization, satisfaction & alerts |

Both surfaces share the same data layer, design system, and deployment infrastructure.

---

## Quick Start

```bash
# One-command launch (auto-installs, auto-opens browser)
./start.sh

# Or manually:
npm install
npm run dev
# → http://localhost:3000
```

> **Demo Guide:** Hit the floating red button in the bottom-right corner of any page. It walks through the 9-step interview narrative with talking points pre-loaded for each stop.

---

## Screenshots & Flow

### Landing Page — `/`
Navy gradient fullscreen with two role-selection cards. The **StormBreaker badge** establishes deployment credibility upfront. No login required for the demo — click either card to enter.

### Resident Portal — `/resident`
Consumer-grade mobile-first app. Hero with contextual greeting ("Good morning, Marine"), live search with debounced API calls and category chips, quick-action grid, featured programs in a horizontal scroll row, and a 6-tile category browser. Bottom tab bar on mobile.

### Resident Subpages
- **`/resident/fitness`** — 15 fitness programs with sub-nav tabs (All / Centers / Classes / Programs / Races), utilization badges, and sticky filter toggles
- **`/resident/childcare`** — Critical waitlist banner, 3 CDC cards with live capacity bars (CDC-1 shows 187-family waitlist in red), school-age and youth programs
- **`/resident/dining`** — Today's open/closed status strip, restaurant cards with CSAT badges, private event venues, fast food hours
- **`/resident/recreation`** — 4 outdoor feature hero cards, indoor programs, aquatics capacity, equipment rental CTA

### Booking Modal (3-step)
Available on all bookable programs. **Step 1:** horizontal date picker + time slot grid (some slots marked Full). **Step 2:** summary card + pre-filled patron info (SSgt Jacob Martinez, USMC-2847391, Active Duty) + MCCS Pay. **Step 3:** emerald confirmation screen with booking reference `MCCS-PND-XXXXXX`.

### Leadership Dashboard — `/dashboard`
- **KPI Bar** — 6 metrics with count-up animation and sparklines: Monthly Revenue ($4.2M), YTD ($38.7M), Active Patrons (48,200), Bookings (22,400), CSAT (4.3), Utilization (78%)
- **Revenue Chart** — toggleable Monthly (current vs. prior year line chart) / By Category (bar chart)
- **Alerts Feed** — 12 auto-generated alerts sorted by severity: 2 critical CDC waitlists, 5 warnings, 2 successes, 1 info — staggered entrance animation
- **Reinvestment Tracker** — $6.2M of $6.5M target (95%), USMC MWR reinvestment mandate
- **Satisfaction Table** — sortable by CSAT / NPS / responses / trend, color-coded (emerald ≥4.3, amber 3.8–4.2, red <3.8)
- **Utilization Grid** — progress bars colored by load (green / amber / red), waitlist badges
- **Installation Table** — Camp Pendleton LIVE, 14 installations coming-soon with expansion CTA

### Dashboard Subpages
- **`/dashboard/revenue`** — KPI strip, full-height charts, top-10 revenue programs table with MoM change
- **`/dashboard/utilization`** — stat cards (avg util, critical count, total), red alert banner when critical > 0, full grid, heatmap placeholder (Phase 2)
- **`/dashboard/satisfaction`** — full sortable table, top performer spotlight (ITT / Latitudes 4.8 / +71 NPS), needs-attention spotlight (21 Area Pool 3.7 / +4 NPS)
- **`/dashboard/engagement`** — active patron trend LineChart (12 months), enrollment donut by category, program highlights alerts feed

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 (App Router) | Static pages + dynamic API routes |
| Language | TypeScript (strict) | Full type coverage across data → API → UI |
| Styling | Tailwind CSS v4 + shadcn/ui (Nova) | `radix-ui` monorepo, not individual packages |
| Charts | Recharts | AreaChart, LineChart, BarChart, PieChart |
| Icons | Lucide React | Consistent icon system |
| Animation | CSS keyframes via Tailwind | No animation library — count-up, fade-slide, stagger |
| Data | JSON fixtures + Next.js API routes | No database — demo-safe, zero config |
| Fonts | Geist Sans + Geist Mono | Next.js Google Fonts |

### Dependencies
```json
"next": "^16",
"react": "^19",
"recharts": "^2",
"lucide-react": "^0.400+",
"radix-ui": "(shadcn monorepo)",
"tailwind-merge": "^2",
"clsx": "^2"
```

---

## Project Structure

```
mccs-demo/
├── start.sh                          # One-command launcher
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page (role selector)
│   │   ├── layout.tsx                # Root layout + DemoGuide
│   │   ├── globals.css               # MCCS tokens, animations, scrollbar-hide
│   │   ├── api/
│   │   │   ├── alerts/route.ts       # Dynamic alert generation
│   │   │   ├── facilities/route.ts
│   │   │   ├── installations/route.ts
│   │   │   ├── metrics/route.ts      # 6 KPIs + derived reinvestment
│   │   │   ├── programs/route.ts     # ?q, ?category, ?bookable filters
│   │   │   ├── revenue/route.ts      # Fiscal year Jun 2025–May 2026
│   │   │   ├── satisfaction/route.ts # Weighted CSAT/NPS aggregation
│   │   │   └── utilization/route.ts  # flag→alert level mapping
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # NavBar + DashboardSidebar
│   │   │   ├── page.tsx              # Overview
│   │   │   ├── revenue/page.tsx
│   │   │   ├── utilization/page.tsx
│   │   │   ├── satisfaction/page.tsx
│   │   │   └── engagement/page.tsx
│   │   └── resident/
│   │       ├── layout.tsx            # NavBar + ResidentNavBar (mobile tabs)
│   │       ├── page.tsx              # Home
│   │       ├── fitness/page.tsx
│   │       ├── childcare/page.tsx
│   │       ├── dining/page.tsx
│   │       └── recreation/page.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AlertsFeed.tsx        # Staggered entrance, severity sort
│   │   │   ├── InstallationTable.tsx # Live/coming-soon rows
│   │   │   ├── KPIBar.tsx            # 6-up grid, skeleton loading
│   │   │   ├── KPICard.tsx           # Count-up animation, sparkline
│   │   │   ├── ReinvestmentTracker.tsx
│   │   │   ├── RevenueChart.tsx      # Monthly/category tab switcher
│   │   │   ├── SatisfactionTable.tsx # Client-side sort, color coding
│   │   │   └── UtilizationGrid.tsx   # Progress bars, waitlist badges
│   │   ├── layout/
│   │   │   ├── DashboardSidebar.tsx  # Fixed left nav, StormBreakerBadge
│   │   │   └── NavBar.tsx            # Shared top bar, role switcher
│   │   ├── resident/
│   │   │   ├── BookingModal.tsx      # 3-step modal with slide transitions
│   │   │   ├── CategoryTile.tsx      # Tappable category grid tile
│   │   │   ├── FeaturedPrograms.tsx  # Horizontal scroll, gold badge
│   │   │   ├── ProgramCard.tsx       # Full + compact variants
│   │   │   ├── QuickActions.tsx      # 2×2 action grid
│   │   │   ├── ResidentNavBar.tsx    # Mobile bottom tab bar
│   │   │   └── SearchBar.tsx         # Debounced, category chips
│   │   ├── shared/
│   │   │   ├── DemoGuide.tsx         # Floating 9-step walkthrough panel
│   │   │   └── StormBreakerBadge.tsx # sm/md/lg × dark/light variants
│   │   └── ui/                       # shadcn primitives
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── skeleton.tsx
│   │       ├── table.tsx
│   │       └── tabs.tsx
│   ├── data/                         # JSON fixtures (source of truth)
│   │   ├── facilities.json           # 34 facilities with coordinates
│   │   ├── installations.json        # 15 MCCS installations
│   │   ├── metrics.json              # 6 KPI metrics with sparklines
│   │   ├── programs.json             # 37 programs across 5 categories
│   │   ├── revenue.json              # 144 entries (24mo × 6 categories)
│   │   ├── satisfaction.json         # 34 program satisfaction records
│   │   └── utilization.json          # 31 facility utilization records
│   ├── lib/
│   │   └── utils.ts                  # formatCurrency, categoryColor, cn, etc.
│   └── types/
│       └── index.ts                  # Program, Metric, Alert, Installation, etc.
```

---

## API Reference

All routes return `{ data: T, meta?: Record<string, unknown> }`.

### `GET /api/programs`
Returns all 37 programs.

| Param | Type | Description |
|-------|------|-------------|
| `?q` | string | Full-text search across name, description, tags |
| `?category` | string | Filter by category slug |
| `?bookable` | `true` | Only bookable programs |
| `?eligibility` | string | Filter by eligibility string (case-insensitive) |

**Meta:** `{ total, installation }`

---

### `GET /api/metrics`
Returns 6 KPI metrics plus a derived reinvestment metric (7 total).

| ID | Label | Value |
|----|-------|-------|
| `monthly-revenue` | Monthly Revenue | $4,200,000 |
| `ytd-revenue` | YTD Revenue | $38,700,000 |
| `active-patrons` | Active Patrons | 48,200 |
| `bookings-month` | Bookings This Month | 22,400 |
| `csat-overall` | Overall CSAT | 4.3 |
| `utilization-avg` | Avg Utilization | 78% |
| `reinvestment` | *(derived)* | $6,204,800 |

Each metric includes `sparkline[]` (12 months), `trend`, `trendDirection`, `trendSentiment`.

---

### `GET /api/revenue`
Fiscal year Jun 2025–May 2026 by default. Total: **$38,780,000** (+8.9% YoY).

| Param | Type | Description |
|-------|------|-------------|
| `?view` | `monthly` \| `category` | Aggregation shape |
| `?year` | number | Override to calendar year |

**Meta:** `{ period, totalRevenue, priorYearRevenue, yoyGrowthPct }`

Category breakdown (May 2026 month):
- Fitness: $1,100,000 · Childcare: $980,000 · Dining: $820,000
- Recreation: $640,000 · Retail: $520,000 · Lodging: $140,000

---

### `GET /api/utilization`
31 facilities. Flags mapped to alert levels: `waitlist→critical`, `underperforming/declining→warning`, `null→good`.

| Param | Type | Description |
|-------|------|-------------|
| `?category` | string | Filter by category |
| `?alert` | `critical` \| `warning` \| `good` | Filter by alert level |
| `?sort` | `capacity_desc` | Sort order |

**Meta:** `{ avgUtilization: 72, criticalCount: 2, warningCount: 3, topPerformer, underperformer }`

---

### `GET /api/satisfaction`
34 programs. Weighted CSAT **4.35**, overall NPS **39**.

| Param | Type | Description |
|-------|------|-------------|
| `?category` | string | Filter by category |
| `?sort` | `csat_desc` | Sort order |
| `?flag` | `true` | Only programs with CSAT < 4.0 |

**Meta:** `{ overallCsat, overallNps, totalResponses, trending_up[], trending_down[] }`

---

### `GET /api/alerts`
12 dynamically generated alerts from utilization + satisfaction fixtures. Sorted: critical → warning → success → info.

| Alert | Level | Source |
|-------|-------|--------|
| CDC-1 Mainside — Childcare Waitlist | 🔴 critical | utilization.json |
| CDC-2 Las Pulgas — Childcare Waitlist | 🔴 critical | utilization.json |
| CSAT Declining (3 programs) | 🟡 warning | satisfaction.json |
| Low Utilization (2 facilities) | 🟡 warning | utilization.json |
| ITT Travel Desk — Top Performer | 🟢 success | satisfaction.json |
| Del Mar Beach — Peak Season | ℹ️ info | utilization.json |

---

### `GET /api/installations`
15 MCCS installations. Camp Pendleton: `status: "live"` with full metrics. All others: `status: "coming-soon"` with null metrics.

**Meta:** `{ total: 15, live: 1, comingSoon: 14, totalPopulationServed: 419,200 }`

---

## Data Model

```typescript
// Core types — src/types/index.ts

type ProgramCategory =
  | "fitness" | "childcare" | "dining" | "recreation"
  | "retail"  | "lodging"  | "family-support" | "education"

interface Program {
  id: string; name: string; category: ProgramCategory
  facility: string; description: string; hours: string
  eligibility: string[]; bookable: boolean; price: number | null
  tags: string[]
}

interface Metric {
  id: string; label: string; value: number; unit: MetricUnit
  trend: number; trendDirection: TrendDirection
  trendSentiment: TrendSentiment; sparkline: number[]
}

interface UtilizationEntry {
  facilityId: string; facilityName: string; category: ProgramCategory
  capacityPct: number; peakHour: string; avgDailyVisits: number
  trend: number; waitlistCount?: number; alert?: "critical" | "warning" | "good"
}

interface Alert {
  id: string; level: AlertLevel; title: string; message: string
  category: ProgramCategory; metric: string; value: string | number
  action?: string
}
```

---

## Design System

### Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| MCCS Red | `#C8102E` | Primary CTAs, active states, alerts |
| Navy | `#003087` | Headers, secondary elements, dark surfaces |
| Gold | `#FFD700` | Featured badges, accent highlights |

### Design Philosophy
- **Dashboard:** Enterprise — dense information, data-forward, sidebar nav, desktop-first
- **Resident Portal:** Consumer — generous spacing, bold colors, mobile-first, bottom tab bar

### Component Variants
- `StormBreakerBadge` — `size: sm | md | lg` × `variant: dark | light`
- `ProgramCard` — `compact: boolean` × `featured: boolean`
- `RevenueChart` — `view: monthly | category`
- `AlertsFeed` — `filterLevels?: AlertLevel[]` for surface-specific filtering

### Animations
- **Page transitions:** `fadeSlideIn` 0.22s ease-out on every route
- **KPI values:** Cubic ease-out count-up from 0 → value on mount
- **Alert cards:** Staggered `fadeIn` at 80ms per card
- **Booking modal:** `slideInRight` between steps 1 → 2 → 3

---

## The 9-Step Demo Narrative

Use the floating **Demo Guide** (red `▶ Demo Guide` button, bottom-right) during the interview. Each step auto-navigates and shows talking points.

| Step | Route | Narrative |
|------|-------|-----------|
| **1** | `/` | Two roles. StormBreaker badge at the bottom establishes that this deploys into existing MCCS-certified AWS infrastructure — no new ATO. |
| **2** | `/resident` | A Marine's spouse needs childcare and wants to book a gym class. Today that's 5 websites, two phone calls, and a PDF waitlist form. Here it's one app. |
| **3** | `/resident/childcare` | The waitlist problem is real — 187 families at CDC-1 Mainside. The platform doesn't hide this. It surfaces it front-and-center so families can act. |
| **4** | `/resident/fitness` | Open the booking modal on any program. Three taps: pick a date, pick a time, confirm. Done. No phone tag with the front desk. |
| **5** | `/dashboard` | Flip the role switcher in the top nav. Same data, completely different lens. Leadership needs aggregation, not individual records. |
| **6** | `/dashboard/revenue` | $4.2M this month, $38.7M fiscal YTD, up 8.9% year-over-year. The chart shows current vs. prior fiscal year in one view. Category breakdown shows where growth is coming from. |
| **7** | `/dashboard` | The CDC waitlist isn't buried in a report. It's a critical alert at the top of the feed — auto-generated from the same utilization data the resident portal uses. |
| **8** | `/dashboard` | Scroll to the installation table. Camp Pendleton is live. The other 14 installations are ready to onboard. One platform, DoD-wide. |
| **9** | `/` | StormBreaker. MCCS already has a certified AWS boundary. Kaizen deploys into it via FS Form 7600A. No new ATO. No 18-month wait. 30-day deployment timeline. |

---

## Operation StormBreaker

> *"StormBreaker reduced MCCS ATO timelines from 18 months to 30 days. Kaizen Labs deploys directly into this certified infrastructure."*

Operation StormBreaker is MCCS's existing AWS-based DevSecOps platform — a certified, FedRAMP-authorized landing zone that Kaizen Labs can deploy into via inter-agency agreement (FS Form 7600A), bypassing the standard ATO process entirely.

**Compliance posture:**
- ✅ ATO Compliant
- ✅ Zero Trust architecture
- ✅ FedRAMP Ready
- ✅ MCCS AWS Landing Zone

---

## Build & Verification

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build

# Dev server
npm run dev
```

**Production build output (22 routes):**
```
○ /                          Static
○ /dashboard                 Static
○ /dashboard/engagement      Static
○ /dashboard/revenue         Static
○ /dashboard/satisfaction    Static
○ /dashboard/utilization     Static
○ /resident                  Static
○ /resident/childcare        Static
○ /resident/dining           Static
○ /resident/fitness          Static
○ /resident/recreation       Static
ƒ /api/alerts                Dynamic
ƒ /api/facilities            Dynamic
ƒ /api/installations         Dynamic
ƒ /api/metrics               Dynamic
ƒ /api/programs              Dynamic
ƒ /api/revenue               Dynamic
ƒ /api/satisfaction          Dynamic
ƒ /api/utilization           Dynamic
```

---

## Git History

| Commit | Phase | Contents |
|--------|-------|----------|
| `6838c4e` | Final | `start.sh` launcher + all 5 build prompts |
| `ef5860a` | 5 — Polish | DemoGuide, StormBreakerBadge, animations, README |
| `a2e5d73` | 4 — Resident Portal | 7 components, 4 category pages, landing page |
| `d373a78` | 3 — Dashboard | 8 dashboard components, 5 dashboard pages |
| `3ff4f45` | 2 — Data Layer | TypeScript types, 8 API routes, utilities |
| `08c0f3d` | 1 — Foundation | SPEC.md, 7 JSON fixture files |

---

## Data Sources & Consistency Rules

All synthetic data was built against real Camp Pendleton MCCS programs from [pendleton.usmc-mccs.org](https://pendleton.usmc-mccs.org). Internal consistency enforced:

- Monthly revenue values sum to $38,780,000 (FY Jun 2025–May 2026)
- Prior year sums to $35,620,000 → 8.9% YoY growth
- Satisfaction fixture weighted CSAT = 4.346 (within ±0.05 of 4.3 target)
- May 2026 peak month: $4,200,000 total (matches `monthly-revenue` KPI)
- YTD cumulative sparkline matches `ytd-revenue` KPI value of $38,700,000
- Utilization `criticalCount: 2` matches the 2 CDC waitlist alerts generated
- 15 installations: 1 live (Camp Pendleton), 14 coming-soon, population 419,200

---

## PWA — Install on iPhone or Android

The Patron Portal is a Progressive Web App. After a production build it can be installed on any phone like a native app.

### Build for production

```bash
npm run build   # webpack flag is built-in (required for next-pwa)
npm start
```

> **Note:** Service workers only activate in production mode. `npm run dev` intentionally disables them to avoid stale-cache issues during development.

### Option A — Local network (same Wi-Fi)

```bash
# Find your Mac's IP
ipconfig getifaddr en0

# On iPhone, open Safari:
#   http://<YOUR-IP>:3000/resident
# Tap Share → Add to Home Screen → "MCCS" → Add
```

### Option B — ngrok (recommended for demos — works anywhere, HTTPS included)

```bash
npm install -g ngrok
ngrok http 3000
# Share the https://xxxx.ngrok.io URL
# Open on any phone → Safari/Chrome → Add to Home Screen
```

HTTPS is required for PWA install on iOS. ngrok provides this automatically.

### Option C — Vercel (permanent, shareable link)

```bash
npm install -g vercel
vercel
# Free deployment → https://mccs-demo.vercel.app
```

### Verify in Chrome DevTools

1. Open `http://localhost:3000/resident`
2. DevTools → **Application → Manifest** — should show icons + metadata
3. DevTools → **Application → Service Workers** — "Activated and running"
4. DevTools → **Application → Cache Storage** — cached Unsplash images + static assets
5. Click the install icon in Chrome's address bar — app opens as standalone window

---

*Demo prepared for Kaizen Labs · Head of Federal interview · May 2026*  
*Installation: MCB Camp Pendleton, CA · Platform: Kaizen Labs · Infrastructure: Operation StormBreaker*
