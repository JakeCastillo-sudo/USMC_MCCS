# Claude Code Prompt — Step 1: Build All Data Fixtures

Paste this entire prompt into Claude Code.

---

Reference SPEC.md in the project root. Build all JSON fixture files in `src/data/`. Use the real Camp Pendleton facility and program names listed below — scraped directly from pendleton.usmc-mccs.org. Make all synthetic metrics internally consistent per the data rules in Section 6 of SPEC.md.

---

## REAL FACILITY & PROGRAM DATA (scraped from pendleton.usmc-mccs.org)

### FITNESS CENTERS (12 real facilities)
- Fitness Center – 21 Area | BLDG 210750 | Mon–Fri 5am–10pm, Sat–Sun 7am–4pm | 24/7 access available
- Fitness Center – 31 Area | BLDG 31A30 | Mon–Fri 5:30am–9pm, Sat–Sun 7am–2pm | 24/7 access
- Fitness Center – 33 Area | BLDG 330362 | Mon–Fri 5am–9pm, Sat–Sun 8am–3pm | 24/7 access
- Fitness Center – 41 Area | BLDG 4159 | Mon–Fri 5am–9pm, Sat–Sun 8am–6pm | 24/7 access
- Fitness Center – 43 Area | BLDG 430320 | Mon–Fri 5am–9pm, Sat–Sun 9am–4pm | 24/7 access
- Fitness Center – 52 Area | BLDG 520415 | Mon–Fri 5am–8pm, Sat–Sun 6am–1pm | 24/7 access
- Fitness Center – 53 Area | BLDG 530301 | Mon–Fri 5am–8pm, Sat–Sun 8am–3pm | 24/7 access
- Fitness Center – MCAS | BLDG 2369 | Mon–Fri 5am–8pm, Sat–Sun Closed | 24/7 access
- Fitness Center – 14 Area | BLDG 14013 | Mon–Fri 5am–8pm, Sat–Sun Closed | 24/7 access
- Fitness Center – 22 Area | BLDG 22160 | Mon–Fri 5am–9pm, Sat–Sun 8am–3pm | 24/7 access
- Fitness Center – 62 Area | BLDG 620411 | Mon–Fri 5am–8pm, Sat–Sun 8am–3pm | 24/7 access
- Paige Field House | 13th Street | Mon–Fri 5am–10pm, Sat–Sun 6am–8pm | 24/7 access | Primary large facility

### FITNESS PROGRAMS
- Group Exercise Classes
- Human Performance Program
- Warrior Athlete Readiness & Resilience (WARR)
- Force Fitness Instructor Program
- Massage Services
- Hard Corps Race Series
- Races & Family Fitness Events

### INDOOR RECREATION
- Active Duty Recreation Centers
- Leatherneck Lanes (bowling)
- Auto Skills Center

### OUTDOOR RECREATION
- Marine Memorial Golf Course
- Lake O'Neill (fishing, camping)
- Del Mar Beach & Marina
- San Onofre Beach
- Outdoor Adventures
- Recreation Checkout (equipment rental)
- Recreational Shooting Range
- Stepp Stables (equestrian)
- 13 Area Pool
- 21 Area Pool

### AQUATICS
- 13 Area Pool
- 21 Area Pool
- Beach Safety Program
- Ocean Lifeguards

### SPORTS
- Adult Sports Leagues
- All-Marine Sports
- Youth Sports
- Athletic Fields

### DINING — RESTAURANTS
- Iron Mike's (full-service restaurant, private events)
- Pub 1795 (bar & grill, private events)
- Windmill Canyon (restaurant, private events)

### DINING — SPECIAL EVENTS / PRIVATE VENUES
- Pacific Views Event Center
- The Vineyard
- Eagle's Landing
- La Casa Del Mar
- San Onofre Beach Club
- Catering Services

### DINING — FAST FOOD & OTHER
- Fast Food outlets (on-base chains)
- Food Trucks program

### LODGING
- Pacific Views (Inns of the Corps)
- Ward Lodge (Inns of the Corps)
- Del Mar Beach Cottages
- San Onofre Beach Cottages
- Lake O'Neill Campground & RV
- Del Mar Beach RV Sites

### CHILD & YOUTH PROGRAMS
- Child Development Centers (CDC) — multiple locations on base
- Family Child Care
- School Age Care
- Youth & Teen Program
- New Parent Support
- School Liaison Program
- Exceptional Family Member Program (EFMP)
- Youth Sports

