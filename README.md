# NDL: Numbers Don't Lie — Book-Style Data Portfolio

> A book of empirical data work, investigative chapters, and field dispatches by a Nairobi-based data guy standing at the intersection of analysis, engineering, and science.

`NDL` is designed not as a generic corporate dashboard or shallow project carousel, but as a **rebound volume of investigative data journalism**. Each major dataset inquiry is structured as a **Chapter** in Part I (The Evidence), and short analytical notes are preserved chronologically in **The Trail** (Part II).

This site is built as a pure **Jekyll** static site configured to deploy seamlessly on **GitHub Pages** with zero build tools, no npm dependencies, and strictly allowlisted GitHub Pages plugins.

---

## Directory Architecture

```text
.
├── _chapters/                      # Part I: The Evidence (Jekyll Collection)
│   ├── 01-kuso-student-outcomes.md # Chapter 1 (Published sample project)
│   ├── 02-nairobi-matatu-mobility.md # Chapter 2 (Coming soon)
│   └── 03-m-pesa-micro-transactions.md # Chapter 3 (Coming soon)
├── _posts/                         # Part II: The Trail (Dated Field Notes)
│   ├── 2026-03-12-the-danger-of-averages.md
│   └── 2026-04-05-dirty-data-is-honest-data.md
├── _layouts/                       # Reusable Page Layouts
│   ├── default.html                # Outer HTML frame & fonts
│   ├── home.html                   # Book cover & Table of Contents
│   ├── chapter.html                # Evidence Chapter layout (verdict, figures, limitations)
│   ├── post.html                   # The Trail note layout
│   └── page.html                   # Static editorial page layout
├── _includes/                      # Modular Components
│   ├── header.html                 # 3-Zone top navigation bar
│   ├── footer.html                 # Colophon & author metadata
│   ├── toc.html                    # Book-style Table of Contents
│   ├── chapter-nav.html            # Auto-generated Prev/Next navigation
│   ├── callout.html                # Styled verdict & warning box
│   └── figure.html                 # Image + caption + takeaway component
├── assets/
│   ├── css/
│   │   └── main.css                # Plain CSS variables, typography & layout
│   └── images/
│       └── chapter-1/              # Charts & visuals for Chapter 1
├── _config.yml                     # Jekyll configuration, collections & plugins
├── Gemfile                         # Ruby gem bundle for local development
├── index.md                        # Site root (invokes layout: home)
├── about.md                        # Author philosophy & bio
├── toolkit.md                      # Python, SQL, and Power BI breakdown
├── trail.html                      # The Trail archive list
├── tags.html                       # Tag index & taxonomy
├── feed.xml                        # RSS 2.0 / Atom feed
└── README.md                       # This guide
```

---

## 1. How to Add a New Chapter

All investigative chapters live in the `_chapters/` directory. Each file is a Markdown document with YAML front matter.

### Step 1: Create the file
Name the file with a numerical prefix and slug, e.g., `_chapters/04-energy-grid-stability.md`.

### Step 2: Add the required front matter
```yaml
---
title: "Does Rural Grid Expansion Reduce Charcoal Dependence in Western Kenya?"
order: 4
dataset: "Rural Electrification Authority & KNBS Household Energy Panel"
teaser: "Comparing 50,000 household connection logs against regional biomass consumption metrics."
status: "published" # or "coming-soon"
repo_url: "https://github.com/yourusername/kenya-rural-grid-analysis"
notebook_url: "https://github.com/yourusername/kenya-rural-grid-analysis/blob/main/notebooks/grid_analysis.ipynb"
tags: [energy, kenya, econometrics, python, sql]
verdict:
  - "Households gaining grid connections showed a 42% decline in kerosene lighting within 90 days."
  - "Charcoal consumption for cooking remained virtually unchanged due to the cost differential between LPG/electricity and biomass."
  - "Grid reliability (measured by SAIDI/SAIFI outage frequency) was the single largest determinant of sustained appliance adoption."
limitations:
  - title: "Prepaid Meter Shared Connections"
    detail: "Multiple adjoining compounds frequently share a single token meter, artificially inflating average consumption variance."
  - title: "Seasonal Agribusiness Spikes"
    detail: "Harvest season grain-milling introduces high temporary demand spikes unrepresentative of baseline domestic load."
---
```

### Step 3: Write the chapter using the book includes
The chapter automatically inherits `_layouts/chapter.html`. In your Markdown body, you can insert figures with the custom include:

```liquid
{% include figure.html 
  src="/assets/images/chapter-4/grid-adoption-curve.svg" 
  alt="Charcoal vs Grid expenditure curve" 
  caption="Figure 4.1: Household energy budget allocations across 24 months post-connection." 
  takeaway="Electrification displaces lighting fuels instantly, but thermal cooking energy requires targeted tariff subsidies to transition away from charcoal." 
%}
```

