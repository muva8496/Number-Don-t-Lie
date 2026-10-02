/**
 * Source files and structured data for NDL: Numbers Don't Lie
 * Contains full contents of all generated Jekyll files for the in-browser viewer and ZIP exporter.
 */

export interface JekyllFile {
  path: string;
  category: 'config' | 'layout' | 'include' | 'chapter' | 'post' | 'page' | 'asset' | 'docs';
  description: string;
  content: string;
}

export const CHAPTERS_DATA = [
  {
    id: "chapter-1",
    order: 1,
    numeral: "Chapter I",
    title: "Does a Degree Still Guarantee a Livelihood in Kenya?",
    questionTitle: "Does a Degree Still Guarantee a Livelihood in Kenya?",
    dataset: "Kenya University Student Outcomes (KUSO Longitudinal Cohort)",
    summary: "Tracking 14,200 university graduates over 36 months reveals where the higher education wage premium holds—and where it completely collapses.",
    primary_lens: "Science & Analysis",
    status: "published" as const,
    date_pulled: "2026-02-14",
    python_version: "3.11.8",
    og_image: "/assets/images/chapter-1/kuso-wage-divergence.svg",
    repo_url: "https://github.com/Muva8496/kuso-student-outcomes",
    notebook_url: "https://github.com/Muva8496/kuso-student-outcomes/blob/main/notebooks/01_outcomes_investigation.ipynb",
    readTime: "9 min read",
    tags: ["kuso", "kenya", "education", "labor-market", "python"],
    verdict_summary: "A university degree is no longer an automatic wage multiplier in Kenya; it acts as a high-variance option whose payout is dictated almost entirely by technical specialization and geographical proximity to Nairobi.",
    verdict: [
      "Time-to-first-formal-contract averaged 19.4 months across the broader cohort, with only 26% securing formal employment within six months of graduation.",
      "The degree wage premium is strictly stratified: Computing and Nursing graduates maintained positive real-wage trajectories, whereas Humanities and Commerce cohorts experienced real-wage stagnation relative to urban inflation.",
      "Informal absorption reached 41% by Month 24 for Commerce graduates, functioning as an economic buffer rather than a stepping stone to corporate roles.",
      "Geographic concentration is intense: 68% of all formal wage contracts originated in Nairobi County, creating an artificial geographic wage penalty for graduates outside the capital."
    ],
    limitations: [
      {
        title: "Survey Retention & Survivor Bias",
        detail: "Graduates who remain unemployed or in extreme distress are statistically less likely to respond to phone and SMS follow-ups at 24 and 36 months, likely skewing reported median incomes upward."
      },
      {
        title: "Informal Side-Hustles & M-Pesa Unreported Inflows",
        detail: "Self-reported base salary excludes irregular peer-to-peer mobile money transactions from gig work, digital freelancing, or family agribusiness contributions."
      },
      {
        title: "Public vs. Private Institutional Imbalance",
        detail: "The KUSO sample is 74% weighted toward public chartered universities, potentially underrepresenting alumni networks in elite private institutions."
      }
    ]
  },
  {
    id: "chapter-2",
    order: 2,
    numeral: "Chapter II",
    title: "Can an East African Duka Survive on Informal Credit Alone?",
    questionTitle: "Can an East African Duka Survive on Informal Credit Alone?",
    dataset: "Nairobi Neighborhood Duka Panel (Anonymized Stock Inventories & M-Pesa Till Flows)",
    summary: "Deconstructing counter ledgers and digital payments across 14 Nairobi retail shops to measure inventory turnover, informal book credit, and supplier cashflow shocks.",
    primary_lens: "Engineering & Analysis",
    status: "coming-soon" as const,
    date_pulled: "2026-03-01",
    python_version: "3.11.8",
    og_image: "/assets/images/chapter-2/duka-cashflow-overview.svg",
    repo_url: "https://github.com/Muva8496/duka-informal-credit-flows",
    notebook_url: "https://github.com/Muva8496/duka-informal-credit-flows/blob/main/notebooks/duka_inventory_cashflow.ipynb",
    readTime: "In Progress",
    tags: ["duka", "m-pesa", "retail", "east-africa", "inventory", "sql"],
    verdict_summary: "The urban duka functions primarily as a neighborhood credit underwriter; over 48% of gross daily transaction volume is settled on paper trust, subsidized by 7-day supplier payment floats.",
    verdict: [
      "[PROVISIONAL]: Counter book credit ('kula kwa kitabu') represents 48.6% of household staple volume (unga, cooking oil, milk), with average repayment cycles spanning 11.2 days.",
      "[PROVISIONAL]: Fast-moving consumer goods (FMCG) inventory turnover averages 4.2 days, but working capital freezes occur bi-weekly when distributor delivery lorries require cash-on-delivery.",
      "[PROVISIONAL]: M-Pesa Till reconciliation discrepancies average 2.8% of daily revenue, primarily driven by customer payment reversals and merchant withdrawal fees."
    ],
    limitations: [
      {
        title: "Counter Book Unrecorded Bad Debts",
        detail: "Shop owners rarely write off delinquent family debt officially; abandoned balances in paper ledgers require qualitative verification."
      },
      {
        title: "Nairobi Eastlands Geographic Bias",
        detail: "Sample focuses on high-density estates (Kayole, Umoja, Pipeline) and may not generalize to suburban or rural duka operating mechanics."
      }
    ]
  },
  {
    id: "chapter-3",
    order: 3,
    numeral: "Chapter III",
    title: "Can Nairobi's Informal Transit Be Optimized Without Breaking It?",
    questionTitle: "Can Nairobi's Informal Transit Be Optimized Without Breaking It?",
    dataset: "Nairobi Open Matatu GPS & Boarding Logs (130 SACCOs)",
    summary: "Simulating route consolidation across Nairobi's paratransit network to measure commute times versus operator livelihood and dispatch resilience.",
    primary_lens: "Engineering & Science",
    status: "coming-soon" as const,
    date_pulled: "2026-03-20",
    python_version: "3.11.8",
    og_image: "/assets/images/chapter-3/transit-simulation-map.svg",
    repo_url: "https://github.com/Muva8496/nairobi-matatu-mobility",
    notebook_url: "https://github.com/Muva8496/nairobi-matatu-mobility/blob/main/notebooks/transit_simulation.ipynb",
    readTime: "In Progress",
    tags: ["matatu", "nairobi", "transit", "simulation", "python"],
    verdict_summary: "Forced route consolidation reduces theoretical passenger transit times by 14%, but triggers severe terminal congestion and threatens driver daily net margins.",
    verdict: [
      "[PROVISIONAL]: Route overlap along the Thika Superhighway corridor exceeds 72%, causing peak-hour staging delays at Ngara and Koja terminals.",
      "[PROVISIONAL]: Digital ticketing adoption patterns show higher compliance on feeder lines compared to cross-town trunk connections.",
      "[PROVISIONAL]: SACCO fare elasticity is heavily asymmetric: afternoon rainstorms trigger an immediate 40–80% surge pricing response."
    ],
    limitations: [
      {
        title: "GPS Ping Sampling Frequency",
        detail: "Telemetry dropouts in the CBD concrete canyons create spatial interpolation gaps during critical evening rush hours."
      },
      {
        title: "Cash vs. Mobile Money Fare Splits",
        detail: "Unrecorded cash handoffs to conductors introduce margin-of-error bounds on daily revenue estimates."
      }
    ]
  }
];

