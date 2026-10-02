import React from 'react';

export const ToolkitView: React.FC = () => {
  return (
    <article className="reading-container">
      <header className="author-header">
        <h1 className="author-title">The Toolkit</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--gold-light)', fontStyle: 'italic', marginTop: '0.35rem' }}>
          Tools grouped across the full path: Engineering the foundation, Science for inference, Analysis for clarity.
        </p>
      </header>

      <div className="chapter-content drop-cap-p">
        <p>
          A data guy doesn't believe in silver-bullet tools. Tools are instruments of verification. This page organizes my analytical workbench into the three overlapping domains of the craft.
        </p>

        <div className="toolkit-grid">
          {/* Area 1: Data Engineering */}
          <div className="toolkit-card">
            <div className="toolkit-card-header">
              <h2 className="toolkit-card-title">01. Data Engineering</h2>
              <span className="toolkit-card-focus">Ingestion, Sanitation &amp; Relational Architecture</span>
            </div>
            <ul className="toolkit-stack-list">
              <li className="toolkit-stack-item">
                <strong>Engines &amp; Relational SQL:</strong>
                <span><code>PostgreSQL</code> for normalized transactional models; <code>DuckDB</code> for lightning-fast vectorized queries on local Parquet files.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>High-Throughput ETL:</strong>
                <span><code>polars</code> for memory-efficient, multi-threaded columnar transformations on large event telemetry.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Data Integrity Auditing:</strong>
                <span>Schema constraint enforcement, foreign key referential integrity audits, anomaly detection via recursive CTEs and window functions.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Discipline:</strong>
                <span>Reproducible, idempotent transformation scripts; raw data is immutable and never edited in-place.</span>
              </li>
            </ul>
          </div>

          {/* Area 2: Data Science */}
          <div className="toolkit-card">
            <div className="toolkit-card-header">
              <h2 className="toolkit-card-title">02. Data Science</h2>
              <span className="toolkit-card-focus">Statistical Inference, Hypothesis Testing &amp; Modeling</span>
            </div>
            <ul className="toolkit-stack-list">
              <li className="toolkit-stack-item">
                <strong>Econometric &amp; Statistical Modeling:</strong>
                <span><code>statsmodels</code> for OLS regression, heteroskedasticity corrections, and quantile regressions across income distributions.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Distribution Analysis:</strong>
                <span><code>scipy.stats</code> for empirical distribution fitting, survivor bias evaluation, and non-parametric rank tests.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Network &amp; Spatial Modeling:</strong>
                <span><code>networkx</code> and <code>geopandas</code> for paratransit route graph extraction, transit speed analysis, and spatial clustering.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Notebook Discipline:</strong>
                <span>Sequential idempotency (no out-of-order execution); notebooks stripped of transient cache before version control.</span>
              </li>
            </ul>
          </div>

          {/* Area 3: Data Analysis */}
          <div className="toolkit-card">
            <div className="toolkit-card-header">
              <h2 className="toolkit-card-title">03. Data Analysis</h2>
              <span className="toolkit-card-focus">Dimensional Modeling, DAX &amp; Decision Storytelling</span>
            </div>
            <ul className="toolkit-stack-list">
              <li className="toolkit-stack-item">
                <strong>Dimensional Semantics:</strong>
                <span>Strict Star Schema architecture (Kimball methodology); single-direction one-to-many relationships; dedicated measure tables.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Advanced DAX:</strong>
                <span>Time intelligence, semi-additive snapshotting, context transitions via <code>CALCULATE()</code> and <code>KEEPFILTERS()</code>.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Editorial Visualization:</strong>
                <span>High data-to-ink ratio with <code>seaborn</code> and Power BI; zero 3D gauges or decorative clutter. Every chart carries a one-line takeaway.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Decision Translation:</strong>
                <span>Translating complex variance curves into concise, plain-English executive monographs and verdicts.</span>
              </li>
            </ul>
          </div>
        </div>

        <h2>My Working Rules Across the Whole Path</h2>

        <ol>
          <li>
            <strong>Verify the raw grain before writing a single aggregate:</strong> What constitutes one row in this table? A person, a transaction, an attempt, or a snapshot?
          </li>
          <li>
            <strong>Never report a mean without an accompanying interquartile range:</strong> Highly skewed distributions render simple averages actively deceptive.
          </li>
          <li>
            <strong>Trace the provenance:</strong> Who recorded this number, under what commercial or institutional incentives, and who is missing from the sample?
          </li>
          <li>
            <strong>Reproducibility or it didn't happen:</strong> Every chapter in this book includes clean scripts capable of running from the raw dataset to the final figure without manual intervention.
          </li>
        </ol>
      </div>
    </article>
  );
};
