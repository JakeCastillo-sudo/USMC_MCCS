# Claude Code Prompt — Step 3: Dashboard Components & Pages

Paste this entire prompt into Claude Code after Prompt 02 has finished and all API routes return valid JSON.

---

Reference SPEC.md in the project root. TypeScript types are in `src/types/index.ts`. API routes are live at `/api/*`. Utility functions are in `src/lib/utils.ts`. Now build the full Leadership Dashboard — components first, then pages.

Design system (from SPEC.md Section 7):
- Primary: MCCS Red `#C8102E`
- Secondary: Navy `#003087`
- Accent: Gold `#FFD700`
- Font: Geist (already installed via Nova preset)
- KPI values: Geist Mono for numerical displays
- Background: zinc-50

---

## PART A — Layout Components

### `src/components/layout/NavBar.tsx`

Top navigation bar. Fixed, full width, z-50.

Left side:
- MCCS logo text: "MCCS" in bold MCCS Red, followed by "Camp Pendleton" in zinc-500
- Subtitle badge: small pill badge reading "Powered by Kaizen Labs" in navy background, white text

Right side:
- Role switcher toggle: two pill buttons — "Resident Portal" and "Leadership Dashboard"
  - Active state: filled MCCS Red background, white text
  - Inactive: ghost/outline
  - Clicking switches between `/resident` and `/dashboard` routes using Next.js router
- Small badge: "🔒 ATO Compliant" in zinc-100, zinc-600 text, with a shield icon (Lucide: `ShieldCheck`)

Props: `{ activeRole: "resident" | "dashboard" }`

### `src/components/layout/DashboardSidebar.tsx`

Left sidebar for dashboard pages. Fixed, 240px wide, full height. Hidden on mobile (md:block).

Logo area at top — same as NavBar but stacked vertically.

Navigation links (use Lucide icons):
- Overview → `/dashboard` — LayoutDashboard icon
- Revenue → `/dashboard/revenue` — DollarSign icon
- Utilization → `/dashboard/utilization` — Activity icon
- Satisfaction → `/dashboard/satisfaction` — Star icon
- Engagement → `/dashboard/engagement` — Users icon

Active link: MCCS Red left border, light red background `bg-red-50`, red text.
Inactive: zinc-600 text, hover:bg-zinc-100.

Bottom of sidebar:
- StormBreaker badge: small card with lightning bolt icon, text "Built on Operation StormBreaker", subtext "MCCS AWS · Zero Trust · FedRAMP Ready", dark navy background, white text.
- Version tag: "Kaizen Labs Demo v1.0" in zinc-400, text-xs.

---

## PART B — Dashboard KPI Components

### `src/components/dashboard/KPICard.tsx`

Props:
```typescript
interface KPICardProps {
  metric: Metric
  className?: string
}
```

Layout:
- White card, subtle border `border-zinc-200`, rounded-xl, p-6
- Label in zinc-500, text-sm, uppercase tracking-wide
- Value in text-3xl font-bold font-mono (Geist Mono feel — use `font-mono`)
  - Currency: formatted as "$4.2M" (compact) using `formatCurrency`
  - Percent: "78.4%"
  - Score: "4.3 / 5.0"
  - Count: "22,400"
- Trend badge below value:
  - Up + positive: green arrow up + percentage, `text-emerald-600 bg-emerald-50`
  - Down + negative: red arrow down, `text-red-600 bg-red-50`
  - Neutral: zinc
  - Show: "↑ 8.3% vs last month"
- Sparkline at bottom: use Recharts `<AreaChart>` minimal, no axes, no tooltip, height 48px
  - Color: MCCS Red `#C8102E` with 20% opacity fill
  - Stroke: MCCS Red

### `src/components/dashboard/KPIBar.tsx`

Horizontal row of KPI cards. Fetches from `/api/metrics` on mount.

```typescript
// Fetch on mount
const [metrics, setMetrics] = useState<Metric[]>([])
useEffect(() => {
  fetch('/api/metrics').then(r => r.json()).then(d => setMetrics(d.data))
}, [])
```

Renders a responsive grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4`

Show loading skeleton (shadcn Skeleton) while fetching.

Cards to show (in order): Monthly Revenue, YTD Revenue, Avg CSAT, Facility Utilization, Active Patrons, Bookings This Month.

### `src/components/dashboard/RevenueChart.tsx`

Props: `{ view: "monthly" | "category" }`

Fetches from `/api/revenue?view={view}`.

**Monthly view** — Recharts `<LineChart>`:
- X axis: month labels (Jan, Feb, ...)
- Y axis: formatted currency (compact)
- Two lines: Current Year (MCCS Red `#C8102E`) and Prior Year (Navy `#003087`, dashed)
- Tooltip showing both values + YoY difference
- Legend at top right

