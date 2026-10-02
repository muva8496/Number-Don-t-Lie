---
title: "Dirty Data Is Honest Data: Notes from Nairobi Spreadsheets"
date: 2026-04-05 14:15:00 +0300
tags: [data-cleaning, field-notes, python, sql]
excerpt: "When you open a municipal or transit CSV in Nairobi and find corrupted timestamps and misspelled sub-counties, do not get angry. That mess is where the truth lives."
---

Junior data engineers are trained in clean environments: synthesized Kaggle benchmarks, sterile Boston Housing datasets, and sanitized demo databases where foreign keys never break and timestamps conform to ISO 8601.

Then you get your first real raw dataset from a county registry or transport SACCO in Nairobi.

You find:
- Dates written as `12/04/2025`, `2025.04.12`, `12-Apr-25`, and occasionally `"Last Thursday before Easter"`.
- Sub-counties typed as `Westlands`, `westlands`, `West lands`, `W-lands`, and `Westlands (near Total station)`.
- Cash figures entered with Kenyan currency prefixes like `Ksh. 1,500/=`, `1500`, and `KES1500.00` in the same column.

The novice reaction is frustration. You write an aggressive regex script to drop the non-conforming rows, or you curse the clerk who recorded the numbers.

### The Clerk Is Not an Algorithm

Over the past two years, I have learned to respect the mess. 

When an administrative assistant in an office on Tom Mboya Street enters `"Ksh. 2,000 (paid in two installments via M-Pesa)"` into an integer column, they are not being malicious. They are trying to preserve vital business nuance within the suffocating constraints of a rigid spreadsheet template designed by an outside consultant who never spent an afternoon in their office.

When you blindly apply `df.dropna()` or truncate strings to force a schema, you are not cleaning data—you are destroying context.

### What the Errors Tell You

1. **Inconsistent timestamps** usually mean intermittent internet connectivity. When the fiber drops in Industrial Area, workers switch to paper logs and backfill the database late Friday evening under fatigue.
2. **Missing national identification numbers** often indicate foreign workers, unregistered youth, or citizens whose IDs were misplaced during bureaucratic renewals. Dropping them removes the most vulnerable segment of your sample.
3. **Double-counted mobile money receipts** usually reflect transaction timeouts where the sender re-tried the USSD prompt because the network lagged.

Before you sanitize a column, ask: *What human behavior produced this anomaly?*

The moment you treat dirty data not as an obstacle to be scrubbed, but as forensic evidence of how an organization actually breathes, your analytical judgment matures. Numbers don't lie, but neither do the scars in the spreadsheet.