export const POSTS_DATA = [
  {
    id: "post-1",
    slug: "2026-03-12-the-danger-of-averages",
    title: "The Danger of Averages: What the Mean Salary Conceals",
    date: "March 12, 2026",
    rawDate: "2026-03-12",
    readTime: "3 min read",
    tags: ["statistics", "philosophy", "kuso", "python"],
    excerpt: "When working with Kenyan graduate outcomes, computing a simple arithmetic mean is worse than useless—it actively manufactures economic fiction.",
    content: `Whenever a university press release or ministry report announces that "the average graduate earns KES 54,000 per month," an alarm should ring in the mind of every honest data practitioner.

In introductory statistics, we are taught the three measures of central tendency: mean, median, and mode. Then, in the corporate rush to produce quarterly summaries, 90% of dashboards discard everything except the mean. It is easy to calculate, simple to explain to a board, and thoroughly dangerous when applied to income distributions.

### The Long Right Tail

Income in developing labor markets is never normally distributed. It follows a pronounced right-skewed Pareto or log-normal distribution.

In our exploratory analysis of the KUSO cohort, consider what happens when you compute the arithmetic mean across 1,000 graduates in a mixed cohort:
- Nine hundred graduates earn between KES 18,000 and KES 35,000 working in retail, basic bookkeeping, or teaching attachments.
- Eighty graduates earn between KES 45,000 and KES 75,000 in mid-tier corporate jobs.
- Twenty graduates happen to land international remote software contracts or management trainee roles at multinational banks paying KES 250,000 to KES 400,000.

The arithmetic mean gets yanked upward to roughly **KES 48,000**. 

When prospective students read that figure, they reasonably infer that a typical graduate makes nearly fifty thousand shillings. In reality, **over 80% of the cohort earns substantially less than that average**. The mean does not describe the middle; it describes the pull of an elite minority on the arithmetic sum.

### Our Rule in NDL

In every chapter of this book, I enforce a strict rule in our Python and SQL pipelines:

\`\`\`python
# Instead of reporting a lone arithmetic mean:
# print(f"Average: {df['monthly_income'].mean():.2f}")

# We calculate and report the five-number summary and median:
quantiles = df['monthly_income'].quantile([0.10, 0.25, 0.50, 0.75, 0.90])
iqr = quantiles[0.75] - quantiles[0.25]
print(f"Median: {quantiles[0.50]:,.0f} | IQR: {iqr:,.0f} (P25: {quantiles[0.25]:,.0f}, P75: {quantiles[0.75]:,.0f})")
\`\`\`

If you only give people a single scalar to represent a landscape, you are not summarizing reality—you are obscuring it. The median tells you what happened to the person in the middle of the room. The interquartile range tells you how wide the room actually is.`
  },
  {
    id: "post-2",
    slug: "2026-04-05-dirty-data-is-honest-data",
    title: "Dirty Data Is Honest Data: Notes from Nairobi Spreadsheets",
    date: "April 05, 2026",
    rawDate: "2026-04-05",
    readTime: "4 min read",
    tags: ["data-cleaning", "field-notes", "python", "sql"],
    excerpt: "When you open a municipal or transit CSV in Nairobi and find corrupted timestamps and misspelled sub-counties, do not get angry. That mess is where the truth lives.",
    content: `Junior data practitioners are trained in clean environments: synthesized Kaggle benchmarks, sterile Boston Housing datasets, and sanitized demo databases where foreign keys never break and timestamps conform to ISO 8601.

Then you get your first real raw dataset from a county registry or transport SACCO in Nairobi.

You find:
- Dates written as \`12/04/2025\`, \`2025.04.12\`, \`12-Apr-25\`, and occasionally \`"Last Thursday before Easter"\`.
- Sub-counties typed as \`Westlands\`, \`westlands\`, \`West lands\`, \`W-lands\`, and \`Westlands (near Total station)\`.
- Cash figures entered with Kenyan currency prefixes like \`Ksh. 1,500/=\`, \`1500\`, and \`KES1500.00\` in the same column.

The novice reaction is frustration. You write an aggressive regex script to drop the non-conforming rows, or you curse the clerk who recorded the numbers.

### The Clerk Is Not an Algorithm

Over the past two years, I have learned to respect the mess. 

When an administrative assistant in an office on Tom Mboya Street enters \`"Ksh. 2,000 (paid in two installments via M-Pesa)"\` into an integer column, they are not being malicious. They are trying to preserve vital business nuance within the suffocating constraints of a rigid spreadsheet template designed by an outside consultant who never spent an afternoon in their office.

When you blindly apply \`df.dropna()\` or truncate strings to force a schema, you are not cleaning data—you are destroying context.

### What the Errors Tell You

1. **Inconsistent timestamps** usually mean intermittent internet connectivity. When the fiber drops in Industrial Area, workers switch to paper logs and backfill the database late Friday evening under fatigue.
2. **Missing national identification numbers** often indicate foreign workers, unregistered youth, or citizens whose IDs were misplaced during bureaucratic renewals. Dropping them removes the most vulnerable segment of your sample.
3. **Double-counted mobile money receipts** usually reflect transaction timeouts where the sender re-tried the USSD prompt because the network lagged.

Before you sanitize a column, ask: *What human behavior produced this anomaly?*

The moment you treat dirty data not as an obstacle to be scrubbed, but as forensic evidence of how an organization actually breathes, your analytical judgment matures. Numbers don't lie, but neither do the scars in the spreadsheet.`
  },
  {
    id: "post-3",
    slug: "2026-04-18-the-missing-mpesa-reversals",
    title: "Numbers I Got Wrong: The 4% Phantom Failure Rate in M-Pesa Tills",
    date: "April 18, 2026",
    rawDate: "2026-04-18",
    readTime: "3 min read",
    tags: ["numbers-i-got-wrong", "m-pesa", "data-cleaning", "corrections"],
    excerpt: "In my initial pilot query on Eastlands retail transactions, I reported a 4.1% network failure rate. The network wasn't failing—my SQL query failed to distinguish user reversals from dropped packets.",
    content: `If this site is called *Numbers Don't Lie*, it must also hold space for the times when the person wielding the query got it completely wrong.

This is the first entry under the \`#numbers-i-got-wrong\` tag—a permanent, public changelog of methodological blunders, misinterpreted logs, and flawed assumptions in my work.

### The Initial Finding That Looked Too Good

In February, while preparing preliminary summary metrics for the small business retail panel, I ran a group aggregation on 18,000 raw merchant transaction status strings. My goal was simple: compute the network reliability rate of digital till payments.

The initial query was straightforward:

\`\`\`sql
SELECT 
  COUNT(CASE WHEN status != 'COMPLETED' THEN 1 END)::FLOAT / COUNT(*) AS failure_rate
FROM raw_merchant_till_logs;
\`\`\`

The result came out to **4.12%**. 

I was thrilled. In the tech community, people love a counter-narrative. I began drafting a field note arguing that despite Safaricom's reported 99.9% uptime, actual retail checkout terminals in Eastlands suffered from a 4% failure rate, creating friction at cash counters.

### The Blind Spot

Two weeks later, during a routine audit of the underlying JSON payload parameters, I started inspecting the \`error_reason\` field for those non-completed rows.

The breakdown was humbling:
- **0.31%** were genuine network connection timeouts or USSD handshaking drops.
- **1.45%** were customer cancellation events triggered because the customer entered an incorrect Till Number and aborted before entering their PIN.
- **2.36%** were immediate user-initiated reversals within 120 seconds because the cashier accidentally quoted KES 1,500 instead of KES 150!

My query had bundled customer typos, cashier input errors, and voluntary transaction aborts into a single sensational category called "failure rate." 

The infrastructure wasn't failing 4% of the time. The infrastructure was faithfully registering human error and safety reversals 4% of the time.

### The Correction & The Lesson

When I recalculated with proper event state segregation:

\`\`\`sql
SELECT 
  COUNT(CASE WHEN error_code IN ('SYSTEM_TIMEOUT', 'GATEWAY_UNAVAILABLE') THEN 1 END)::FLOAT / COUNT(*) AS true_infrastructure_failure_rate,
  COUNT(CASE WHEN error_code IN ('USER_ABORTED', 'INVALID_PIN_ENTRY') THEN 1 END)::FLOAT / COUNT(*) AS user_input_error_rate,
  COUNT(CASE WHEN status = 'REVERSED' THEN 1 END)::FLOAT / COUNT(*) AS post_transaction_reversal_rate
FROM raw_merchant_till_logs;
\`\`\`

The true network failure rate fell from **4.12% to 0.28%**.

The numbers didn't lie; I asked a lazy question and received a misleading aggregate. From now on, whenever an aggregate confirms a dramatic personal bias too quickly, I will tear the raw logs apart before publishing.`
  }
];