**Category view** — Recharts `<BarChart>`:
- X axis: category labels (Fitness & Recreation, Childcare, Dining, etc.)
- Y axis: formatted currency
- Single bar series in MCCS Red
- Tooltip showing amount + transaction count
- Category bars sorted by revenue descending

Both views:
- White card container, rounded-xl, p-6
- Card header: title + view toggle tabs (Monthly | By Category) using shadcn Tabs
- Height: 300px chart area
- Responsive: `<ResponsiveContainer width="100%" height={300}>`

### `src/components/dashboard/UtilizationGrid.tsx`

Fetches from `/api/utilization?sort=capacity_desc`.

Renders a grid of facility cards `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`.

Each facility card:
- Facility name (bold)
- Category badge (pill, colored by category)
- Utilization bar: full-width progress bar
  - 0–60%: zinc/gray fill
  - 61–80%: amber fill
  - 81–95%: emerald fill
  - 96–100%: MCCS Red fill (critical)
- Utilization % number (large, font-mono)
- Peak hour label: "Peak: 6:00 AM"
- Avg daily visits: "380 visits/day"
- Trend badge: ↑ or ↓ vs prior month
- If `waitlistCount` exists: red "⚠ 187 on waitlist" badge

Top section: two highlight cards before the grid
- "🏆 Top Performer" — Paige Field House at 94%
- "⚠ Needs Attention" — MCAS Fitness Center at 39%

### `src/components/dashboard/SatisfactionTable.tsx`

Fetches from `/api/satisfaction?sort=csat_desc`.

Renders shadcn `<Table>` with columns:
- Program Name
- Category (badge)
- CSAT (colored score: green ≥4.3, amber 3.8–4.2, red <3.8)
- NPS (colored: green ≥30, amber 0–29, red <0)
- Responses (count)
- Top Positive (truncated, zinc-600 italic)
- Top Negative (truncated, zinc-600 italic)
- Trend (↑↓ badge)

Above table: three summary stat pills
- "Overall CSAT: 4.3 / 5.0" (green)
- "Overall NPS: +42" (green)
- "8,420 responses this period"

Table is sortable by clicking column headers (client-side sort).
Show top 10 by default with "Show all" toggle.

### `src/components/dashboard/AlertsFeed.tsx`

Fetches from `/api/alerts`.

Renders a vertical list of alert cards. Each card:
- Left colored border (4px): red=critical, amber=warning, emerald=success, blue=info
- Level icon (Lucide): `AlertCircle`=critical, `AlertTriangle`=warning, `CheckCircle2`=success, `Info`=info
- Title in bold
- Message in zinc-600
- Category badge (small pill)
- Metric value chip (e.g. "187 families" or "CSAT 3.7")
- Action link if `action` field exists: "Take Action →" in MCCS Red

Sort order: critical first, then warning, then success, then info.

### `src/components/dashboard/InstallationTable.tsx`

Fetches from `/api/installations`.

Renders a table of all installations.

Live row (Camp Pendleton):
- Full data visible
- "● LIVE" green badge
- Row highlighted with subtle `bg-red-50` background
- All metric columns populated

Coming-soon rows:
- Name and location visible
- All metric columns show blurred placeholder "••••" or a lock icon `<Lock className="w-4 h-4 text-zinc-300" />`
- Greyed out: `opacity-50`
- "Coming Soon" badge in zinc

At bottom of table: CTA banner
```
"Ready to expand to your installation?"
[Contact Kaizen Labs →]  (button, MCCS Red)
```

### `src/components/dashboard/ReinvestmentTracker.tsx`

No props. Reads reinvestment metric from `/api/metrics`.

A single highlight card:
- Header: "QoL Program Reinvestment" with a heart icon
- Large number: "$6.2M" in MCCS Red, font-mono
- Subtext: "reinvested into quality-of-life programs this year"
- Progress bar: $6.2M of $6.5M target = 95% filled (MCCS Red)
- Footer note: "Funded directly from MCCS service revenue per Operation StormBreaker mission"
- Small StormBreaker lightning bolt icon in corner

---

## PART C — Dashboard Pages

### `src/app/dashboard/layout.tsx`

