---
title: "Numbers I Got Wrong: The 4% Phantom Failure Rate in M-Pesa Tills"
date: 2026-04-18 11:20:00 +0300
tags: [numbers-i-got-wrong, m-pesa, data-cleaning, corrections]
excerpt: "In my initial pilot query on Eastlands retail transactions, I reported a 4.1% network failure rate. The network wasn't failing—my SQL query failed to distinguish user reversals from dropped packets."
---

If this site is called *Numbers Don't Lie*, it must also hold space for the times when the analyst wielding the calculator got it completely wrong.

This is the first entry under the `#numbers-i-got-wrong` tag—a permanent, public changelog of methodological blunders, misinterpreted logs, and flawed assumptions in my work.

### The Initial Finding That Looked Too Good

In February, while preparing preliminary summary metrics for the small business retail panel, I ran a group aggregation on 18,000 raw merchant transaction status strings. My goal was simple: compute the network reliability rate of digital till payments.

The initial query was straightforward:

```sql
SELECT 
  COUNT(CASE WHEN status != 'COMPLETED' THEN 1 END)::FLOAT / COUNT(*) AS failure_rate
FROM raw_merchant_till_logs;
```

The result came out to **4.12%**. 

I was thrilled. In the tech community, people love a counter-narrative. I began drafting a field note arguing that despite Safaricom's reported 99.9% uptime, actual retail checkout terminals in Eastlands suffered from a 4% failure rate, creating friction at cash counters.

### The Blind Spot

Two weeks later, during a routine audit of the underlying JSON payload parameters, I started inspecting the `error_reason` field for those non-completed rows.

The breakdown was humbling:
- **0.31%** were genuine network connection timeouts or USSD handshaking drops.
- **1.45%** were customer cancellation events triggered because the customer entered an incorrect Till Number and aborted before entering their PIN.
- **2.36%** were immediate user-initiated reversals within 120 seconds because the cashier accidentally quoted KES 1,500 instead of KES 150!

My query had bundled customer typos, cashier input errors, and voluntary transaction aborts into a single sensational category called "failure rate." 

The infrastructure wasn't failing 4% of the time. The infrastructure was faithfully registering human error and safety reversals 4% of the time.

### The Correction & The Lesson

When I recalculated with proper event state segregation:

```sql
SELECT 
  COUNT(CASE WHEN error_code IN ('SYSTEM_TIMEOUT', 'GATEWAY_UNAVAILABLE') THEN 1 END)::FLOAT / COUNT(*) AS true_infrastructure_failure_rate,
  COUNT(CASE WHEN error_code IN ('USER_ABORTED', 'INVALID_PIN_ENTRY') THEN 1 END)::FLOAT / COUNT(*) AS user_input_error_rate,
  COUNT(CASE WHEN status = 'REVERSED' THEN 1 END)::FLOAT / COUNT(*) AS post_transaction_reversal_rate
FROM raw_merchant_till_logs;
```

The true network failure rate fell from **4.12% to 0.28%**.

The numbers didn't lie; I asked a lazy question and received a misleading aggregate. From now on, whenever an aggregate confirms a dramatic personal bias too quickly, I will tear the raw logs apart before publishing.
