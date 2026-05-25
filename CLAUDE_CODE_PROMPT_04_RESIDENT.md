# Claude Code Prompt — Step 4: Resident Portal

Paste this entire prompt into Claude Code after Prompt 03 is verified and the dashboard is rendering correctly.

---

Reference SPEC.md in the project root. TypeScript types are in `src/types/index.ts`. API routes are live at `/api/*`. Dashboard is complete. Now build the Resident Portal — the citizen-facing surface of the app scoped to Camp Pendleton.

Design philosophy for the resident portal: **warm, approachable, mobile-first**. This is not a dashboard — it's a service app. Think less enterprise software, more consumer app. Clean cards, generous spacing, bold category colors, fast to scan on a phone.

Same color system as dashboard but used differently:
- MCCS Red `#C8102E` — primary CTAs and header only
- Navy `#003087` — section headers and active states
- Gold `#FFD700` — accent highlights (featured programs, badges)
- Background: white with zinc-50 section breaks
- Cards: white, rounded-2xl, subtle shadow (not border)

---

## PART A — Resident Components

### `src/components/resident/CategoryTile.tsx`

Props:
```typescript
interface CategoryTileProps {
  category: ProgramCategory
  label: string
  icon: string          // Lucide icon name
  count: number         // number of programs in category
  href: string
  color: string         // tailwind bg color class
}
```

Large tappable tile. Rounded-2xl. Colored background (soft tint of category color).
- Icon centered, large (w-10 h-10), category color
- Label below icon, font-semibold
- Count badge: "12 programs" in small pill
- Full card is a Next.js `<Link>` — entire surface tappable
- Hover: slight scale transform `hover:scale-105 transition-transform`
- Active/pressed feel: `active:scale-95`

Category color mapping:
- fitness → `bg-red-50` with `text-red-600` icon
- childcare → `bg-blue-50` with `text-blue-600` icon
- dining → `bg-amber-50` with `text-amber-600` icon
- recreation → `bg-emerald-50` with `text-emerald-600` icon
- retail → `bg-purple-50` with `text-purple-600` icon
- lodging → `bg-cyan-50` with `text-cyan-600` icon

### `src/components/resident/ProgramCard.tsx`

Props:
```typescript
interface ProgramCardProps {
  program: Program
  onBook?: (program: Program) => void
  compact?: boolean     // smaller version for search results
}
```

Full card:
- White background, rounded-2xl, shadow-sm, p-5
- Top row: program name (font-semibold, text-lg) + category badge (small pill)
- Hours row: Clock icon + hours string, zinc-500 text-sm
- Eligibility row: Users icon + eligibility tags as small chips
- Description: 2-line truncated, zinc-600 text-sm
- Bottom row:
  - Price: either "FREE" badge (emerald) or "$25.00" in font-mono
  - If bookable: "Book Now →" button (MCCS Red, filled)
  - If not bookable: "View Details →" button (outline, navy)
- If program has waitlist (CDC programs): amber "Waitlist Available" badge instead of Book button

Compact version (for search results):
- Single row: icon + name + category badge + price + book button
- No description, no hours

### `src/components/resident/BookingModal.tsx`

Props:
```typescript
interface BookingModalProps {
  program: Program | null
  open: boolean
  onClose: () => void
}
```

shadcn Dialog component. Three-step flow controlled by local `step` state (1, 2, 3).

**Step 1 — Select Time**
- Program name + category badge at top
- Date picker: horizontal scrollable row of the next 7 days
  - Each day: pill button with day abbreviation + date number
  - Selected: MCCS Red background, white text
  - Unavailable: zinc-200, line-through
- Time slot grid: 2-column grid of available time slots
  - Each slot: "9:00 AM", selectable pill
  - Selected: Navy background, white text
  - Slots to show: generate fake slots from 6am–8pm in 1hr increments
  - Mark 3–4 random slots as "Full" (zinc-200, disabled)
- "Continue →" button (MCCS Red, full width) — disabled until date + time selected

