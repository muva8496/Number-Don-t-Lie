import React, { useState } from 'react';
import { POSTS_DATA, CHAPTERS_DATA } from '../jekyllData';
import { Tag, ArrowLeft } from 'lucide-react';

interface TagsViewProps {
  onSelectChapter: (id: string) => void;
  onSelectPost: (id: string) => void;
}

export const TagsView: React.FC<TagsViewProps> = ({
  onSelectChapter,
  onSelectPost
}) => {
  // Aggregate all unique tags
  const allTags = Array.from(
    new Set([
      ...CHAPTERS_DATA.flatMap((c) => c.tags),
      ...POSTS_DATA.flatMap((p) => p.tags)
    ])
  ).sort();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredChapters = selectedTag
    ? CHAPTERS_DATA.filter((c) => c.tags.includes(selectedTag))
    : [];

  const filteredPosts = selectedTag
    ? POSTS_DATA.filter((p) => p.tags.includes(selectedTag))
    : [];

  return (
    <div className="reading-container">
      <header className="trail-header">
        <span className="section-part-kicker">Catalog &amp; Subject Taxonomy</span>
        <h1 className="trail-title">Topics on The Trail</h1>
        <p className="trail-premise">
          Browse chapters and field notes grouped by methodology, domain, and tooling.
        </p>
      </header>

      {/* Tag Directory */}
      <div className="flex flex-wrap gap-3 pb-8 mb-10 border-b border-[#d4af37]/25">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 text-xs font-serif rounded-sm border transition-all cursor-pointer ${
            selectedTag === null
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5f2ea]'
              : 'border-[#d4af37]/20 text-[#c9c3b4] hover:text-[#d4af37]'
          }`}
        >
          All Topics ({allTags.length})
        </button>
        {allTags.map((tag) => {
          const count =
            CHAPTERS_DATA.filter((c) => c.tags.includes(tag)).length +
            POSTS_DATA.filter((p) => p.tags.includes(tag)).length;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-xs font-serif rounded-sm border transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5f2ea]'
                  : 'border-[#d4af37]/20 text-[#c9c3b4] hover:text-[#d4af37]'
              }`}
            >
              #{tag} <span className="font-mono text-[10px] text-[#879287]">({count})</span>
            </button>
          );
        })}
      </div>

      {selectedTag ? (
        <section>
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#d4af37]/20">
            <h2 className="font-serif text-2xl text-[#e6c86e]">
              Tagged: #{selectedTag}
            </h2>
            <button
              onClick={() => setSelectedTag(null)}
              className="text-xs text-[#d4af37] hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>

          {filteredChapters.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-serif uppercase tracking-widest text-[#d4af37] mb-3">
                Chapters
              </h3>
              <ul className="space-y-3">
                {filteredChapters.map((ch) => (
                  <li key={ch.id} className="flex items-baseline gap-3">
                    <span className="font-serif text-[#d4af37] text-sm">{ch.numeral}:</span>
                    <button
                      onClick={() => onSelectChapter(ch.id)}
                      className="text-left font-serif text-lg text-[#f5f2ea] hover:text-[#e6c86e] cursor-pointer"
                    >
                      {ch.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div>
              <h3 className="text-xs font-serif uppercase tracking-widest text-[#d4af37] mb-3">
                Field Notes
              </h3>
              <ul className="space-y-3">
                {filteredPosts.map((post) => (
                  <li key={post.id} className="flex items-baseline gap-3">
                    <time className="font-mono text-xs text-[#879287] shrink-0">{post.date}</time>
                    <button
                      onClick={() => onSelectPost(post.id)}
                      className="text-left font-serif text-lg text-[#f5f2ea] hover:text-[#e6c86e] cursor-pointer"
                    >
                      {post.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-10">
          {allTags.map((tag) => {
            const chs = CHAPTERS_DATA.filter((c) => c.tags.includes(tag));
            const psts = POSTS_DATA.filter((p) => p.tags.includes(tag));

            return (
              <section key={tag} className="border-b border-[#d4af37]/15 pb-6">
                <h2 className="font-serif text-2xl text-[#e6c86e] mb-4">
                  #{tag}
                </h2>
                <ul className="space-y-2.5">
                  {chs.map((ch) => (
                    <li key={ch.id} className="flex items-baseline gap-3 text-sm">
                      <span className="font-serif text-[#d4af37]">{ch.numeral} (Chapter):</span>
                      <button
                        onClick={() => onSelectChapter(ch.id)}
                        className="text-left text-[#f5f2ea] hover:text-[#e6c86e] cursor-pointer underline decoration-[#d4af37]/30"
                      >
                        {ch.title}
                      </button>
                    </li>
                  ))}
                  {psts.map((p) => (
                    <li key={p.id} className="flex items-baseline gap-3 text-sm">
                      <span className="font-mono text-xs text-[#879287]">{p.date}:</span>
                      <button
                        onClick={() => onSelectPost(p.id)}
                        className="text-left text-[#c9c3b4] hover:text-[#e6c86e] cursor-pointer underline decoration-[#d4af37]/30"
                      >
                        {p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
