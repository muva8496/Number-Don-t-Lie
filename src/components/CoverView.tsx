import React from 'react';
import { CHAPTERS_DATA, POSTS_DATA } from '../jekyllData';
import { ArrowRight, BookMarked, Terminal, LayoutDashboard, Briefcase } from 'lucide-react';

interface CoverViewProps {
  onSelectChapter: (id: string) => void;
  onSelectPost: (id: string) => void;
  onNavigate: (tab: string) => void;
  isAuthorMode?: boolean;
  onOpenSourceInspector?: () => void;
}

export const CoverView: React.FC<CoverViewProps> = ({
  onSelectChapter,
  onSelectPost,
  onNavigate,
  isAuthorMode = false,
  onOpenSourceInspector
}) => {
  return (
    <div className="reading-container">
      {/* Frontispiece / Cover */}
      <header className="book-cover">
        <span className="book-supertitle">An Investigative Data Folio</span>
        <h1 className="book-title">NDL: Numbers Don't Lie</h1>
        <p className="book-subtitle">A collection of empirical inquiries into Kenya's socio-economic ledger</p>

        <div className="book-rule" role="presentation"></div>

        <p className="book-premise">
          Most dashboards show you what happened yesterday at 5:00 PM; books examine what endures. 
          <em> Numbers Don't Lie</em> is built like a volume of long-form data journalism. 
          Each chapter inspects an authentic Kenyan dataset—interrogating its distributions, 
          isolating its systemic discrepancies, and demonstrating where standard statistical narratives deceive. 
          Between the chapters lies <em>The Trail</em>: short field notes on the philosophy, messiness, and craft of working with real data in Nairobi.
        </p>

        <div className="book-colophon-inline">
          <span>By Moses Mukangai</span>
          <span aria-hidden="true">·</span>
          <span>Data Guy</span>
          <span aria-hidden="true">·</span>
          <span>Nairobi, Kenya</span>
        </div>
      </header>

      {/* Part I: The Evidence (Table of Chapters) */}
      <section id="toc" className="toc-section" aria-labelledby="toc-heading">
        <span className="section-part-kicker">Part I · The Evidence</span>
        <h2 id="toc-heading" className="section-title">Table of Chapters</h2>

        <ol className="toc-list">
          {CHAPTERS_DATA.filter((c) => c.status === 'published' || c.status === 'coming-soon').map((chapter) => (
            <li key={chapter.id} className="toc-entry">
              <div className="toc-header">
                <div>
                  <span className="toc-numeral">{chapter.numeral}</span>
                  {chapter.status === 'published' ? (
                    <button
                      onClick={() => onSelectChapter(chapter.id)}
                      className="toc-link text-left cursor-pointer hover:underline"
                    >
                      {chapter.title}
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectChapter(chapter.id)}
                      className="toc-link text-left cursor-pointer opacity-90 hover:text-[#d4af37]"
                    >
                      {chapter.title}
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {/* Primary lens label */}
                  {chapter.primary_lens && (
                    <span className="font-mono text-[11px] text-[#e6c86e] tracking-wider uppercase px-1.5 py-0.5 border border-[#d4af37]/30 rounded-sm">
                      {chapter.primary_lens}
                    </span>
                  )}
                  <span className={`toc-status ${chapter.status === 'published' ? 'published text-[#e6c86e]' : 'text-[#879287]'}`}>
                    {chapter.status === 'published' ? 'Published' : 'In Progress'}
                  </span>
                </div>
              </div>

              <span className="toc-dataset">Dataset: {chapter.dataset}</span>
              <p className="toc-teaser">{chapter.summary}</p>

              {/* Tags listed cleanly without pill enclosure */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-xs text-[#879287]">
                <span className="text-[#879287]">Tagged:</span>
                {chapter.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <button
                      onClick={() => onNavigate('tags')}
                      className="text-[#d4af37] hover:underline cursor-pointer"
                    >
                      #{tag}
                    </button>
                    {idx < chapter.tags.length - 1 && (
                      <span aria-hidden="true" className="text-[#879287]">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-3.5 flex items-center gap-4">
                <button
                  onClick={() => onSelectChapter(chapter.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#e6c86e] font-serif transition-colors cursor-pointer"
                >
                  <span>{chapter.status === 'published' ? 'Read Chapter' : 'Inspect Research Inquiry'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Part II: The Trail (Recent Field Notes Preview) */}
      <section className="toc-section" style={{ marginTop: '4rem' }}>
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <span className="section-part-kicker">Part II · Field Notes</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>The Trail</h2>
          </div>
          <button
            onClick={() => onNavigate('trail')}
            className="nav-link cursor-pointer text-sm"
          >
            View all field notes &rarr;
          </button>
        </div>

        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
          Informal essays, statistical sanity checks, and dispatches from data cleaning pipelines—including our public <code className="text-[#e6c86e]">#numbers-i-got-wrong</code> changelog.
        </p>

        <ul className="trail-posts-list">
          {POSTS_DATA.slice(0, 3).map((post) => (
            <li key={post.id} className="trail-post-card">
              <div className="trail-post-meta">
                <time>{post.date}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>

              <h3 className="trail-post-title">
                <button
                  onClick={() => onSelectPost(post.id)}
                  className="text-left text-inherit cursor-pointer hover:text-[#e6c86e] transition-colors"
                >
                  {post.title}
                </button>
              </h3>

              <p className="trail-post-excerpt">{post.excerpt}</p>

              <div className="trail-tags">
                <span style={{ color: 'var(--text-muted)' }}>Filed under:</span>
                {post.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <button
                      onClick={() => onNavigate('tags')}
                      className={`trail-tag-link cursor-pointer ${tag === 'numbers-i-got-wrong' ? 'text-[#f87171] font-medium' : ''}`}
                    >
                      #{tag}
                    </button>
                    {idx < post.tags.length - 1 && (
                      <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Specialized Rooms */}
      <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-[#092016] border border-[#d4af37]/20 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] mb-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-xs uppercase font-serif tracking-widest font-semibold">Production Work</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#f5f2ea] mb-1">The Dashboard Room</h4>
            <p className="text-xs text-[#c9c3b4] leading-relaxed">
              Curated Power BI semantic models: Star schemas, DAX context modeling, and decision-grade reporting walkthroughs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboards')}
            className="mt-4 text-xs text-[#d4af37] hover:underline self-start cursor-pointer inline-flex items-center gap-1"
          >
            <span>Enter Dashboard Room</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-6 bg-[#092016] border border-[#d4af37]/20 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] mb-2">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs uppercase font-serif tracking-widest font-semibold">Consulting &amp; Sprints</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-[#f5f2ea] mb-1">Work with Me</h4>
            <p className="text-xs text-[#c9c3b4] leading-relaxed">
              Collaborate across the whole path: exploratory forensics, Star Schema Power BI pipelines, and econometric research.
            </p>
          </div>
          <button
            onClick={() => onNavigate('work-with-me')}
            className="mt-4 text-xs text-[#d4af37] hover:underline self-start cursor-pointer inline-flex items-center gap-1"
          >
            <span>View Services &amp; Contact</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* AUTHOR-ONLY SECTION: Completely omitted from DOM for public visitors */}
      {isAuthorMode && onOpenSourceInspector && (
        <div className="mt-12 p-6 rounded-sm bg-[#091f16] border border-[#d4af37]/25 text-sm text-[#c9c3b4]">
          <div className="flex items-start gap-3">
            <BookMarked className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-[#f5f2ea] text-base">
                Author Mode · Jekyll Static Site Architecture
              </h4>
              <p className="text-xs leading-relaxed">
                You are authenticated as the author. All source files and deployment packages are ready for GitHub Pages synchronization.
              </p>
              <div className="pt-1 flex flex-wrap gap-4 text-xs font-mono">
                <button
                  onClick={onOpenSourceInspector}
                  className="text-[#d4af37] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Inspect Jekyll Source Files</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
