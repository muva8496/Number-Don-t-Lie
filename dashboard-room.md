---
layout: page
title: "The Dashboard Room"
subtitle: "Curated Power BI business intelligence: Star schemas, DAX context modeling, and decision-grade reporting."
permalink: /dashboards/
---

Most corporate dashboards resemble pinball machines: flickering neon KPIs, decorative 3D gauges, and dozens of disconnected charts vying for attention. They are designed to look impressive in boardroom presentations rather than provide unambiguous operational guidance.

In this room, I showcase my **Power BI** production artifacts. Each dashboard is designed following three non-negotiable principles:
1. **Strict Star Schema:** Kimballed dimensional modeling with dedicated fact tables, single-direction one-to-many filtering, and zero bi-directional relationships.
2. **Context-Rich DAX:** Measures that account for calendar seasonality, working-day shifts, and non-additive grains rather than simple `SUM()` shortcuts.
3. **High Data-to-Ink Ratio:** High contrast, muted neutral canvas, zero ornamental clutter, and contextual micro-trends next to every variance figure.

---

## 01. East African FMCG Distributor Liquidity & Route Engine

<!-- [DASHBOARD_SCREENSHOT_PLACEHOLDER: Insert 16:9 4K export of Executive Overview tab here] -->
<div class="book-figure">
  <div class="book-figure-img-wrap" style="flex-direction: column; padding: 2rem 1.5rem; background: #06150e; border: 1px dashed var(--gold-border);">
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
      <span style="font-family: var(--font-display); font-size: 1.1rem; color: var(--gold-primary); font-weight: 700;">
        FMCG ROUTE LIQUIDITY MONITOR · POWER BI MODEL v3.2
      </span>
      <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
        [PROD_SEMANTIC_MODEL: 1.4M Rows]
      </span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; width: 100%; margin-bottom: 1.25rem;">
      <div style="background: #092016; padding: 1rem; border-left: 3px solid var(--gold-primary); border-radius: 2px;">
        <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Days Sales Outstanding (DSO)</span>
        <div style="font-size: 1.6rem; font-family: var(--font-mono); color: var(--text-primary); font-weight: 700;">14.2 Days</div>
        <span style="font-size: 0.75rem; color: #4ade80;">▼ -2.4d vs Target (16.6d)</span>
      </div>
      <div style="background: #092016; padding: 1rem; border-left: 3px solid #b8933b; border-radius: 2px;">
        <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Stockout Risk Index</span>
        <div style="font-size: 1.6rem; font-family: var(--font-mono); color: var(--text-primary); font-weight: 700;">6.8%</div>
        <span style="font-size: 0.75rem; color: #f87171;">▲ +1.1% in Cooking Oil</span>
      </div>
      <div style="background: #092016; padding: 1rem; border-left: 3px solid var(--gold-primary); border-radius: 2px;">
        <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">M-Pesa Till vs Cash Ratio</span>
        <div style="font-size: 1.6rem; font-family: var(--font-mono); color: var(--text-primary); font-weight: 700;">71.4%</div>
        <span style="font-size: 0.75rem; color: var(--gold-light);">Digital settlement dominant</span>
      </div>
    </div>
    <span style="font-size: 0.8rem; font-family: var(--font-body); color: var(--text-muted); font-style: italic;">
      [AUTHOR PLACEHOLDER: Replace this structured CSS wireframe with your full-bleed dashboard screenshot: <code>assets/images/dashboards/fmcg-liquidity-overview.png</code>]
    </span>
  </div>
  <figcaption class="book-figcaption">
    <p class="figure-caption-text">
      Figure D.1: Production dashboard tracking cash collections, delivery lorry reconciliation, and stockouts across 42 urban retail distribution corridors in Nairobi.
    </p>
    <div class="figure-takeaway">
      <span class="takeaway-label">Operational Walkthrough:</span>
      <span>Replaced 14 static end-of-day Excel sheets with a unified semantic model refreshed hourly via automated Power Query endpoints.</span>
    </div>
  </figcaption>
</div>