**Step 2 — Confirm Details**
- Summary card: program name, date, time, price
- Patron info (pre-filled for demo):
  - Name: "SSgt Jacob Martinez" (use a realistic Marine name)
  - ID: "USMC-2847391"
  - Eligibility: "Active Duty"
- If paid: "Payment Method: ⬛ MCCS Pay ···· 4521" (fake card)
- Cancellation policy note: "Cancel up to 24 hours before for full refund"
- Back button + "Confirm Booking →" button (MCCS Red)

**Step 3 — Confirmation**
- Large green checkmark circle (CheckCircle2 icon, w-16 h-16, emerald-500)
- "Booking Confirmed!" in text-2xl font-bold
- Booking reference: "MCCS-PND-" + random 6-digit number
- Summary: program, date, time
- "Add to Calendar" button (outline, navy) — no-op for demo
- "Book Another" button (ghost) — resets to step 1
- "Done" button (MCCS Red) — closes modal

### `src/components/resident/SearchBar.tsx`

Props: `{ onResults: (programs: Program[]) => void, placeholder?: string }`

Full-width search input with:
- Search icon (Lucide `Search`) on left inside input
- Placeholder: "Search fitness classes, dining, childcare..."
- Clear button (X icon) appears when text is entered
- Debounced 300ms — calls `/api/programs?q={query}` on each change
- Below input: category filter chips (horizontal scroll on mobile)
  - "All" | "Fitness" | "Childcare" | "Dining" | "Recreation" | "Lodging"
  - Selected chip: MCCS Red, white text. Unselected: zinc-100, zinc-700 text
  - Clicking a chip adds `?category=` param to the search call

### `src/components/resident/QuickActions.tsx`

No props. Static component.

A 2×2 grid of quick action cards (or horizontal scroll on mobile):
1. "Book a Fitness Class" — Dumbbell icon, red, links to `/resident/fitness`
2. "Find Childcare" — Baby icon, blue, links to `/resident/childcare`
3. "Reserve a Facility" — Calendar icon, emerald, links to `/resident/recreation`
4. "View Dining Hours" — UtensilsCrossed icon, amber, links to `/resident/dining`

Each: colored icon on left, label + subtext on right, chevron on far right.
Subtext examples: "12 centers available", "3 restaurants on base", "187 families waitlisted" (red for childcare to signal urgency).
Full row is tappable — Next.js Link.

### `src/components/resident/FeaturedPrograms.tsx`

No props. Fetches `/api/programs?bookable=true` and displays top 4 by category diversity.

Section header: "Featured This Week" with a gold star icon.

Horizontal scroll row of featured program cards (ProgramCard compact=false but smaller than full page version):
- 4 cards: one from fitness, one recreation, one dining, one childcare
- Each card has a "FEATURED" gold badge in top-right corner
- Cards are 280px wide, don't shrink — horizontal scroll on mobile

### `src/components/resident/ResidentNavBar.tsx`

Mobile-optimized top nav for resident pages.

Left: back arrow (if not on home) or MCCS logo
Center: page title (e.g. "Fitness & Recreation")
Right: Search icon button that expands SearchBar, + profile avatar placeholder

Bottom mobile tab bar (fixed, bottom-0):
- Home | Fitness | Childcare | Dining | More
- Active tab: MCCS Red icon + label. Inactive: zinc-400

---

## PART B — Resident Pages

### `src/app/resident/layout.tsx`

Wraps all resident pages.
- `<NavBar activeRole="resident" />` at top (same shared NavBar from dashboard)
- Mobile bottom tab bar via `<ResidentNavBar />`
- Main content: `pt-16 pb-20` (space for fixed top + bottom nav)
- Max width: `max-w-2xl mx-auto` — this is a mobile-first app, constrain width on desktop

### `src/app/resident/page.tsx` — Home

**Hero section:**
- Background: deep navy `#003087` with subtle diagonal texture or gradient
- MCCS Eagle Globe Anchor emoji or SVG placeholder
- Headline: "Welcome to MCCS Camp Pendleton"
- Subheadline: "Everything you need, all in one place"
- Search bar (`<SearchBar />`) overlapping the bottom of hero section
- Greeting if time-aware: "Good morning, Marine" (before noon) / "Good afternoon" / "Good evening"

