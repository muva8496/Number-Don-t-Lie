import React from 'react';
import { Github, ArrowUp, FileCode } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  isAuthorMode?: boolean;
  onOpenSourceInspector?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  isAuthorMode = false,
  onOpenSourceInspector 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <p className="footer-colophon-text">
              "Spreadsheets are human ledgers. When you torture the data, it confesses to anything."
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Written &amp; curated by Moses Mukangai · Nairobi, Kenya · Data guy at the intersection of analysis, engineering and science.
            </p>
          </div>
          <div className="footer-links">
            <button onClick={() => onNavigate('cover')} className="footer-link cursor-pointer">
              Table of Contents
            </button>
            <button onClick={() => onNavigate('trail')} className="footer-link cursor-pointer">
              The Trail
            </button>
            <button onClick={() => onNavigate('dashboards')} className="footer-link cursor-pointer">
              Dashboard Room
            </button>
            <button onClick={() => onNavigate('toolkit')} className="footer-link cursor-pointer">
              Toolkit
            </button>
            <button onClick={() => onNavigate('about')} className="footer-link cursor-pointer">
              About
            </button>
            <button onClick={() => onNavigate('work-with-me')} className="footer-link cursor-pointer">
              Work with Me
            </button>

            {/* Author-only footer link: completely omitted from visitor DOM */}
            {isAuthorMode && onOpenSourceInspector && (
              <button 
                onClick={onOpenSourceInspector} 
                className="footer-link cursor-pointer inline-flex items-center gap-1 text-[#d4af37]"
                title="Author tool: Inspect Jekyll files"
              >
                <FileCode className="w-3 h-3 text-[#d4af37]" />
                <span>Jekyll Files</span>
              </button>
            )}

            <a
              href="https://github.com/Muva8496"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link inline-flex items-center gap-1"
            >
              <Github className="w-3 h-3" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} NDL: Numbers Don't Lie. Prepared for GitHub Pages deployment.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with pure CSS &amp; Markdown · No client trackers</span>
            <button
              onClick={scrollToTop}
              className="text-[#d4af37] hover:text-[#e6c86e] inline-flex items-center gap-1 cursor-pointer transition-colors"
              title="Return to top of page"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
