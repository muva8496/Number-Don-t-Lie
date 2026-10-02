import React from 'react';
import { Mail, Github } from 'lucide-react';

export const WorkWithMeView: React.FC = () => {
  return (
    <article className="reading-container">
      <header className="author-header">
        <h1 className="author-title">Work with Me</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--gold-light)', fontStyle: 'italic', marginTop: '0.35rem' }}>
          Data guy at the intersection of analysis, engineering and science.
        </p>
      </header>

      <div className="chapter-content drop-cap-p">
        <p>
          If you are looking for someone to generate vanity charts with neon gradients that make every quarter look like hockey-stick growth, I am the wrong person to hire.
        </p>

        <p>
          However, if you have messy, high-stakes data and need a <strong>data guy</strong> who works across the entire path—from collecting and cleaning data, to building pipelines and queries, to statistical modeling, to communicating the answer—let's collaborate.
        </p>

        <h2>The Kinds of Projects I Take</h2>

        <div className="toolkit-grid">
          {/* Project 1 */}
          <div className="toolkit-card">
            <div className="toolkit-card-header">
              <h3 className="toolkit-card-title">01. Exploratory Forensics &amp; Engineering</h3>
              <span className="toolkit-card-focus">Data Engineering + Forensic Analysis</span>
            </div>
            <ul className="toolkit-stack-list">
              <li className="toolkit-stack-item">
                <strong>What we do:</strong>
                <span>Audit transactional databases, isolate survivor bias, and detect discrepancies between raw logs and management reports.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Scenarios:</strong>
                <span>M-Pesa till reconciliation mismatches, unexplained inventory shrinkage, inconsistent survey response curves.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Deliverable:</strong>
                <span>Forensic report with distribution charts, root-cause decomposition, and reproducible SQL/Python scripts.</span>
              </li>
            </ul>
          </div>

          {/* Project 2 */}
          <div className="toolkit-card">
            <div className="toolkit-card-header">
              <h3 className="toolkit-card-title">02. Power BI Semantic Architecture</h3>
              <span className="toolkit-card-focus">Data Analysis + Dimensional Modeling</span>
            </div>
            <ul className="toolkit-stack-list">
              <li className="toolkit-stack-item">
                <strong>What we do:</strong>
                <span>Replace dozens of brittle copy-pasted Excel spreadsheets with a single, Kimball-modeled Power BI semantic layer.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Core craft:</strong>
                <span>Strict one-to-many relationships, performance-tuned DAX time intelligence, executive layout with zero clutter.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Deliverable:</strong>
                <span>Turnkey <code>.pbix</code> model, automated refresh pipelines, and an executive user manual.</span>
              </li>
            </ul>
          </div>

          {/* Project 3 */}
          <div className="toolkit-card">
            <div className="toolkit-card-header">
              <h3 className="toolkit-card-title">03. Econometric &amp; Cohort Modeling</h3>
              <span className="toolkit-card-focus">Data Science + Policy Inference</span>
            </div>
            <ul className="toolkit-stack-list">
              <li className="toolkit-stack-item">
                <strong>What we do:</strong>
                <span>Conduct longitudinal cohort tracking, quantile regressions, and labor or market policy evaluations.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Tooling:</strong>
                <span>Python (<code>polars</code>, <code>statsmodels</code>, <code>seaborn</code>), reproducible Jupyter notebooks, publication-grade figures.</span>
              </li>
              <li className="toolkit-stack-item">
                <strong>Deliverable:</strong>
                <span>Monograph-style written investigation with all limitations transparently documented.</span>
              </li>
            </ul>
          </div>
        </div>

        <h2>How I Work</h2>

        <ol>
          <li>
            <strong>The Whole Path:</strong> I don't stop at writing a SQL query or hand off an uninterpretable notebook. I ensure the pipeline is sound, the model is rigorous, and the answer is translated into plain English.
          </li>
          <li>
            <strong>Honesty Over Optimism:</strong> If your sample size is too small or survivor bias makes an aggregate unreliable, I will tell you upfront rather than flatter a corporate narrative.
          </li>
          <li>
            <strong>Open Source &amp; Reproducible:</strong> You receive every line of code. No proprietary black boxes. If I build a pipeline, your internal team can run and modify it tomorrow.
          </li>
        </ol>

        <h2>Engagement Models</h2>

        <ul>
          <li><strong>Fixed-Scope Sprints (2–4 weeks):</strong> Ideal for forensic data audits, exploratory cohort analyses, or end-to-end Power BI semantic redesigns.</li>
          <li><strong>Part-Time Analytical Retainers:</strong> 10–15 hours/week for teams who need ongoing SQL, Python modeling, and reporting leadership across the whole path.</li>
          <li><strong>Contract Empirical Fellowships:</strong> Collaborative research focused on East African urban dynamics, youth labor markets, and informal retail finance.</li>
        </ul>

        <h2>Start a Conversation</h2>

        <p>
          Send an email with a brief paragraph describing your dataset, what decision hinges on it, and where your current reporting falls short:
        </p>

        <div className="my-6 p-6 rounded-sm bg-[#0d221a] border border-[#d4af37]/30">
          <div className="flex flex-col gap-2">
            <span className="font-serif text-2xl font-bold text-[#d4af37]">
              Moses Mukangai
            </span>
            <span className="text-sm font-semibold text-[#f5f2ea]">
              Data Guy · Nairobi, Kenya (EAT / UTC+3)
            </span>
            <span className="text-xs text-[#e6c86e] font-serif italic mb-2">
              Data guy at the intersection of analysis, engineering and science.
            </span>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              <a
                href="mailto:mosesmukangai75@gmail.com"
                className="inline-flex items-center gap-2 text-[#e6c86e] hover:underline"
              >
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>mosesmukangai75@gmail.com</span>
              </a>
              <a
                href="https://github.com/Muva8496"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c9c3b4] hover:text-[#f5f2ea]"
              >
                <Github className="w-4 h-4 text-[#d4af37]" />
                <span>GitHub: @Muva8496</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
