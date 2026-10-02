---
title: "Can Nairobi's Informal Transit Be Optimized Without Breaking It?"
order: 3
dataset: "Nairobi Open Matatu GPS & Boarding Logs (130 SACCOs)"
summary: "Simulating route consolidation across Nairobi's paratransit network to measure commute times versus operator livelihood and dispatch resilience."
primary_lens: "Engineering & Science"
status: "coming-soon"
date_pulled: "2026-03-20"
python_version: "3.11.8"
og_image: "/assets/images/chapter-3/transit-simulation-map.svg"
repo_url: "https://github.com/Muva8496/nairobi-matatu-mobility"
notebook_url: "https://github.com/Muva8496/nairobi-matatu-mobility/blob/main/notebooks/transit_simulation.ipynb"
tags: [matatu, nairobi, transit, simulation, python]
verdict_summary: "Forced route consolidation reduces theoretical passenger transit times by 14%, but triggers severe terminal congestion and threatens driver daily net margins."
verdict:
  - "[PROVISIONAL]: Route overlap along the Thika Superhighway corridor exceeds 72%, causing peak-hour staging delays at Ngara and Koja terminals."
  - "[PROVISIONAL]: Digital ticketing adoption patterns show higher compliance on feeder lines compared to cross-town trunk connections."
  - "[PROVISIONAL]: SACCO fare elasticity is heavily asymmetric: afternoon rainstorms trigger an immediate 40–80% surge pricing response."
limitations:
  - title: "GPS Ping Sampling Frequency"
    detail: "Telemetry dropouts in the CBD concrete canyons create spatial interpolation gaps during critical evening rush hours."
  - title: "Cash vs. Mobile Money Fare Splits"
    detail: "Unrecorded cash handoffs to conductors introduce margin-of-error bounds on daily revenue estimates."
---

<div class="author-placeholder-callout">
  <strong>Investigation In Progress · Forthcoming Autumn 2026</strong>
  This chapter is currently in the spatial trajectory cleaning and agent-based simulation phase. Field GPS traces from 130 Nairobi Savings and Credit Cooperative Organizations (SACCOs) are being matched against open street network topologies.
</div>

### Preliminary Research Inquiry

Nairobi's matatu network is frequently characterized by outside urban planners as chaotic, noisy, and inefficient. Yet for over four million daily commuters, it represents an extraordinarily responsive, self-organizing paratransit ecosystem that functions without municipal capital subsidies.

When centralized transit planners propose strict bus rapid transit (BRT) trunk lines, they often overlook the micro-economics of the crew: the driver, the conductor, the *kamagera* (stage caller), and the SACCO inspector.

In this forthcoming chapter, we ask:
1. What does the real graph topology of Nairobi's informal routes look like when reconstructed from raw GPS traces?
2. If we simulate route consolidation to minimize passenger idle time, what happens to operator revenue and staging bottlenecks at Koja, Muthurwa, and Kencom?
3. How do informal dynamic pricing surges behave during sudden tropical downpours?

### Methodology & Data Pipeline Under Construction

- **Raw Data:** Over 12 million spatial GPS pings across 45 designated routes (Route 44, 23, 111, 102, 58, 33).
- **Tooling:** Python (`geopandas`, `shapely`, `networkx`, `osmnx`), PostgreSQL + PostGIS spatial indexing.
- **Expected Artifacts:** Interactive route velocity maps, fare elasticity regression tables, and an open reproducible Jupyter simulation.

*Check back soon or watch the GitHub repository for initial exploratory commits.*
