import React from 'react';
import { CHAPTERS_DATA, POSTS_DATA } from '../jekyllData';
import { 
  BookOpen, 
  Github, 
  AlertTriangle, 
  ArrowLeft, 
  ExternalLink,
  Calendar,
  Terminal
} from 'lucide-react';

interface ChapterViewProps {
  chapterId: string;
  onSelectChapter: (id: string) => void;
  onSelectPost: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapterId,
  onSelectChapter,
  onSelectPost,
  onNavigate
}) => {
  const chapter = CHAPTERS_DATA.find((c) => c.id === chapterId) || CHAPTERS_DATA[0];
  const sortedChapters = [...CHAPTERS_DATA].sort((a, b) => a.order - b.order);
  const currentIndex = sortedChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  // Matching posts by shared tags
  const matchingPosts = POSTS_DATA.filter((p) =>
    p.tags.some((t) => chapter.tags.includes(t))
  );

  return (
    <article className="reading-container" itemScope itemType="https://schema.org/ScholarlyArticle">
      {/* Back to Cover / Table of Contents */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('cover')}
          className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase font-serif text-[#d4af37] hover:text-[#e6c86e] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Table of Chapters</span>
        </button>
      </div>

      {/* 1. Chapter Number, Question Title, Summary, Reading Time, Tags */}
      <header className="chapter-header">
        <span className="chapter-numeral-kicker">{chapter.numeral}</span>
        
        <h1 className="chapter-title-question" itemProp="headline">
          {chapter.title}
        </h1>

        <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--gold-light)', fontStyle: 'italic', marginBottom: '1.25rem' }}>
          {chapter.summary}
        </p>

        <div className="chapter-meta-line">
          {chapter.primary_lens && (
            <>
              <span className="font-mono text-xs text-[#e6c86e] tracking-wider uppercase px-2 py-0.5 border border-[#d4af37]/35 rounded-sm">
                Primary Lens: {chapter.primary_lens}
              </span>
              <span className="chapter-meta-sep" aria-hidden="true">·</span>
            </>
          )}
          <span><strong>Dataset:</strong> {chapter.dataset}</span>
          <span className="chapter-meta-sep" aria-hidden="true">·</span>
          <span><strong>Status:</strong> {chapter.status === 'published' ? 'Published' : 'In Progress'}</span>
          <span className="chapter-meta-sep" aria-hidden="true">·</span>
          <span>{chapter.readTime}</span>
          {chapter.date_pulled && (
            <>
              <span className="chapter-meta-sep" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#d4af37]" />
                <span>Pulled {chapter.date_pulled}</span>
              </span>
            </>
          )}
          {chapter.python_version && (
            <>
              <span className="chapter-meta-sep" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono text-xs">
                <Terminal className="w-3 h-3 text-[#d4af37]" />
                <span>Python {chapter.python_version}</span>
              </span>
            </>
          )}
          <span className="chapter-meta-sep" aria-hidden="true">·</span>
          <span>
            {chapter.tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                <button
                  onClick={() => onNavigate('tags')}
                  className="text-[#d4af37] hover:underline cursor-pointer"
                >
                  #{tag}
                </button>
                {idx < chapter.tags.length - 1 && ', '}
              </React.Fragment>
            ))}
          </span>
        </div>

        {/* Links to notebook and GitHub repo */}
        <div className="chapter-source-links">
          <a
            href={chapter.notebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Jupyter Notebook</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href={chapter.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Inspect GitHub Repository</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </header>

      {/* 2. "Verdict" box: 3-5 key findings + one-line verdict in a styled callout */}
      <aside className="book-callout" aria-label="The Empirical Verdict">
        <div className="callout-header">
          <span className="callout-title">The Empirical Verdict</span>
          <span className="callout-tagline">Key Findings &amp; Core Invariants</span>
        </div>

        <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--gold-light)', lineHeight: 1.6, marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px dashed rgba(212,175,55,0.25)' }}>
          <strong>One-Line Verdict:</strong> {chapter.verdict_summary}
        </div>

        <ul className="verdict-list">
          {chapter.verdict.map((finding, idx) => (
            <li key={idx} className="verdict-item">
              <span className="verdict-bullet">&#9670;</span>
              <div>{finding}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* 3. Body area for long-form writing */}
      {chapter.id === 'chapter-1' && (
        <div className="chapter-content drop-cap-p" itemProp="articleBody">
          <p>
            Every December across Kenyan university grounds, thousands of graduation gowns swirl under the midday sun. Families pool savings for buses from Kakamega, Murang'a, and Kilifi. Photographs are framed; elders speak of sacrifice rewarded. The underlying social contract has been etched into Kenyan culture for three generations: <em>work hard, get the degree, and the formal economy will absorb you.</em>
          </p>

          <p>
            Yet anyone riding the Stage 44 matatu into Nairobi Central Business District hears a different story from young conductors, graphic designers with bachelor's degrees, and graduates running online delivery accounts from Kasarani bedsitters.
          </p>

          <p>
            To separate anecdotal cynicism from statistical reality, this investigation examines the <strong>Kenya University Student Outcomes (KUSO)</strong> dataset—a longitudinal tracking cohort tracing 14,200 Kenyan university graduates across public and private institutions over their initial 36 months in the labor market.
          </p>

          <h2>I. The Pipeline &amp; The Six-Month Illusion</h2>

          <p>
            When career offices publish employment statistics, they frequently conflate "activity" with formal salaried absorption. In our baseline cleaning of the raw KUSO files, 61% of graduates reported "being engaged in economic work" within six months of graduation.
          </p>

          <p>
            However, decomposing that number by contract type reveals the underlying precarity:
          </p>

          <ul>
            <li>Only <strong>26.4%</strong> held verifiable formal contracts with retirement or medical benefits.</li>
            <li><strong>34.6%</strong> were in unpaid internships, academic teaching attachments, or probationary arrangements with stipends below the statutory minimum wage.</li>
            <li><strong>39.0%</strong> were actively searching or operating informal retail side-hustles while living with extended relatives.</li>
          </ul>

          <p>
            The median search duration before landing an initial formal contract was <strong>19.4 months</strong>. The transition is not a cliff; it is an endurance contest where parental liquidity dictates how long a graduate can afford to hold out for formal work.
          </p>

          {/* Figure 1: Wage Divergence */}
          <figure className="book-figure">
            <div className="book-figure-img-wrap">
              <img
                src="/assets/images/chapter-1/kuso-wage-divergence.svg"
                alt="Wage trajectory curves over 36 months for Kenyan graduates"
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
            <figcaption className="book-figcaption">
              <p className="figure-caption-text">
                Figure 1.1: Median monthly nominal income across disciplines indexed at graduation, 12, 24, and 36 months. Adjusted for cohort retention weighting.
              </p>
              <div className="figure-takeaway">
                <span className="takeaway-label">Key takeaway:</span>
                <span>STEM and Software graduates experience a compounding wage premium after Month 18, whereas General Arts cohorts plateau below entry-level cost of living in Nairobi.</span>
              </div>
            </figcaption>
          </figure>

          <h2>II. The Great Divergence: Field of Study vs. Real Absorption</h2>

          <p>
            The most striking pattern in the KUSO cohort is the irreversible divergence between fields. Up to Month 12, median reported compensation across all disciplines clusters tightly between KES 25,000 and KES 38,000 per month. Entry-level starting salaries in Kenya are largely compressed.
          </p>

          <p>
            Between Month 18 and Month 36, however, the curves splinter.
          </p>

          <h3>Computing &amp; Specialized Technical Fields</h3>
          <p>
            Graduates in Computer Science, Software Engineering, and specialized Data tracks showed the fastest trajectory. Despite an initial six-month scramble, by Month 36 their median monthly compensation rose to <strong>KES 88,500</strong>, propelled by remote contracting, fintech expansion in Nairobi, and competitive regional hiring.
          </p>

          <h3>General Commerce &amp; Business Administration</h3>
          <p>
            Business and Commerce degrees represent the largest undergraduate cohort in the country. Unfortunately, supply drastically outpaces formal absorption. By Month 24, over <strong>41% of business graduates</strong> had pivoted into informal trading, digital marketing gigs, or commission-based financial insurance sales without base retainers.
          </p>

          <div className="author-placeholder-callout">
            <strong>Author's Code &amp; Chart Insertion Point:</strong>
            If you have generated an updated seaborn regression plot for regional wage adjustments, paste your figure code block here or update <code>assets/images/chapter-1/</code> with your latest notebook output.
          </div>

          {/* Figure 2: Field Absorption Matrix */}
          <figure className="book-figure">
            <div className="book-figure-img-wrap">
              <img
                src="/assets/images/chapter-1/field-absorption-matrix.svg"
                alt="Labor absorption stacked bar chart across 5 university disciplines"
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
            <figcaption className="book-figcaption">
              <p className="figure-caption-text">
                Figure 1.2: Two-year destination matrix for graduates across five major undergraduate degree categories.
              </p>
              <div className="figure-takeaway">
                <span className="takeaway-label">Key takeaway:</span>
                <span>Over 40% of Humanities and Business graduates shift into the informal economy within 24 months to sustain basic urban livelihoods.</span>
              </div>
            </figcaption>
          </figure>

          <h2>III. The Geography of Opportunity: The Nairobi Gravity Well</h2>

          <p>
            A degree earned in Eldoret, Maseno, or Chuka carries the same academic weight on parchment. But labor market conversion depends almost entirely on proximity to the capital.
          </p>

          <p>
            Our geospatial mapping of employers issuing tax-compliant payslips revealed that <strong>68.2% of formal positions</strong> were physically registered in Nairobi County, followed by Kiambu (9.1%) and Mombasa (6.4%).
          </p>

          <p>
            Graduates who returned to their home counties faced what we term the <em>county wage discount</em>: an immediate 38% median earnings drop compared to peers of identical degree classifications living within the Nairobi metropolitan area. High Nairobi rents offset much of this advantage, but the raw career mobility remains stubbornly centralized.
          </p>

          <blockquote>
            "A degree is no longer an automatic ticket to the middle class; it is an audition slip that buys you the privilege to compete in an intensely crowded foyer."
          </blockquote>

          <h2>IV. Replicating This Analysis</h2>

          <p>
            All data manipulation scripts, regression models, and figure generation routines are open-source. The accompanying Jupyter notebook contains:
          </p>
          <ol>
            <li>Data cleaning pipelines handling multi-year survey attrition.</li>
            <li>Deflation routines utilizing KNBS CPI monthly baskets to calculate real purchasing power.</li>
            <li>Quantile regression modeling estimating the degree premium across income percentiles.</li>
          </ol>

          <p>
            Inspect the complete reproduction artifacts via the repository link in the header above or directly examine:
          </p>
          <ul>
            <li><code>notebooks/01_outcomes_investigation.ipynb</code></li>
            <li><code>scripts/clean_kuso_cohort.py</code></li>
            <li><code>data/processed/kuso_summary_metrics.parquet</code></li>
          </ul>
        </div>
      )}

      {/* Chapter 2: East African Business Story (Duka) */}
      {chapter.id === 'chapter-2' && (
        <div className="chapter-content drop-cap-p" itemProp="articleBody">
          <div className="author-placeholder-callout">
            <strong>Local East African Business Story · Forthcoming Autumn 2026</strong>
            This chapter is currently in the ledger harmonization and synthetic anonymization phase. 
            Counter book entries from 14 neighborhood shops in Nairobi are being cross-referenced with merchant M-Pesa till statements to reconstruct the liquidity heartbeat of informal urban retail.
          </div>

          <p>
            Across East Africa, FMCG conglomerates and corporate supermarket chains have spent decades predicting the imminent demise of the corner <em>duka</em>. Yet despite hypermarkets and digital quick-commerce startups, the humble kiosk continues to distribute over 70% of groceries in urban Kenya.
          </p>

          <p>
            Why? Because the supermarket requires immediate cash or card settlement. The duka sells milk at 6:30 AM on credit because the shopkeeper knows your mother, your landlord, and your pay cycle.
          </p>

          <h2>Preliminary Research Inquiries</h2>
          <ol>
            <li>
              <strong>The Credit Ledger Ratio:</strong> What percentage of monthly turnover is trapped in paper counter books (<em>kitabu cha deni</em>), and how does default risk correlate with end-of-month salary delays?
            </li>
            <li>
              <strong>The M-Pesa Float Squeeze:</strong> How do shopkeepers manage the friction between customers paying digitally via Lipa Na M-Pesa and distributors demanding physical bank deposits or cash-on-delivery?
            </li>
            <li>
              <strong>The Micro-Inventory Elasticity:</strong> When cooking oil or maize flour prices spike due to import duties, how do dukas resize package units (the <em>kadogo</em> economy) to protect working capital?
            </li>
          </ol>

          <h2>Methodology &amp; Tooling Under Construction</h2>
          <ul>
            <li><strong>Raw Data:</strong> 42,000 anonymized transaction rows, 14 counter credit ledgers, and matching M-Pesa merchant statement extracts.</li>
            <li><strong>Data Engineering:</strong> SQL Window Functions and CTEs in PostgreSQL to model cash conversion cycles.</li>
            <li><strong>Reporting Artifacts:</strong> Interactive Star Schema Power BI visual model and Python econometric regression tables.</li>
          </ul>
        </div>
      )}

      {/* Chapter 3: Nairobi Matatu paratransit */}
      {chapter.id === 'chapter-3' && (
        <div className="chapter-content drop-cap-p" itemProp="articleBody">
          <div className="author-placeholder-callout">
            <strong>Investigation In Progress · Forthcoming Autumn 2026</strong>
            This chapter is currently in the spatial trajectory cleaning and agent-based simulation phase. Field GPS traces from 130 Nairobi Savings and Credit Cooperative Organizations (SACCOs) are being matched against open street network topologies.
          </div>

          <p>
            Nairobi's matatu network is frequently characterized by outside urban planners as chaotic, noisy, and inefficient. Yet for over four million daily commuters, it represents an extraordinarily responsive, self-organizing paratransit ecosystem that functions without municipal capital subsidies.
          </p>

          <h2>Preliminary Research Inquiries</h2>
          <ol>
            <li>What does the real graph topology of Nairobi's informal routes look like when reconstructed from raw GPS traces?</li>
            <li>If we simulate route consolidation to minimize passenger idle time, what happens to operator revenue and staging bottlenecks at Koja, Muthurwa, and Kencom?</li>
            <li>How do informal dynamic pricing surges behave during sudden tropical downpours?</li>
          </ol>

          <h2>Tooling Under Construction</h2>
          <ul>
            <li><strong>Raw Data:</strong> Over 12 million spatial GPS pings across 45 designated routes (Route 44, 23, 111, 102, 58, 33).</li>
            <li><strong>Tooling:</strong> Python (<code>geopandas</code>, <code>shapely</code>, <code>networkx</code>, <code>osmnx</code>), PostgreSQL + PostGIS spatial indexing.</li>
          </ul>
        </div>
      )}

      {/* 4. "Where the numbers can mislead" limitations section */}
      <section className="limitations-box" aria-labelledby="limitations-heading">
        <h2 id="limitations-heading" className="limitations-title">
          <AlertTriangle className="w-5 h-5 text-[#d4af37]" />
          <span>Where the Numbers Can Mislead</span>
        </h2>
        <span className="limitations-subtitle">
          Methodological boundaries, survey survivor bias, and unobserved variables
        </span>

        <ul className="limitations-list">
          {chapter.limitations.map((item, idx) => (
            <li key={idx} className="limitation-item">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Related Trail Entries via shared tags */}
      {matchingPosts.length > 0 && (
        <div className="related-trail-box">
          <h3 className="related-trail-heading">Field Notes from The Trail on this Topic</h3>
          <ul className="related-trail-list">
            {matchingPosts.map((post) => (
              <li key={post.id} className="related-trail-item">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                  {post.date}
                </span>
                <button
                  onClick={() => onSelectPost(post.id)}
                  className="text-left text-inherit cursor-pointer hover:text-[#e6c86e]"
                >
                  {post.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Prev/Next chapter navigation */}
      <nav className="chapter-nav-wrapper" aria-label="Chapter Navigation">
        <div>
          {prevChapter ? (
            <button
              onClick={() => onSelectChapter(prevChapter.id)}
              className="chapter-nav-link prev w-full text-left cursor-pointer"
            >
              <span className="nav-direction">&larr; Previous Chapter</span>
              <span className="nav-chapter-title">
                {prevChapter.numeral}: {prevChapter.title}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('cover')}
              className="chapter-nav-link prev w-full text-left cursor-pointer opacity-75"
            >
              <span className="nav-direction">&larr; Frontispiece</span>
              <span className="nav-chapter-title">Table of Contents</span>
            </button>
          )}
        </div>

        <div>
          {nextChapter && (
            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="chapter-nav-link next w-full text-right cursor-pointer"
            >
              <span className="nav-direction">Next Chapter &rarr;</span>
              <span className="nav-chapter-title">
                {nextChapter.numeral}: {nextChapter.title}
              </span>
            </button>
          )}
        </div>
      </nav>
    </article>
  );
};
