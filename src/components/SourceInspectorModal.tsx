import React, { useState } from 'react';
import { JEKYLL_FILES, JekyllFile } from '../jekyllData';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  FolderTree, 
  CheckCircle2, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import JSZip from 'jszip';

interface SourceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
  isDownloadingZip?: boolean;
}

export const SourceInspectorModal: React.FC<SourceInspectorModalProps> = ({
  isOpen,
  onClose,
  onDownloadZip,
  isDownloadingZip
}) => {
  const [activeFile, setActiveFile] = useState<JekyllFile>(JEKYLL_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'config', label: 'Config & Gemfile' },
    { id: 'layout', label: 'Layouts' },
    { id: 'include', label: 'Includes' },
    { id: 'chapter', label: 'Chapters' },
    { id: 'post', label: 'Trail Posts' },
    { id: 'page', label: 'Pages' },
    { id: 'asset', label: 'Assets' },
    { id: 'docs', label: 'Docs' },
  ];

  const filteredFiles = filterCategory === 'all'
    ? JEKYLL_FILES
    : JEKYLL_FILES.filter(f => f.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#071610] border border-[#d4af37]/35 rounded shadow-2xl flex flex-col overflow-hidden text-[#f5f2ea]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4af37]/20 bg-[#091f16]">
          <div className="flex items-center gap-3">
            <FolderTree className="w-5 h-5 text-[#d4af37]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#f5f2ea] flex items-center gap-2">
                <span>NDL Jekyll Source Files Explorer</span>
                <span className="text-xs font-mono font-normal text-[#879287]">({JEKYLL_FILES.length} files)</span>
              </h2>
              <p className="text-xs text-[#c9c3b4]">
                Complete Jekyll static site ready to commit and push to GitHub Pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onDownloadZip}
              disabled={isDownloadingZip}
              className="px-3 py-1.5 bg-[#d4af37] hover:bg-[#e6c86e] text-[#071610] text-xs font-semibold rounded-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingZip ? 'Zipping...' : 'Download .zip Archive'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#c9c3b4] hover:text-[#f5f2ea] rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-[#05110c] border-b border-[#d4af37]/15 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#d4af37]/25 text-[#f5f2ea] font-medium'
                  : 'text-[#879287] hover:text-[#c9c3b4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Modal Main: Sidebar + Code Editor */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* File Tree Sidebar */}
          <div className="w-full md:w-80 border-r border-[#d4af37]/15 bg-[#081a12] flex flex-col overflow-y-auto">
            <div className="p-3 text-[11px] font-mono text-[#879287] uppercase tracking-wider border-b border-[#d4af37]/10">
              Repository Tree
            </div>
            <div className="p-2 space-y-0.5">
              {filteredFiles.map((file) => {
                const isSelected = activeFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setActiveFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-sm text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37]/20 text-[#f5f2ea] font-medium'
                        : 'text-[#c9c3b4] hover:bg-[#0d261b] hover:text-[#f5f2ea]'
                    }`}
                  >
                    <span className="truncate">{file.path}</span>
                    <span className="text-[10px] text-[#879287] ml-2 shrink-0 uppercase">
                      {file.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active File Content Viewer */}
          <div className="flex-1 flex flex-col bg-[#05110c] min-w-0">
            {/* Active file toolbar */}
            <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#d4af37]/15 bg-[#06140e]">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#e6c86e] font-semibold truncate">
                    /{activeFile.path}
                  </span>
                  <span className="text-[10px] text-[#879287] px-1.5 py-0.5 border border-[#d4af37]/20 rounded uppercase">
                    {activeFile.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#879287] truncate mt-0.5">
                  {activeFile.description}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-[#0d261b] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs text-[#f5f2ea] rounded-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Content</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-6 overflow-auto">
              <pre className="m-0 p-0 bg-transparent border-none text-xs font-mono text-[#c9c3b4] leading-relaxed select-all">
                <code>{activeFile.content}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer Deployment Hint */}
        <div className="px-6 py-3 bg-[#081a12] border-t border-[#d4af37]/20 flex flex-wrap items-center justify-between gap-4 text-xs text-[#879287]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#d4af37]" />
            <span>Local testing command: <code className="text-[#e6c86e]">bundle exec jekyll serve</code></span>
          </div>
          <div>
            GitHub Pages: <span className="text-[#f5f2ea]">Settings &gt; Pages &gt; Branch: main / (root)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
