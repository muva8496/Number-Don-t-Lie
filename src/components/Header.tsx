import React from 'react';
import { Download, Code2, LogOut, Edit3 } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isAuthorMode: boolean;
  authorEmail?: string | null;
  onOpenStudio: () => void;
  onOpenSourceInspector: () => void;
  onDownloadZip: () => void;
  onSignOut: () => void;
  isDownloadingZip?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  isAuthorMode,
  authorEmail,
  onOpenStudio,
  onOpenSourceInspector,
  onDownloadZip,
  onSignOut,
  isDownloadingZip
}) => {
  return (
    <header className="site-header" role="banner">
      <div className="site-header-inner">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onNavigate('cover')}
          className="site-wordmark text-left focus:outline-none cursor-pointer"
          title="Return to Book Cover"
        >
          NDL: Numbers Don't Lie
        </button>

        {/* Zone 2: Public Navigation Links (Always visible to everyone) */}
        <nav className="site-nav" role="navigation" aria-label="Main Navigation">
          <button
            onClick={() => onNavigate('cover')}
            className={`nav-link cursor-pointer focus:outline-none ${currentTab === 'cover' ? 'active' : ''}`}
          >
            The Evidence
          </button>
          <button
            onClick={() => onNavigate('trail')}
            className={`nav-link cursor-pointer focus:outline-none ${currentTab === 'trail' || currentTab.startsWith('post-') ? 'active' : ''}`}
          >
            The Trail
          </button>
          <button
            onClick={() => onNavigate('dashboards')}
            className={`nav-link cursor-pointer focus:outline-none ${currentTab === 'dashboards' ? 'active' : ''}`}
          >
            Dashboard Room
          </button>
          <button
            onClick={() => onNavigate('toolkit')}
            className={`nav-link cursor-pointer focus:outline-none ${currentTab === 'toolkit' ? 'active' : ''}`}
          >
            Toolkit
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`nav-link cursor-pointer focus:outline-none ${currentTab === 'about' ? 'active' : ''}`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('work-with-me')}
            className={`nav-link cursor-pointer focus:outline-none ${currentTab === 'work-with-me' ? 'active' : ''}`}
          >
            Work with Me
          </button>
        </nav>

        {/* Zone 3: Reader Action + Conditional Author Controls */}
        <div className="header-actions">
          {/* Reader TOC jump (public) */}
          <button
            onClick={() => onNavigate('cover')}
            className="btn-book-toc cursor-pointer"
            aria-label="Jump to Table of Contents"
          >
            Contents
          </button>

          {/* GATED AUTHOR CONTROLS: Rendered ONLY when isAuthorMode === true.
              In visitor mode, these elements are completely omitted from the DOM */}
          {isAuthorMode && (
            <>
              {/* Write / Studio Button */}
              <button
                onClick={onOpenStudio}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#071610] bg-[#e6c86e] hover:bg-[#d4af37] font-semibold rounded-sm transition-all cursor-pointer"
                title="Author tool: Open Writing Studio"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#071610]" />
                <span>Write</span>
              </button>

              <button
                onClick={onOpenSourceInspector}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#f5f2ea] bg-[#0d221a] hover:bg-[#132e23] border border-[#d4af37]/40 hover:border-[#d4af37] rounded-sm transition-all cursor-pointer"
                title="Author tool: Inspect all Jekyll static files and templates"
              >
                <Code2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Jekyll Files</span>
              </button>

              <button
                onClick={onDownloadZip}
                disabled={isDownloadingZip}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#f5f2ea] bg-[#0d221a] hover:bg-[#132e23] border border-[#d4af37]/40 rounded-sm transition-all cursor-pointer disabled:opacity-50"
                title="Author tool: Export complete Jekyll site as ZIP"
              >
                <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden md:inline">{isDownloadingZip ? 'Archiving...' : 'Export .zip'}</span>
              </button>

              {/* Author mode indicator & sign out control */}
              <div className="flex items-center gap-1.5 pl-1 border-l border-[#d4af37]/30 text-xs">
                <span className="hidden lg:inline text-[11px] text-emerald-400 font-mono">
                  Author Mode
                </span>
                <button
                  onClick={onSignOut}
                  className="px-2 py-1 text-[11px] text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                  title={`Sign out of Author Mode (${authorEmail || ''})`}
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