Wraps all dashboard pages. Renders:
- `<NavBar activeRole="dashboard" />`
- `<DashboardSidebar />` on left (fixed, 240px)
- Main content area with left margin `ml-60` (desktop) and top padding `pt-16` (for fixed nav)
- Mobile: sidebar hidden, nav shows hamburger (basic — just hide sidebar on sm)

### `src/app/dashboard/page.tsx` — Overview

Page title: "MCCS Command Dashboard — Camp Pendleton"
Subtitle: "Live operational view · May 2026"

Layout (top to bottom):
1. `<KPIBar />` — full width
2. Two-column grid (lg:grid-cols-3):
   - Left 2/3: `<RevenueChart view="monthly" />`
   - Right 1/3: `<AlertsFeed />`
3. `<ReinvestmentTracker />` — full width highlight card
4. Two-column grid:
   - Left: `<SatisfactionTable />` (top 5 only, with "See full report →" link)
   - Right: `<UtilizationGrid />` (top 6 only, with "See all facilities →" link)
5. `<InstallationTable />` — full width, enterprise teaser

### `src/app/dashboard/revenue/page.tsx`

Page title: "Revenue Analysis"

Layout:
1. KPI strip — just 3 cards: Monthly Revenue, YTD Revenue, Reinvestment
2. `<RevenueChart view="monthly" />` — full width, large (height 400px)
3. `<RevenueChart view="category" />` — full width
4. Top 10 programs by revenue — shadcn Table:
   - Columns: Program, Category, Monthly Revenue, MoM Change, YTD Total
   - Sorted by monthly revenue descending
   - Color-coded MoM change (green/red)
5. `<ReinvestmentTracker />` at bottom

### `src/app/dashboard/utilization/page.tsx`

Page title: "Facility Utilization"

Layout:
1. KPI strip — just: Avg Utilization %, Critical Alerts count, Total Facilities
2. Alert banner if any critical alerts: red banner "2 facilities at critical capacity — action required"
3. `<UtilizationGrid />` — full grid, all facilities
4. Heatmap placeholder card: "Day-of-Week Utilization Heatmap — Coming in Phase 2" (styled nicely, not a broken component)

### `src/app/dashboard/satisfaction/page.tsx`

Page title: "Customer Satisfaction & Feedback"

Layout:
1. Three stat pills: Overall CSAT, NPS, Response Count
2. `<SatisfactionTable />` — full table, all programs
3. Two cards side by side:
   - "Top Performer" card: ITT / Latitudes Travel, CSAT 4.8, NPS +71
   - "Needs Attention" card: 21 Area Pool, CSAT 3.7, trending down

### `src/app/dashboard/engagement/page.tsx`

Page title: "Patron Engagement"

Layout:
1. KPI strip — Active Patrons, Bookings This Month, New vs Returning ratio
2. Placeholder chart card: "Monthly Active Patron Trend — Recharts LineChart"
   - Use the `sparkline` data from the Active Patrons metric, rendered as a full LineChart with axes
   - X axis: last 12 month labels
   - Y axis: patron counts
   - Line in MCCS Red
3. Placeholder donut card: "Enrollment by Category"
   - Use Recharts `<PieChart>` with a donut shape (`innerRadius={60}`)
   - One slice per ProgramCategory
   - Colors: Red, Navy, Gold, Emerald, Amber, Zinc
   - Legend below
4. `<AlertsFeed />` — filtered to info + success only

---

## PART D — Shared Polish

### Loading States
Every component that fetches data must show a loading skeleton while the fetch is pending. Use shadcn `<Skeleton>` component:
```tsx
if (loading) return (
  <div className="space-y-3">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
  </div>
)
```

### Error States
Every fetch must have a try/catch. On error show:
```tsx
<div className="text-red-600 text-sm p-4 border border-red-200 rounded-lg bg-red-50">
  Failed to load data. Please refresh.
</div>
```

### Empty States
If a filtered query returns no results:
```tsx
<div className="text-zinc-400 text-center py-12">
  No results found for this filter.
</div>
```

---

## VERIFICATION

After generating all files, confirm in browser:

1. `http://localhost:3000/dashboard` — Overview page loads with all sections
2. `http://localhost:3000/dashboard/revenue` — Revenue charts render with real data
3. `http://localhost:3000/dashboard/utilization` — All facilities grid loads
4. `http://localhost:3000/dashboard/satisfaction` — Full table renders, CSAT colors correct
5. No TypeScript errors: `npx tsc --noEmit`
6. No console errors in browser dev tools

---

*Ready for Prompt 04 — Resident Portal after dashboard is verified.*