**Quick Actions section:**
- Section header: "What are you looking for?"
- `<QuickActions />`

**Featured Programs section:**
- `<FeaturedPrograms />`

**Alerts/Notices section** (if any critical alerts):
- Fetch `/api/alerts?level=critical`
- If CDC waitlist alert exists: amber notice card
  - "⚠ Childcare Waitlist: 187 families are currently waitlisted for CDC-1 Mainside. Join the waitlist to be notified of openings."
  - "Join Waitlist →" button

**Category Grid section:**
- Section header: "Browse All Services"
- `<CategoryTile />` grid — 2 columns on mobile, 3 on desktop
- All 6 categories: Fitness, Childcare, Dining, Recreation, Shopping, Lodging

**Footer:**
- "MCCS Camp Pendleton · pendleton.usmc-mccs.org"
- "Built on Operation StormBreaker" badge (small, navy)
- Crisis line: "Military/Veterans Crisis Line: Dial 988" in small zinc text

### `src/app/resident/fitness/page.tsx`

Page header: "Fitness & Recreation" with Dumbbell icon

Sub-nav tabs (horizontal scroll): "All" | "Fitness Centers" | "Group Classes" | "Programs" | "Races"

Fetches `/api/programs?category=fitness`

**Highlight card** at top:
- "Paige Field House — Flagship Facility"
- Hours, location, "24/7 Access Available" badge
- "View Details" button

Program grid below: `<ProgramCard />` for each fitness program
- Filter by active tab
- Show utilization badge on each fitness center card: "88% capacity" or "94% — High Demand"

Sticky filter bar (below tabs):
- "Free Only" toggle
- "24/7 Access" toggle  
- "Available Now" toggle (fake — always shows some results)

### `src/app/resident/childcare/page.tsx`

Page header: "Child & Youth Programs" with Baby icon

**Critical notice banner** at very top (always visible):
- Amber background, AlertTriangle icon
- "High Demand: CDC waitlists are currently active. Register early."
- "Check Availability →" scrolls to CDC section

**CDC Section** — "Child Development Centers":
- 3 CDC cards: CDC-1 Mainside, CDC-2 Las Pulgas, CDC-3 San Onofre
- Each card shows:
  - Name + area
  - Age range: "6 weeks – 5 years"
  - Weekly rate: "$180–$250/week based on income"
  - Capacity bar (like utilization but labeled "Availability")
  - CDC-1: Red bar "WAITLIST — 187 families"
  - CDC-2: Red bar "WAITLIST — 43 families"  
  - CDC-3: Amber bar "Limited Availability"
  - CTA: "Join Waitlist" (CDC-1, CDC-2) or "Check Availability" (CDC-3)

**Other Programs Section:**
- School Age Care card
- Youth & Teen Program card (free badge)
- New Parent Support card (free badge)
- Family Child Care (off-base referral network)

Fetches `/api/programs?category=childcare` for data.

### `src/app/resident/dining/page.tsx`

Page header: "Dining & Entertainment" with UtensilsCrossed icon

**Today's Hours** strip at top:
- Horizontal scroll of dining venue pills showing today's open/closed status
- Green dot = open, red dot = closed
- Iron Mike's: Open until 9pm | Pub 1795: Open until 11pm | Windmill Canyon: Open until 10pm

**Restaurants section:**
- 3 restaurant cards: Iron Mike's, Pub 1795, Windmill Canyon
- Each: name, description, hours, "Make Reservation" button (triggers BookingModal)
- CSAT score badge on each card: "⭐ 4.2" etc

**Private Events section:**
- Smaller cards for: Pacific Views Event Center, The Vineyard, Eagle's Landing, La Casa Del Mar, San Onofre Beach Club
- "Request Event Space →" CTA on each (no-op for demo)

**Fast Food & Food Trucks section:**
- Simple list with hours

Fetches `/api/programs?category=dining`.

### `src/app/resident/recreation/page.tsx`

Page header: "Recreation & Outdoor" with Trees icon (or Mountain)