### MARINE & FAMILY SUPPORT
- Information, Referral & Relocation
- Libraries (on-base)
- Personal Financial Management
- Single Marine Program (SMP)
- Transition Readiness Program
- Marine Corps Family Team Building
- L.I.N.K.S. Program
- Families OverComing Under Stress (FOCUS)
- Family Readiness Program
- Readiness & Deployment Support
- Retired Affairs
- SkillBridge Program
- Career Services
- Voluntary Education

### SHOPPING
- Marine Corps Exchange (MCX) — main store
- Uniform & Clothing Services
- Marine Marts (convenience stores, multiple locations)
- MCX24 Micro Marts
- Fuel Stations

### SERVICES
- Automotive Services
- Barbershops & Hair Salon
- Dry Cleaning / Laundromat
- GameStop
- iDevicePROS
- M'Bling Jewelry & Watch Repair
- Optometry
- Postal & Shipping
- Self Storage / RV Storage
- Tax Services

### ENTERTAINMENT
- Base Theater (movies)
- TV, Gaming & Wireless Internet lounges
- Information, Tickets & Tours (Latitudes Travel / ITT)
- Event Planning & Multimedia Services

### DEALS & PROGRAMS
- Chesty Deals (discount program)
- Veterans Access Program

---

## FILES TO CREATE

### 1. `src/data/programs.json`
Array of Program objects. Include at minimum:
- All 12 fitness centers as individual bookable facilities (category: "fitness")
- Paige Field House as the flagship fitness facility
- Group Exercise, WARR, Massage Services as bookable fitness programs
- Leatherneck Lanes (category: "recreation", bookable, paid ~$4/game)
- Marine Memorial Golf Course (category: "recreation", bookable, paid ~$25/round)
- Lake O'Neill day passes (category: "recreation", bookable, paid ~$5)
- Del Mar Beach Cottages (category: "recreation", bookable, paid ~$80-120/night)
- San Onofre Beach Cottages (category: "recreation", bookable, paid ~$70-100/night)
- 13 Area Pool & 21 Area Pool (category: "recreation", free for eligible)
- Outdoor Adventures equipment rental (category: "recreation", paid varies)
- Stepp Stables trail rides (category: "recreation", paid ~$25/ride)
- Iron Mike's (category: "dining", reservations, paid)
- Pub 1795 (category: "dining", no reservation needed, paid)
- Windmill Canyon (category: "dining", reservations, paid)
- Pacific Views Event Center (category: "dining", bookable, paid)
- 3 CDC locations: CDC-1 Mainside, CDC-2 Las Pulgas, CDC-3 San Onofre (category: "childcare", bookable, paid weekly rate ~$180-250)
- School Age Care (category: "childcare", bookable, paid ~$120/week)
- Youth & Teen Program (category: "childcare", free/low cost)
- Single Marine Program rec events (category: "recreation", free)
- MCX main store (category: "retail", no booking)
- Marine Mart (category: "retail", no booking)
- ITT / Latitudes Travel desk (category: "recreation", bookable)

Each program must have: id, name, category, facility, description, hours, eligibility[], bookable, price (number or null), tags[]

### 2. `src/data/facilities.json`
Array of Facility objects. One per physical location. Include building number, area, coordinates (approximate), category, capacity (persons), and which programs run there.

### 3. `src/data/metrics.json`
Top-level KPI array matching Section 5.3 of SPEC.md:

```json
[
  {
    "id": "monthly-revenue",
    "label": "Monthly Revenue",
    "value": 4200000,
    "unit": "currency",
    "trend": 8.3,
    "trendDirection": "up",
    "trendSentiment": "positive",
    "sparkline": [3600000, 3750000, 3820000, 3700000, 3900000, 3800000, 4000000, 3950000, 4100000, 4050000, 4150000, 4200000]
  },
  ... (include all 6 KPIs from spec)
]
```

Active Patrons sparkline must trend from ~18,000 in Jan to 22,400 in current month.
Bookings sparkline must show seasonal peaks in summer months.

### 4. `src/data/revenue.json`
Array of RevenueEntry objects — one per month per category for the last 24 months.

