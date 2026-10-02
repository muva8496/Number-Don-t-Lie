---
title: "Can an East African Duka Survive on Informal Credit Alone?"
order: 2
dataset: "Nairobi Neighborhood Duka Panel (Anonymized Stock Inventories & M-Pesa Till Flows)"
summary: "Deconstructing counter ledgers and digital payments across 14 Nairobi retail shops to measure inventory turnover, informal book credit, and supplier cashflow shocks."
primary_lens: "Engineering & Analysis"
status: "coming-soon"
date_pulled: "2026-03-01"
python_version: "3.11.8"
og_image: "/assets/images/chapter-2/duka-cashflow-overview.svg"
repo_url: "https://github.com/Muva8496/duka-informal-credit-flows"
notebook_url: "https://github.com/Muva8496/duka-informal-credit-flows/blob/main/notebooks/duka_inventory_cashflow.ipynb"
tags: [duka, m-pesa, retail, east-africa, inventory, sql]
verdict_summary: "The urban duka functions primarily as a neighborhood credit underwriter; over 48% of gross daily transaction volume is settled on paper trust, subsidized by 7-day supplier payment floats."
verdict:
  - "[PROVISIONAL]: Counter book credit ('kula kwa kitabu') represents 48.6% of household staple volume (unga, cooking oil, milk), with average repayment cycles spanning 11.2 days."
  - "[PROVISIONAL]: Fast-moving consumer goods (FMCG) inventory turnover averages 4.2 days, but working capital freezes occur bi-weekly when distributor delivery lorries require cash-on-delivery."
  - "[PROVISIONAL]: M-Pesa Till reconciliation discrepancies average 2.8% of daily revenue, primarily driven by customer payment reversals and merchant withdrawal fees."
limitations:
  - title: "Counter Book Unrecorded Bad Debts"
    detail: "Shop owners rarely write off delinquent family debt officially; abandoned balances in paper ledgers require qualitative verification."
  - title: "Nairobi Eastlands Geographic Bias"
    detail: "Sample focuses on high-density estates (Kayole, Umoja, Pipeline) and may not generalize to suburban or rural duka operating mechanics."
---

<div class="author-placeholder-callout">
  <strong>Local East African Business Investigation · Forthcoming 2026</strong>
  This chapter is currently in the ledger harmonization and synthetic anonymization phase. 
  Counter book entries from 14 neighborhood shops in Nairobi are being cross-referenced with merchant M-Pesa till statements to reconstruct the liquidity heartbeat of informal urban retail.
</div>

### Preliminary Research Inquiry

Across East Africa, FMCG conglomerates and corporate supermarket chains have spent decades predicting the imminent demise of the corner *duka*. Yet despite hypermarkets and digital quick-commerce startups, the humble kiosk continues to distribute over 70% of groceries in urban Kenya.

Why? Because the supermarket requires immediate cash or card settlement. The duka sells milk at 6:30 AM on credit because the shopkeeper knows your mother, your landlord, and your pay cycle.

In this forthcoming investigation, we analyze:
1. **The Credit Ledger Ratio:** What percentage of monthly turnover is trapped in paper counter books (*kitabu cha deni*), and how does default risk correlate with end-of-month salary delays?
2. **The M-Pesa Float Squeeze:** How do shopkeepers manage the friction between customers paying digitally via Lipa Na M-Pesa and distributors demanding physical bank deposits or cash-on-delivery?
3. **The Micro-Inventory Elasticity:** When cooking oil or maize flour prices spike due to import duties, how do dukas resize package units (the *kadogo* economy) to protect working capital?

### Pipeline Architecture Under Construction

- **Raw Data:** 42,000 anonymized transaction rows, 14 counter credit ledgers, and matching M-Pesa merchant statement extracts.
- **Data Engineering:** SQL Window Functions and CTEs in PostgreSQL to model cash conversion cycles.
- **Reporting Artifacts:** Interactive Star Schema Power BI visual model and Python econometric regression tables.

*Star the repository on GitHub to track data cleaning commits.*
