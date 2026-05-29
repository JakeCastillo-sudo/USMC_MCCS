# MCCS Camp Pendleton — Kaizen Labs Demo
## Technical Specification v1.0

---

## 1. Project Overview

A full-stack demo application showcasing how Kaizen Labs' modular platform could modernize Marine Corps Community Services (MCCS) digital infrastructure — deployed via Operation StormBreaker's AWS landing zone.

The app has two surfaces:
- **Resident Portal** — A unified, mobile-first interface for Marines and families at Camp Pendleton to discover, book, and pay for MCCS services
- **Leadership Dashboard** — An enterprise command view for MCCS HQ leaders showing revenue, utilization, satisfaction, and engagement metrics across programs and installations

All data is synthetic but internally consistent. Real program names, facility names, and service categories are sourced from public MCCS web presence.

**Demo narrative:** *"Kaizen brings the application layer. StormBreaker provides the deployment path. Together they modernize how 40,000+ Marines and families at Pendleton experience MCCS — and how HQ leadership sees the whole enterprise."*

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | React + API routes in one project |
| Styling | Tailwind CSS + shadcn/ui (Nova preset) | Professional, fast to build |
| Charts | Recharts | Flexible, React-native charting |
| Icons | Lucide React | Consistent with Nova preset |
| Data | JSON fixtures via Next.js API routes | No DB needed for demo |
| Fonts | Geist (Nova default) | Clean, modern gov-tech feel |

---

## 3. Project Structure

```
mccs-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing / role selector
│   │   ├── layout.tsx                # Root layout, nav
│   │   ├── resident/
│   │   │   ├── page.tsx              # Resident portal home
│   │   │   ├── fitness/page.tsx      # Fitness & Recreation
│   │   │   ├── childcare/page.tsx    # Child & Youth Programs
│   │   │   ├── dining/page.tsx       # Dining & Entertainment
│   │   │   └── booking/page.tsx      # Booking flow
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Executive dashboard home
│   │   │   ├── revenue/page.tsx      # Revenue deep-dive
│   │   │   ├── utilization/page.tsx  # Facility utilization
│   │   │   └── satisfaction/page.tsx # CSAT & engagement
│   │   └── api/
│   │       ├── programs/route.ts     # GET /api/programs
│   │       ├── metrics/route.ts      # GET /api/metrics
│   │       ├── revenue/route.ts      # GET /api/revenue
│   │       ├── utilization/route.ts  # GET /api/utilization
│   │       └── satisfaction/route.ts # GET /api/satisfaction
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   ├── layout/
│   │   │   ├── NavBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── RoleSwitcher.tsx
│   │   ├── resident/
│   │   │   ├── ProgramCard.tsx
│   │   │   ├── BookingModal.tsx
│   │   │   ├── ServiceSearch.tsx
│   │   │   └── QuickActions.tsx
│   │   └── dashboard/
│   │       ├── KPICard.tsx
│   │       ├── RevenueChart.tsx
│   │       ├── UtilizationHeatmap.tsx
│   │       ├── SatisfactionGauge.tsx
│   │       ├── InstallationTable.tsx
│   │       └── AlertsFeed.tsx
│   ├── data/
│   │   ├── programs.json             # Real program names/categories
│   │   ├── facilities.json           # Real facility names at Pendleton
│   │   ├── metrics.json              # Synthetic KPI data
│   │   ├── revenue.json              # Synthetic revenue by month/program
│   │   ├── utilization.json          # Synthetic utilization by facility
│   │   ├── satisfaction.json         # Synthetic CSAT scores
│   │   └── installations.json        # Enterprise view - all bases (teaser)
│   ├── lib/
│   │   └── utils.ts                  # cn(), formatCurrency(), formatPct()
│   └── types/
│       └── index.ts                  # Shared TypeScript types
├── public/
│   ├── mccs-logo.png
│   └── pendleton-hero.jpg
├── SPEC.md                           # This file
└── README.md
```

---

## 4. Data Model

### 4.1 Program
```typescript
type Program = {
  id: string
  name: string                        // e.g. "Semper Fit Gym"
  category: ProgramCategory
  facility: string                    // e.g. "Building 13150"
  description: string
  hours: string                       // e.g. "Mon–Fri 5am–10pm"
  eligibility: string[]               // e.g. ["Active Duty", "Family Members"]
  bookable: boolean
  price: number | null                // null = free
  image?: string
}

type ProgramCategory =
  | "fitness"
  | "childcare"
  | "dining"
  | "recreation"
  | "retail"
  | "family-support"
  | "education"
```

### 4.2 Metric (KPI Card)
```typescript
type Metric = {
  id: string
  label: string
  value: number
  unit: "currency" | "percent" | "count" | "score"
  trend: number                       // % change vs prior period
  trendDirection: "up" | "down"
  trendSentiment: "positive" | "negative" | "neutral"
  sparkline: number[]                 // last 12 months of values
}
```

