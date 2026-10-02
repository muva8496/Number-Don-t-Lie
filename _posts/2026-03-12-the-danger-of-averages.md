---
title: "The Danger of Averages: What the Mean Salary Conceals"
date: 2026-03-12 09:30:00 +0300
tags: [statistics, philosophy, kuso, python]
excerpt: "When working with Kenyan graduate outcomes, computing a simple arithmetic mean is worse than useless—it actively manufactures economic fiction."
---

Whenever a university press release or ministry report announces that "the average graduate earns KES 54,000 per month," an alarm should ring in the mind of every honest data practitioner.

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

```python
# Instead of reporting a lone arithmetic mean:
# print(f"Average: {df['monthly_income'].mean():.2f}")

# We calculate and report the five-number summary and median:
quantiles = df['monthly_income'].quantile([0.10, 0.25, 0.50, 0.75, 0.90])
iqr = quantiles[0.75] - quantiles[0.25]
print(f"Median: {quantiles[0.50]:,.0f} | IQR: {iqr:,.0f} (P25: {quantiles[0.25]:,.0f}, P75: {quantiles[0.75]:,.0f})")
```

If you only give people a single scalar to represent a landscape, you are not summarizing reality—you are obscuring it. The median tells you what happened to the person in the middle of the room. The interquartile range tells you how wide the room actually is.