The layout automatically:
1. Renders the chapter number and question title.
2. Formats the **Verdict** box from your front matter list.
3. Renders the body text with drop-cap styling.
4. Generates the **Where the Numbers Can Mislead** limitations section.
5. Links to the notebook and GitHub repo.
6. Computes **Previous Chapter / Next Chapter** links based on `order`.
7. Pulls in related Trail field notes that share tags with your chapter.

---

## 2. How to Add a Trail Entry (Field Note)

Trail entries are standard Jekyll blog posts located in `_posts/`.

### Step 1: Name the file
Follow the standard Jekyll naming convention: `_posts/YYYY-MM-DD-your-topic-slug.md`, e.g., `_posts/2026-05-18-why-i-use-duckdb-for-nairobi-transit-logs.md`.

### Step 2: Add front matter
```yaml
---
title: "Why I Replaced Pandas with DuckDB for Nairobi Transit Traces"
date: 2026-05-18 10:00:00 +0300
tags: [sql, duckdb, performance, transit]
excerpt: "When working with 12 million spatial GPS pings on a local laptop, in-memory Python dictionaries melt your swap space. Here is the SQL pattern that saved the project."
---
```

### Step 3: Write the essay
Keep Trail posts punchy, reflective, and technical (500–1,200 words). When you use tags matching an existing Chapter (e.g., `kuso`, `transit`, `sql`), the site automatically interlinks them!

---

## 3. How to Export a Jupyter Notebook to Markdown

To bring a Python data investigation from Jupyter into an NDL chapter:

1. In your project repository or terminal, run:
   ```bash
   jupyter nbconvert --to markdown notebooks/01_outcomes_investigation.ipynb --output-dir=./exported_output
   ```

2. This produces:
   - `exported_output/01_outcomes_investigation.md`
   - A folder `exported_output/01_outcomes_investigation_files/` containing all generated chart PNGs or SVGs.

3. Move the chart images to `assets/images/chapter-X/`:
   ```bash
   mv exported_output/01_outcomes_investigation_files/* assets/images/chapter-X/
   ```

4. Copy the narrative and key code blocks into `_chapters/0X-your-chapter.md`. Replace the raw markdown image tags (`![png](...)`) with the NDL book figure include:
   ```liquid
   {% include figure.html 
     src="/assets/images/chapter-X/my_chart.png" 
     alt="Description of the distribution" 
     caption="Figure X.1: Distribution of findings." 
     takeaway="The core invariant discovered in the data." 
   %}
   ```

5. Strip out verbose execution logs and redundant dataframe `.head()` outputs. Only keep the high-signal narrative and charts.

---

## 4. How to Deploy on GitHub Pages

This site is 100% compatible with GitHub Pages default builds (no GitHub Actions workflow required, though you can use one if you prefer).

### Option A: Standard GitHub Pages Deployment
1. Push this repository to GitHub (e.g., `https://github.com/yourusername/ndl`).
2. Open your repository on GitHub.
3. Navigate to **Settings** &rarr; **Pages**.
4. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`), Folder: `/ (root)`
   - Click **Save**.
5. Update `_config.yml`:
   ```yaml
   url: "https://yourusername.github.io"
   baseurl: "/ndl" # If your repository is named 'ndl'. If your repository is 'yourusername.github.io', keep baseurl: ""
   ```
6. Commit and push. Within 60 seconds, your site will be live at `https://yourusername.github.io/ndl/`.

---

## 5. Local Testing & Verification Checklist

To test the Jekyll site locally on your computer:

### Step 1: Install Ruby & Bundler
Ensure you have Ruby (v3.0+) installed on your machine.

### Step 2: Install dependencies
```bash
bundle install
```

### Step 3: Run the local server
```bash
bundle exec jekyll serve --livereload
```
Open `http://localhost:4000` in your browser.

### Step 4: Pre-Deployment Test Checklist
Before committing to production, verify:

- [ ] **Home Page:** Table of Contents renders chapters in correct numerical order (`order: 1`, `order: 2`, `order: 3`).
- [ ] **Chapter 1 Layout:**
  - [ ] Question title and Chapter I numeral render crisply.
  - [ ] The **Verdict** box displays with gold accent border and clean bullet points.
  - [ ] Opening paragraph displays the book drop cap (`E`).
  - [ ] Figures 1.1 and 1.2 render with their captions and one-line key takeaways.
  - [ ] The **Where the numbers can mislead** section appears with warning callout.
  - [ ] Source links to Jupyter Notebook and GitHub open in new tabs.
  - [ ] Prev / Next navigation points to Chapter II.
- [ ] **The Trail:**
  - [ ] Both field notes render under `/trail/`.
  - [ ] Reading times are automatically calculated.
  - [ ] Tag links take you to `/tags/#tag-name`.
  - [ ] RSS feed at `/feed.xml` validates as valid XML.
- [ ] **Toolkit & About Pages:** Both pages render with appropriate typography and contact links.
- [ ] **Mobile Responsiveness:** View at 375px width (iPhone SE) to ensure text does not overflow and navigation collapses cleanly.
- [ ] **Zero-Pill Compliance:** No static metadata wrapped in rounded capsule badges; typography uses clean unboxed separators (`·`).