### 4.3 Revenue
```typescript
type RevenueEntry = {
  month: string                       // "Jan 2025"
  category: ProgramCategory
  installation: string
  amount: number
  transactions: number
}
```

### 4.4 Utilization
```typescript
type UtilizationEntry = {
  facilityId: string
  facilityName: string
  category: ProgramCategory
  capacityPct: number                 // 0–100
  peakHour: string
  avgDailyVisits: number
  trend: number
}
```

### 4.5 Satisfaction
```typescript
type SatisfactionEntry = {
  programId: string
  programName: string
  category: ProgramCategory
  csatScore: number                   // 1–5
  npsScore: number                    // -100 to 100
  responseCount: number
  topPositive: string
  topNegative: string
  trend: number
}
```

### 4.6 Installation (Enterprise Teaser)
```typescript
type Installation = {
  id: string
  name: string                        // e.g. "Camp Pendleton"
  location: string
  marinePopulation: number
  revenue: number                     // annual
  csatAvg: number
  utilizationAvg: number
  status: "live" | "coming-soon"      // Only Pendleton is "live" in demo
}
```

---

## 5. Feature Set

### 5.1 Landing Page (`/`)
- MCCS + Kaizen Labs co-branded header
- Role selector: **"I'm a Marine or Family Member"** | **"I'm MCCS Leadership"**
- Subtle StormBreaker badge: *"Deployed on Operation StormBreaker"*
- Camp Pendleton hero image
- No login required for demo

### 5.2 Resident Portal (`/resident`)

**Home**
- Personalized greeting: *"Welcome to MCCS Camp Pendleton"*
- Quick action tiles: Book Fitness Class · Reserve Facility · Find Childcare · View Dining Hours
- Trending/popular programs this week
- Upcoming base events
- Search bar across all programs and facilities

**Program Categories**
Each category page (`/resident/fitness`, `/resident/childcare`, `/resident/dining`) shows:
- Program cards with name, hours, price (or FREE badge), eligibility, and Book button
- Filter by eligibility (Active Duty / Family / Retiree)
- Filter by price (Free / Paid)

**Booking Flow (`/resident/booking`)**
- 3-step: Select time slot → Confirm details → Done
- Confirmation screen with booking reference
- No real payment — "Payment processed via MCCS Pay" placeholder

**Real program data to include (from MCCS public site):**
- Semper Fit fitness centers
- Single Marine Program (SMP) recreation
- Child Development Centers (CDC)
- School Age Care
- Liberty Recreation (outdoor equipment rental)
- Mountain Warfare Training trips
- MCCS Bowling Center
- Iron Works Gym
- Splash Zone Aquatic Center
- The Cove (beach recreation)
- Mess halls / Grille dining options
- Marine Mart (retail)

### 5.3 Leadership Dashboard (`/dashboard`)

**Top KPI Bar (always visible)**
| Metric | Synthetic Value | Note |
|---|---|---|
| Monthly Revenue | $4.2M | Pendleton only |
| YTD Revenue | $38.7M | On track vs $42M target |
| Avg CSAT | 4.3 / 5.0 | Across all programs |
| Facility Utilization | 78% | Weighted avg |
| Active Patrons | 22,400 | Unique users this month |
| Bookings This Month | 14,850 | vs 12,200 last month |

**Revenue Tab**
- Line chart: Monthly revenue Jan–Dec, current year vs prior year, by category
- Bar chart: Revenue by program category (Fitness, Childcare, Dining, Recreation, Retail)
- Table: Top 10 revenue-generating programs with MoM trend
- Reinvestment tracker: *"$6.2M reinvested into quality-of-life programs this year"*

**Utilization Tab**
- Heatmap grid: Facilities × days of week, colored by utilization %
- Cards: Top 5 most utilized, Bottom 5 underutilized (flags)
- Peak hours chart per category
- Waitlist pressure indicator (Childcare CDC showing critical)

**Satisfaction Tab**
- CSAT trend line (rolling 12 months)
- NPS gauge: Current score +42
- Program-by-program CSAT table with top positive/negative verbatim themes
- Response volume trend

**Engagement Tab**
- Monthly active patrons trend
- New vs returning patron ratio
- Program enrollment by category (donut chart)
- Retention rate by cohort

**Alerts Feed (sidebar)**
- 🔴 Childcare CDC waitlist at 187 families — action needed
- 🟡 Splash Zone utilization dropped 22% — seasonal or issue?
- 🟢 Semper Fit revenue up 18% MoM — new class schedule working
- 🟡 Iron Works Gym CSAT dipped to 3.8 — equipment complaints

**Enterprise View (teaser panel)**
- Grayed-out table of all MCCS installations nationwide
- Pendleton row is highlighted and active
- Other rows show blurred metrics with lock icon
- CTA: *"Contact Kaizen Labs to expand to your installation"*