Revenue breakdown targets (monthly, current):
- fitness: $1,100,000 (largest — 12 facilities + programs)
- childcare: $980,000 (3 CDCs + SAC, high utilization)
- dining: $820,000 (restaurants + events + catering)
- recreation: $640,000 (golf, bowling, beach, stables, rentals)
- retail: $520,000 (MCX + Marine Mart)
- lodging: $140,000 (cottages + lodge)
TOTAL: ~$4,200,000/month

Prior year same month: ~$3,870,000 (8.5% growth YoY)
Make monthly values trend upward with slight summer seasonality spike (June–August +12%).

### 5. `src/data/utilization.json`
Array of UtilizationEntry per facility. Key values:

- Paige Field House: 94% utilization, peak 6am, 380 avg daily visits
- CDC-1 Mainside: 99% (WAITLIST — 187 families), peak 8am
- CDC-2 Las Pulgas: 97% (waitlist — 43 families)
- CDC-3 San Onofre: 91%, peak 7:30am
- 21 Area Fitness Center: 88%, peak 5:30am
- 41 Area Fitness Center: 82%, peak 6am
- Iron Mike's: 76%, peak 12pm
- Leatherneck Lanes: 71%, peak 7pm Fri/Sat
- Marine Memorial Golf Course: 68%, peak 9am weekends
- Del Mar Beach Cottages: 89% (summer), 52% (winter)
- 21 Area Pool: 61%, dropping (flag)
- 53 Area Fitness Center: 44% (underperforming — flag)
- MCAS Fitness Center: 39% (underperforming — flag)

### 6. `src/data/satisfaction.json`
Array of SatisfactionEntry per program. Key values:

- Paige Field House: CSAT 4.6, NPS +58, top positive: "modern equipment", top negative: "crowded 5-6am"
- Group Exercise Classes: CSAT 4.7, NPS +62, top positive: "great instructors", top negative: "class times limited"
- CDC-1 Mainside: CSAT 4.5, NPS +51, top positive: "caring staff", top negative: "waitlist too long"
- Iron Mike's: CSAT 4.2, NPS +28, top positive: "good food quality", top negative: "slow service lunch rush"
- Pub 1795: CSAT 4.4, NPS +35
- Leatherneck Lanes: CSAT 4.3, NPS +31
- Marine Memorial Golf Course: CSAT 4.1, NPS +22
- 21 Area Pool: CSAT 3.7, NPS +4, trending DOWN (flag)
- 53 Area Fitness: CSAT 3.8, NPS +8, top negative: "equipment needs repair"
- ITT / Latitudes Travel: CSAT 4.8, NPS +71 (best performer)
- Single Marine Program: CSAT 4.5, NPS +48
- School Age Care: CSAT 4.4, NPS +40

Overall CSAT average must compute to 4.3 when weighted by response count.

### 7. `src/data/installations.json`
Array of Installation objects for the enterprise teaser panel.

Include these real MCCS installations (status: "coming-soon" for all except Pendleton):
- Camp Pendleton, CA — status: "live", population: 100000, revenue: 38700000 (annual), csat: 4.3, utilization: 78
- Camp Lejeune, NC — population: 155000 (largest), revenue: null, csat: null, utilization: null
- Quantico, VA (HQ) — population: 28000
- MCAS Miramar, CA — population: 24000
- MCB Hawaii (Kaneohe Bay) — population: 18000
- MCAS Cherry Point, NC — population: 12000
- MCRD San Diego, CA — population: 8000
- MCB Albany, GA — population: 6000
- MCAS Beaufort (South Carolina) — population: 9000
- 29 Palms, CA — population: 22000
- Yuma, AZ — population: 7000
- Okinawa, Japan — population: 19000
- Iwakuni, Japan — population: 8000
- 8th & I, Washington D.C. — population: 1200
- Henderson Hall, Arlington VA — population: 2000

---

## CONSISTENCY CHECKS

Before writing the files, verify:
1. Monthly revenue total across all categories = ~$4,200,000
2. Annual revenue (12 months) ≈ $38,700,000
3. 16% of annual revenue = $6,192,000 (reinvestment figure)
4. Active patron count 22,400 / total eligible population 100,000 = 22.4% penetration (realistic)
5. Booking count 14,850 / active patrons 22,400 = 0.66 bookings per patron per month (realistic)
6. CDC utilization >95% must match CSAT complaint about waitlists
7. Underperforming facilities (utilization <45%) must have CSAT <4.0

Write all files to `src/data/`. Use TypeScript-friendly valid JSON (no comments, no trailing commas).
