import React from 'react';
import { Github, Mail, MapPin, Layers } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <article className="reading-container">
      <header className="author-header">
        <h1 className="author-title">About the Author</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--gold-light)', fontStyle: 'italic', marginTop: '0.35rem' }}>
          Data guy at the intersection of analysis, engineering and science.
        </p>
      </header>

      <div className="chapter-content drop-cap-p">
        <p>
          I am based in Nairobi, Kenya. You won't find a single rigid corporate label like "data analyst", "data engineer", or "data scientist" here. 
        </p>

        <p>
          I call myself simply <strong>a data guy</strong>.
        </p>

        <p>
          In practice, real-world data work rarely respects organizational silos. If your pipeline is broken, your statistical model is hallucinating noise; if your analysis fails to grasp the underlying schema, your dashboard communicates falsehoods; and if you cannot translate numbers into an honest, lucid narrative, the entire exercise is futile.
        </p>

        <p>
          I work across the whole path: from collecting and sanitizing raw records, to architecting pipelines and queries, to statistical modeling, to communicating the answer.
        </p>

        <h2>The Intersection: Where I Stand</h2>

        {/* Three-part overlapping triad section with Data Guy in the center */}
        <div className="my-8 p-6 sm:p-8 bg-[#0d221a] border border-[#d4af37]/30 rounded-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#071610] border-2 border-[#d4af37] rounded-sm text-[#f5f2ea] font-serif text-xl font-bold tracking-wider">
              <Layers className="w-5 h-5 text-[#d4af37]" />
              <span>DATA GUY</span>
            </div>
            <p className="text-xs text-[#879287] mt-2 font-serif italic">
              Standing at the convergence of three complementary disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Area 1: Data Engineering */}
            <div className="p-4 bg-[#091f16] border border-[#d4af37]/20 rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-[#d4af37] block uppercase tracking-wider mb-1">
                  Pillar 01
                </span>
                <h3 className="font-serif text-lg font-bold text-[#f5f2ea] mb-2 pb-2 border-b border-[#d4af37]/15">
                  Engineering
                </h3>
                <p className="text-xs text-[#c9c3b4] leading-relaxed">
                  <span className="text-[#e6c86e] font-mono text-[11px] block mb-1">[AUTHOR PLACEHOLDER]:</span>
                  I build resilient ingestion scripts, design relational schemas, and wrangle messy local spreadsheets and APIs into clean, performant Parquet tables and SQL databases.
                </p>
              </div>
            </div>

            {/* Area 2: Data Science */}
            <div className="p-4 bg-[#091f16] border border-[#d4af37]/20 rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-[#d4af37] block uppercase tracking-wider mb-1">
                  Pillar 02
                </span>
                <h3 className="font-serif text-lg font-bold text-[#f5f2ea] mb-2 pb-2 border-b border-[#d4af37]/15">
                  Science
                </h3>
                <p className="text-xs text-[#c9c3b4] leading-relaxed">
                  <span className="text-[#e6c86e] font-mono text-[11px] block mb-1">[AUTHOR PLACEHOLDER]:</span>
                  I test statistical invariants, evaluate survivor bias, fit distributions, and run regression models in Python to separate genuine macro signal from sample noise.
                </p>
              </div>
            </div>

            {/* Area 3: Data Analysis */}
            <div className="p-4 bg-[#091f16] border border-[#d4af37]/20 rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-[#d4af37] block uppercase tracking-wider mb-1">
                  Pillar 03
                </span>
                <h3 className="font-serif text-lg font-bold text-[#f5f2ea] mb-2 pb-2 border-b border-[#d4af37]/15">
                  Analysis
                </h3>
                <p className="text-xs text-[#c9c3b4] leading-relaxed">
                  <span className="text-[#e6c86e] font-mono text-[11px] block mb-1">[AUTHOR PLACEHOLDER]:</span>
                  I build Star Schema semantic models, write surgical DAX measures, and translate empirical findings into lucid, decision-grade prose and publication charts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2>The Philosophy of NDL</h2>

        <p>
          I built <em>NDL: Numbers Don't Lie</em> because traditional tech portfolios feel like marketing brochures. They display cherry-picked Kaggle scores, surface-level classification models, and visualizations designed to impress rather than inform.
        </p>

        <p>
          Books, however, demand rigor. When you open a book:
        </p>

        <ol>
          <li>You expect a coherent argument framed around a genuine question.</li>
          <li>You examine the evidence and where the empirical bounds hold.</li>
          <li>You expect the author to be transparent about missing variables, unrecorded cash transactions, and survivor bias.</li>
        </ol>

        <p>
          Every chapter in Part I is an investigation into an actual public or anonymized dataset. Every entry in The Trail is a short, unvarnished field note from the craft.
        </p>

        <h2>Location &amp; Working Together</h2>

        <div className="my-6 p-4 rounded-sm bg-[#0d221a] border border-[#d4af37]/25 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#f5f2ea] block text-sm">Nairobi, Kenya (EAT / UTC+3)</strong>
              <span className="text-xs text-[#c9c3b4]">
                Operating locally across East Africa's economic data landscape; exploring labor mobility, informal retail credit, and transport networks.
              </span>
            </div>
          </div>
        </div>

        <p>
          If you are looking for someone who takes responsibility for the whole path from raw records to final verdict:
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <a
            href="https://github.com/Muva8496"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#0d221a] border border-[#d4af37]/30 hover:border-[#d4af37] text-sm text-[#f5f2ea] rounded-sm inline-flex items-center gap-2 transition-colors"
          >
            <Github className="w-4 h-4 text-[#d4af37]" />
            <span>github.com/Muva8496</span>
          </a>

          <a
            href="mailto:mosesmukangai75@gmail.com"
            className="px-4 py-2 bg-[#0d221a] border border-[#d4af37]/30 text-sm text-[#c9c3b4] hover:text-[#f5f2ea] rounded-sm inline-flex items-center gap-2 transition-colors"
          >
            <Mail className="w-4 h-4 text-[#d4af37]" />
            <span>mosesmukangai75@gmail.com</span>
          </a>
        </div>
      </div>
    </article>
  );
};