### Architectural Walkthrough
- **The Core Problem:** Delivery vans left the depot at 5:00 AM loaded with inventory. Shopkeepers paid via a chaotic mix of M-Pesa merchant paybills, post-dated cheques, and cash. Management had no visibility into end-of-day cash reconciliation until 48 hours later.
- **Data Engineering:** Power Query (M) scripts extract API payloads from the distributor ERP and Safaricom Daraja C2B webhook databases into an Azure SQL staging lake.
- **DAX Pattern:** Semi-additive inventory snapshotting that accurately measures daily closing warehouse stock without multiplying rows across the date dimension:
  ```dax
  Closing Stock Value = 
  CALCULATE(
      SUM('FactInventorySnapshot'[StockValueKES]),
      LASTDATE('DimDate'[Date])
  )
  ```

---

## 02. Nairobi Paratransit SACCO Fleet Dispatch & Variance

<!-- [DASHBOARD_SCREENSHOT_PLACEHOLDER: Insert Fleet Analytics tab here] -->
<div class="book-figure">
  <div class="book-figure-img-wrap" style="flex-direction: column; padding: 2rem 1.5rem; background: #06150e; border: 1px dashed var(--gold-border);">
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
      <span style="font-family: var(--font-display); font-size: 1.1rem; color: var(--gold-primary); font-weight: 700;">
        MATATU FLEET DISPATCH &amp; STAGE MARGIN MONITOR
      </span>
      <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
        [PROD_SEMANTIC_MODEL: 85 Vehicles]
      </span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; width: 100%; margin-bottom: 1.25rem;">
      <div style="background: #092016; padding: 1rem; border-left: 3px solid var(--gold-primary); border-radius: 2px;">
        <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Vehicle Utilization Rate</span>
        <div style="font-size: 1.6rem; font-family: var(--font-mono); color: var(--text-primary); font-weight: 700;">88.2%</div>
        <span style="font-size: 0.75rem; color: var(--gold-light);">14.4 operating hrs/day</span>
      </div>
      <div style="background: #092016; padding: 1rem; border-left: 3px solid #b8933b; border-radius: 2px;">
        <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Fuel Burn / Trip Ratio</span>
        <div style="font-size: 1.6rem; font-family: var(--font-mono); color: var(--text-primary); font-weight: 700;">KES 2,450</div>
        <span style="font-size: 0.75rem; color: #f87171;">▲ +12% during peak jams</span>
      </div>
      <div style="background: #092016; padding: 1rem; border-left: 3px solid var(--gold-primary); border-radius: 2px;">
        <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">SACCO Stage Levy Recovery</span>
        <div style="font-size: 1.6rem; font-family: var(--font-mono); color: var(--text-primary); font-weight: 700;">99.1%</div>
        <span style="font-size: 0.75rem; color: #4ade80;">Zero uncollected trips</span>
      </div>
    </div>
    <span style="font-size: 0.8rem; font-family: var(--font-body); color: var(--text-muted); font-style: italic;">
      [AUTHOR PLACEHOLDER: Replace this structured CSS wireframe with your dashboard screenshot: <code>assets/images/dashboards/sacco-fleet-dispatch.png</code>]
    </span>
  </div>
  <figcaption class="book-figcaption">
    <p class="figure-caption-text">
      Figure D.2: Executive reporting view built for matatu cooperative executives to balance route frequencies against driver daily remittances.
    </p>
    <div class="figure-takeaway">
      <span class="takeaway-label">Operational Walkthrough:</span>
      <span>Introduced dynamic drill-through from route overview into individual vehicle trip logs, cutting unrecorded staging idling by 22%.</span>
    </div>
  </figcaption>
</div>

---

## Technical Standards in My Power BI Work

Every report I build follows strict production standards:
- **No Bi-Directional Relationships:** All cross-filtering is handled via explicit DAX measures using `CALCULATE(..., CROSSFILTER(...))` to prevent ambiguous filter paths.
- **Dedicated Measure Tables:** Measures are systematically grouped into topic folders (`01_Revenue`, `02_Volume`, `03_Variances`) separate from physical entity tables.
- **Theme Consistency:** Colors conform to corporate WCAG AA contrast guidelines; data labels use tabular numbers (`tabular-nums`) to preserve optical alignment.

Interested in commissioning a custom Power BI semantic architecture? Read my engagement terms on the [Work with Me]({{ '/work-with-me/' | relative_url }}) page.