**Featured outdoor experiences** — hero-style cards for:
- Del Mar Beach & Marina — "Book a Beach Cottage"
- Lake O'Neill — "Camping & Fishing"
- Marine Memorial Golf Course — "Book a Tee Time"
- Stepp Stables — "Trail Rides"

**Indoor Recreation:**
- Leatherneck Lanes — "Book a Lane" with price badge
- Auto Skills Center
- Active Duty Recreation Centers

**Aquatics:**
- 13 Area Pool + 21 Area Pool cards with hours and utilization

**Equipment Rental (Recreation Checkout):**
- "Rent camping gear, kayaks, bikes and more"
- "Browse Equipment →" CTA

All bookable items trigger `<BookingModal />`.

Fetches `/api/programs?category=recreation`.

---

## PART C — Landing Page

### `src/app/page.tsx` — Role Selector

This is the true entry point. No nav. Fullscreen.

**Background:** Dark navy `#003087` fullscreen with subtle pattern or gradient from navy to near-black.

**Center content** (vertically + horizontally centered):
- MCCS wordmark: "MCCS" large, bold, white
- Subtext: "Marine Corps Community Services"
- Smaller: "Camp Pendleton, California"
- Divider line

**Role selection cards** — two large cards side by side (stacked on mobile):

Card 1 — Resident:
- Icon: `Home` (Lucide), white, large
- Title: "I'm a Marine or Family Member"
- Description: "Find and book MCCS programs, dining, childcare, and recreation at Camp Pendleton"
- Button: "Enter Resident Portal →" (white background, navy text)
- Hover: scale up slightly, white glow

Card 2 — Leadership:
- Icon: `LayoutDashboard` (Lucide), white, large
- Title: "I'm MCCS Leadership"
- Description: "View revenue, utilization, satisfaction metrics, and operational alerts across programs"
- Button: "Enter Command Dashboard →" (MCCS Red background, white text)
- Hover: scale up, red glow

**Bottom of page:**
- StormBreaker badge: lightning bolt icon + "Deployed on Operation StormBreaker · MCCS AWS Landing Zone"
- Kaizen Labs credit: "Platform by Kaizen Labs" with subtle link styling
- Small: "ATO Compliant · Zero Trust · FedRAMP Ready" compliance chips

Clicking either card navigates to `/resident` or `/dashboard`.

---

## PART D — Polish Pass

### Metadata (`src/app/layout.tsx`)
Update the root layout metadata:
```typescript
export const metadata = {
  title: "MCCS Camp Pendleton",
  description: "Marine Corps Community Services — Camp Pendleton unified platform powered by Kaizen Labs",
}
```

### Global CSS (`src/app/globals.css`)
Add after existing Tailwind directives:
```css
:root {
  --mccs-red: #C8102E;
  --mccs-navy: #003087;
  --mccs-gold: #FFD700;
}

/* Smooth scrolling */
html { scroll-behavior: smooth; }

/* Mobile tap highlight removal */
* { -webkit-tap-highlight-color: transparent; }

/* Font mono for metric values */
.font-metric {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
```

### Responsive Breakpoints
Every page must be usable at 390px width (iPhone 15) and 1440px width (desktop).
- Mobile: single column, bottom tab nav, full-width cards
- Desktop: multi-column grids, sidebar nav, constrained max-width

---

## VERIFICATION

After generating, verify in browser:

1. `http://localhost:3000` — Landing page, both role cards visible, clicking works
2. `http://localhost:3000/resident` — Home page loads, all sections present
3. `http://localhost:3000/resident/fitness` — Programs load, filter tabs work
4. `http://localhost:3000/resident/childcare` — Waitlist banners visible
5. `http://localhost:3000/resident/dining` — Restaurant cards with reservation buttons
6. Click "Book Now" on any program — modal opens, 3 steps work, confirmation shows
7. Role switcher in NavBar switches between `/resident` and `/dashboard`
8. Mobile view (browser DevTools → iPhone 15) — bottom tab bar visible, single column layout

---

*Ready for Prompt 05 — Polish, Branding & Demo Flow after resident portal is verified.*