---

## 6. Synthetic Data Rules (Internal Consistency)

These rules must hold across all fixtures:

1. **Revenue × transactions must be coherent.** If fitness revenue is $1.1M/month and avg transaction is $45, transactions should be ~24,400.
2. **Utilization drives revenue.** High-utilization facilities should have higher revenue. Childcare CDC is always near 100% (waitlist pressure is the story).
3. **CSAT correlates with engagement.** Programs with CSAT < 4.0 should show declining enrollment.
4. **Trends must be directional.** If January is low and December is high, the line goes up — don't randomize.
5. **Pendleton population anchor.** ~40,000 active duty + ~60,000 family members = 100,000 potential patrons. Active patron count (22,400) is ~22% penetration — realistic.
6. **Revenue reinvestment.** ~16% of annual revenue ($38.7M → $6.2M) flows to QoL programs — matches StormBreaker's stated mission.

---

## 7. Design System

### Colors
- **Primary:** MCCS Red `#C8102E` (Marine Corps red)
- **Secondary:** Navy `#003087`
- **Accent:** Gold `#FFD700`
- **Background:** Zinc-50 `#FAFAFA` (Nova preset)
- **Success:** Emerald-600
- **Warning:** Amber-500
- **Danger:** Red-600

### Typography
- **Font:** Geist (Nova preset default)
- **Dashboard numbers:** Geist Mono for metric values
- **Hierarchy:** 4xl for KPI values, xl for card titles, sm for labels

### Component Conventions
- KPI cards: white background, subtle border, colored trend badge
- Charts: MCCS Red as primary series, Navy as secondary
- Tables: Zebra striping, sortable headers
- Badges: Pill shape — GREEN=Live, GRAY=Coming Soon, RED=Alert

---

## 8. API Routes

All routes return JSON. No auth for demo.

| Route | Method | Returns |
|---|---|---|
| `/api/programs` | GET | Program[] filtered by ?category= |
| `/api/metrics` | GET | Metric[] (top KPIs) |
| `/api/revenue` | GET | RevenueEntry[] filtered by ?year=&category= |
| `/api/utilization` | GET | UtilizationEntry[] |
| `/api/satisfaction` | GET | SatisfactionEntry[] |
| `/api/installations` | GET | Installation[] |

---

## 9. StormBreaker Integration Narrative

Include a subtle but deliberate acknowledgment throughout the UI:

- Footer: *"Built on Operation StormBreaker — MCCS's AWS-based DevSecOps platform"*
- Dashboard header badge: *"ATO Compliant · Zero Trust · FedRAMP Ready"*
- Landing page: StormBreaker logo/badge with tooltip explaining what it is

This signals to Kaizen interviewers that you understand the deployment context — not just the product vision.

---

## 10. Demo Flow (Interview Script)

**Step 1 — Land on `/`**
*"This is the unified MCCS platform for Camp Pendleton. It has two modes — one for Marines and families, one for leadership."*

**Step 2 — Enter Resident Portal**
*"A Marine's spouse needs to find childcare and book a gym class. Right now that's two different websites, maybe a phone call. Here it's one place."*
→ Show program cards, book a fitness class, show confirmation.

**Step 3 — Switch to Leadership Dashboard**
*"Now flip to the command view. This is what the MCCS Director sees — revenue, utilization, satisfaction, all in one place, real-time."*
→ Walk KPI bar → Revenue tab → Alerts feed → Childcare waitlist flag.

**Step 4 — Show Enterprise Teaser**
*"Pendleton is the pilot. But the architecture is built to scale. Every installation gets its own data, leadership gets the enterprise rollup."*
→ Show blurred installation table, highlight Pendleton.

**Step 5 — StormBreaker close**
*"This runs on StormBreaker — MCCS's own AWS landing zone. Kaizen doesn't need a new ATO. It deploys into infrastructure that already has one."*

---

## 11. Build Order for Claude Code

Feed Claude Code this spec as context before each session. Build in this order:

1. `/src/data/` — All JSON fixtures first (data model is the foundation)
2. `/src/types/index.ts` — TypeScript types
3. `/src/app/api/` — All API routes (thin wrappers over JSON fixtures)
4. `/src/components/dashboard/` — KPI cards, charts, tables
5. `/src/app/dashboard/` — Dashboard pages wiring components to API
6. `/src/components/resident/` — Program cards, booking modal
7. `/src/app/resident/` — Resident portal pages
8. `/src/app/page.tsx` — Landing page last (needs both surfaces done)
9. Polish pass — branding, mobile, StormBreaker badges, demo flow QA

---

*Spec version 1.0 — prepared for Kaizen Labs Head of Federal interview demo*
*Installation: Camp Pendleton, CA | Framework: Next.js 16 | Deployment target: Operation StormBreaker (MCCS AWS)*