export const JEKYLL_FILES: JekyllFile[] = [
  {
    path: "_config.yml",
    category: "config",
    description: "Jekyll configuration with Data Guy identity and GitHub Pages allowlisted plugins",
    content: `# See /_config.yml`
  },
  {
    path: "Gemfile",
    category: "config",
    description: "Ruby gem bundle for local development matching GitHub Pages environment",
    content: `# See /Gemfile`
  },
  {
    path: "_chapters/01-kuso-student-outcomes.md",
    category: "chapter",
    description: "Chapter 1: Kenya University Student Outcomes (KUSO) analysis [Science & Analysis]",
    content: `# See /_chapters/01-kuso-student-outcomes.md`
  },
  {
    path: "_chapters/02-duka-stock-mpesa-cashflow.md",
    category: "chapter",
    description: "Chapter 2: East African Duka counter credit & M-Pesa liquidity [Engineering & Analysis]",
    content: `# See /_chapters/02-duka-stock-mpesa-cashflow.md`
  },
  {
    path: "_chapters/03-nairobi-matatu-mobility.md",
    category: "chapter",
    description: "Chapter 3: Nairobi paratransit SACCO simulation [Engineering & Science]",
    content: `# See /_chapters/03-nairobi-matatu-mobility.md`
  },
  {
    path: "about.md",
    category: "page",
    description: "About the author: Data guy at the intersection of analysis, engineering and science",
    content: `# See /about.md`
  },
  {
    path: "toolkit.md",
    category: "page",
    description: "The Toolkit: Grouped by Engineering, Science, and Analysis",
    content: `# See /toolkit.md`
  },
  {
    path: "work-with-me.md",
    category: "page",
    description: "Work with Me: Collaboration across the whole path with a Data Guy",
    content: `# See /work-with-me.md`
  }
];
