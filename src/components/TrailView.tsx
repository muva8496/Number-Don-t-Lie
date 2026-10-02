import React from 'react';
import { POSTS_DATA, CHAPTERS_DATA } from '../jekyllData';
import { ArrowLeft, ArrowRight, Rss, Tag, Clock } from 'lucide-react';

interface TrailViewProps {
  activePostId: string | null;
  onSelectPost: (id: string | null) => void;
  onSelectChapter: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const TrailView: React.FC<TrailViewProps> = ({
  activePostId,
  onSelectPost,
  onSelectChapter,
  onNavigate
}) => {
  const activePost = activePostId ? POSTS_DATA.find((p) => p.id === activePostId) : null;

  if (activePost) {
    const postIndex = POSTS_DATA.findIndex((p) => p.id === activePost.id);
    const prevPost = postIndex > 0 ? POSTS_DATA[postIndex - 1] : null;
    const nextPost = postIndex < POSTS_DATA.length - 1 ? POSTS_DATA[postIndex + 1] : null;

    // Related chapters by shared tags
    const relatedChapters = CHAPTERS_DATA.filter((ch) =>
      ch.tags.some((t) => activePost.tags.includes(t))
    );

    return (
      <article className="reading-container" itemScope itemType="https://schema.org/BlogPosting">
        <header className="trail-header">
          <div className="mb-4">
            <button
              onClick={() => onSelectPost(null)}
              className="inline-flex items-center gap-1 text-xs tracking-widest uppercase font-serif text-[#d4af37] hover:text-[#e6c86e] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to The Trail Archive</span>
            </button>
          </div>

          <h1 className="trail-title" itemProp="headline" style={{ fontSize: '2.6rem', lineHeight: 1.2 }}>
            {activePost.title}
          </h1>

          <div className="trail-post-meta">
            <time itemProp="datePublished">{activePost.date}</time>
            <span aria-hidden="true">·</span>
            <span>{activePost.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>By Moses Mukangai</span>
          </div>

          <div className="trail-tags mt-3">
            <span style={{ color: 'var(--text-muted)' }}>Tagged:</span>
            {activePost.tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                <button
                  onClick={() => onNavigate('tags')}
                  className="trail-tag-link cursor-pointer"
                >
                  #{tag}
                </button>
                {idx < activePost.tags.length - 1 && (
                  <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </header>

        <div className="chapter-content drop-cap-p" itemProp="articleBody">
          {activePost.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-serif text-2xl text-[#e6c86e] mt-8 mb-3 font-semibold">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('```python')) {
              const code = paragraph.replace('```python\n', '').replace('```', '');
              return (
                <pre key={idx} className="my-6 p-4 rounded bg-[#05110c] border border-[#d4af37]/20 overflow-x-auto">
                  <code className="text-xs font-mono text-[#e6c86e] leading-relaxed block">{code}</code>
                </pre>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n- ');
              return (
                <ul key={idx} className="list-disc pl-6 my-4 space-y-2 text-[#c9c3b4]">
                  {items.map((it, i) => (
                    <li key={i}>{it.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="mb-6 leading-relaxed text-[#c9c3b4]">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Related Chapters */}
        {relatedChapters.length > 0 && (
          <div className="related-trail-box" style={{ marginTop: '4rem' }}>
            <h3 className="related-trail-heading">Evidence Chapters Connected to this Field Note</h3>
            <ul className="related-trail-list">
              {relatedChapters.map((ch) => (
                <li key={ch.id} className="related-trail-item">
                  <span style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-display)', marginRight: '0.4rem' }}>
                    {ch.numeral}:
                  </span>
                  <button
                    onClick={() => onSelectChapter(ch.id)}
                    className="text-left text-inherit cursor-pointer hover:text-[#e6c86e]"
                  >
                    {ch.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation between notes */}
        <nav className="chapter-nav-wrapper" style={{ marginTop: '3.5rem' }}>
          <div>
            {prevPost && (
              <button
                onClick={() => onSelectPost(prevPost.id)}
                className="chapter-nav-link prev w-full text-left cursor-pointer"
              >
                <span className="nav-direction">&larr; Older Note</span>
                <span className="nav-chapter-title">{prevPost.title}</span>
              </button>
            )}
          </div>
          <div>
            {nextPost && (
              <button
                onClick={() => onSelectPost(nextPost.id)}
                className="chapter-nav-link next w-full text-right cursor-pointer"
              >
                <span className="nav-direction">Newer Note &rarr;</span>
                <span className="nav-chapter-title">{nextPost.title}</span>
              </button>
            )}
          </div>
        </nav>
      </article>
    );
  }

  // Archive view
  return (
    <div className="reading-container">
      <header className="trail-header">
        <span className="section-part-kicker">Part II · Chronological Dispatch</span>
        <h1 className="trail-title">The Trail</h1>
        <p className="trail-premise">
          Between deep dive chapters lies <em>The Trail</em>—a notebook of short, date-stamped reflections on statistical intuition, dataset idiosyncrasies, and what happens when clean theoretical models collide with Nairobi's real-world economy.
        </p>
      </header>

      <ul className="trail-posts-list">
        {POSTS_DATA.map((post) => (
          <li key={post.id} className="trail-post-card">
            <div className="trail-post-meta">
              <time>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
            </div>

            <h2 className="trail-post-title">
              <button
                onClick={() => onSelectPost(post.id)}
                className="text-left text-inherit cursor-pointer hover:text-[#e6c86e] transition-colors"
              >
                {post.title}
              </button>
            </h2>

            <div className="trail-post-excerpt">{post.excerpt}</div>

            <div className="trail-tags">
              <span style={{ color: 'var(--text-muted)' }}>Filed under:</span>
              {post.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <button
                    onClick={() => onNavigate('tags')}
                    className="trail-tag-link cursor-pointer"
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

      <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid var(--gold-border)', paddingTop: '2rem' }}>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-book-toc inline-flex items-center gap-1.5"
        >
          <Rss className="w-3.5 h-3.5" />
          <span>Subscribe via RSS Feed</span>
        </a>
      </div>
    </div>
  );
};
