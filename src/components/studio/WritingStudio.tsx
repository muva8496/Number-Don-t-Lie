import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StudioEntry,
  EntryType,
  EntryStatus,
  EntryVersion,
  getAllStudioEntries,
  saveStudioEntry,
  deleteStudioEntry,
  getEntryVersions,
  initStudioDataIfEmpty,
  parseMarkdownFile,
  parseJupyterNotebook,
  exportStudioZip,
  importStudioZip,
  saveUploadedAsset
} from '../../lib/studioStorage';
import { InteractiveChartRenderer } from './InteractiveChartRenderer';
import {
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Save,
  Clock,
  Download,
  Upload,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  X,
  Heading,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Code,
  Table,
  Image as ImageIcon,
  BarChart2,
  Eye,
  Columns,
  Undo2,
  ExternalLink
} from 'lucide-react';

interface WritingStudioProps {
  onClose: () => void;
  onRefreshPublicData?: () => void;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({ onClose, onRefreshPublicData }) => {
  const [entries, setEntries] = useState<StudioEntry[]>([]);
  const [activeTab, setActiveTab] = useState<EntryType>('chapter');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Editor form state
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [primaryLens, setPrimaryLens] = useState<string>('Analysis');
  const [dataset, setDataset] = useState('');
  const [status, setStatus] = useState<EntryStatus>('draft');
  const [repoUrl, setRepoUrl] = useState('');
  const [notebookUrl, setNotebookUrl] = useState('');
  const [datePulled, setDatePulled] = useState('');
  const [pythonVersion, setPythonVersion] = useState('3.11.8');
  const [ogImage, setOgImage] = useState('');
  const [content, setContent] = useState('');

  // Autosave and indicator states
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string>('Just now');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editorMode, setEditorMode] = useState<'split' | 'write' | 'preview'>('split');

  // Version History Modal
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [versionsList, setVersionsList] = useState<EntryVersion[]>([]);

  // Delete confirmation & undo state
  const [deleteCandidate, setDeleteCandidate] = useState<StudioEntry | null>(null);
  const [deletedBackup, setDeletedBackup] = useState<StudioEntry | null>(null);

  // Export/Import state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load entries on mount
  useEffect(() => {
    async function loadData() {
      await initStudioDataIfEmpty();
      const loaded = await getAllStudioEntries();
      setEntries(loaded);
      const initialChapter = loaded.find((e) => e.type === 'chapter');
      if (initialChapter) {
        selectEntry(initialChapter);
      }
    }
    loadData();
  }, []);

  const selectEntry = (entry: StudioEntry) => {
    setSelectedEntryId(entry.id);
    setTitle(entry.title);
    setOrder(entry.order || 1);
    setSummary(entry.summary || '');
    setTagsInput(entry.tags ? entry.tags.join(', ') : '');
    setPrimaryLens(entry.primary_lens || 'Analysis');
    setDataset(entry.dataset || '');
    setStatus(entry.status);
    setRepoUrl(entry.repo_url || '');
    setNotebookUrl(entry.notebook_url || '');
    setDatePulled(entry.date_pulled || '');
    setPythonVersion(entry.python_version || '3.11.8');
    setOgImage(entry.og_image || '');
    setContent(entry.content || '');
    setSaveStatus('saved');
    setLastSavedAt(new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Debounced live preview state for fast performance on long chapters
  const [debouncedContent, setDebouncedContent] = useState(content);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 180);
    return () => clearTimeout(handler);
  }, [content]);

  // Autosave whenever content or metadata changes
  useEffect(() => {
    if (!selectedEntryId) return;

    setSaveStatus('dirty');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const updated: StudioEntry = {
        id: selectedEntryId,
        type: activeTab,
        title: title || 'Untitled Entry',
        order: activeTab === 'chapter' ? order : undefined,
        summary,
        tags,
        primary_lens: primaryLens,
        dataset: activeTab === 'chapter' ? dataset : undefined,
        status,
        content,
        repo_url: repoUrl,
        notebook_url: notebookUrl,
        date_pulled: datePulled,
        python_version: pythonVersion,
        og_image: ogImage,
        updatedAt: Date.now()
      };

      await saveStudioEntry(updated, true);
      setSaveStatus('saved');
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Refresh entry in list
      setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      if (onRefreshPublicData) onRefreshPublicData();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    title,
    order,
    summary,
    tagsInput,
    primaryLens,
    dataset,
    status,
    repoUrl,
    notebookUrl,
    datePulled,
    pythonVersion,
    ogImage,
    content,
    selectedEntryId,
    activeTab
  ]);

  // Create new entry
  const handleCreateNew = async (type: EntryType) => {
    const nextOrder = entries.filter((e) => e.type === 'chapter').length + 1;
    const newEntry: StudioEntry = {
      id: `${type}_${Date.now()}`,
      type,
      title: type === 'chapter' ? 'Does the New Evidence Hold?' : 'Notes from the Workbench',
      order: type === 'chapter' ? nextOrder : undefined,
      summary: 'One-line plain-English summary of this investigation.',
      tags: ['data', 'investigation'],
      primary_lens: 'Analysis',
      status: 'draft',
      content: `# Title Framed as a Question\n\nDrop cap opening narrative goes here...\n\n## I. Initial Inquiry\n\nDetail the evidence and data collection methodology...`,
      updatedAt: Date.now()
    };

    await saveStudioEntry(newEntry, true);
    setEntries((prev) => [newEntry, ...prev]);
    setActiveTab(type);
    selectEntry(newEntry);
  };

  // Delete handling with confirmation and undo
  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const target = deleteCandidate;
    setDeletedBackup(target);
    await deleteStudioEntry(target.id);
    const updated = entries.filter((e) => e.id !== target.id);
    setEntries(updated);
    setDeleteCandidate(null);

    if (selectedEntryId === target.id) {
      const next = updated.find((e) => e.type === activeTab) || updated[0] || null;
      if (next) selectEntry(next);
      else setSelectedEntryId(null);
    }

    setFeedbackNotice(`Deleted "${target.title}".`);
    setTimeout(() => setFeedbackNotice(null), 6000);
  };

  const handleUndoDelete = async () => {
    if (!deletedBackup) return;
    await saveStudioEntry(deletedBackup, true);
    setEntries((prev) => [deletedBackup, ...prev]);
    selectEntry(deletedBackup);
    setDeletedBackup(null);
    setFeedbackNotice(`Restored "${deletedBackup.title}".`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Version history viewer
  const handleOpenVersions = async () => {
    if (!selectedEntryId) return;
    const vList = await getEntryVersions(selectedEntryId);
    setVersionsList(vList);
    setIsVersionsOpen(true);
  };

  const handleRestoreVersion = (version: EntryVersion) => {
    selectEntry(version.entrySnapshot);
    setIsVersionsOpen(false);
    setFeedbackNotice(`Restored version from ${new Date(version.timestamp).toLocaleTimeString()}`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // Toolbar actions
  const insertTextAtCursor = (before: string, after = '', placeholder = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end) || placeholder;
    const replacement = `${before}${selected}${after}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  // Insert Custom Blocks
  const insertCustomBlock = (blockType: string) => {
    switch (blockType) {
      case 'verdict':
        insertTextAtCursor(
          `\n\n<aside class="book-callout" aria-label="The Empirical Verdict">\n  <div class="callout-header">\n    <span class="callout-title">The Empirical Verdict</span>\n    <span class="callout-tagline">Key Findings &amp; Core Invariants</span>\n  </div>\n  <ul class="verdict-list">\n    <li class="verdict-item"><span class="verdict-bullet">&#9670;</span><div>First key statistical invariant uncovered.</div></li>\n    <li class="verdict-item"><span class="verdict-bullet">&#9670;</span><div>Second quantitative finding with median bounds.</div></li>\n  </ul>\n</aside>\n\n`
        );
        break;
      case 'reproducibility':
        insertTextAtCursor(
          `\n\n## Replicating This Analysis\n\nAll ingestion scripts, econometric routines, and vector figures are open-source:\n- \`notebooks/01_outcomes_investigation.ipynb\`\n- \`scripts/clean_cohort.py\`\n- \`data/processed/metrics.parquet\`\n\n`
        );
        break;
      case 'limitations':
        insertTextAtCursor(
          `\n\n<section class="limitations-box">\n  <h2 class="limitations-title">Where the Numbers Can Mislead</h2>\n  <span class="limitations-subtitle">Methodological boundaries &amp; unobserved variables</span>\n  <ul class="limitations-list">\n    <li class="limitation-item">\n      <strong>Survivor &amp; Attrition Bias:</strong>\n      <p>Detail how non-responding records may distort the upper decile.</p>\n    </li>\n  </ul>\n</section>\n\n`
        );
        break;
      case 'how-i-redo':
        insertTextAtCursor(
          `\n\n<section class="limitations-box" style="border-color: rgba(212,175,55,0.4);">\n  <h2 class="limitations-title" style="color: var(--gold-light);">How I'd Redo This</h2>\n  <span class="limitations-subtitle">Forensic post-mortem on retrospective design decisions</span>\n  <p style="font-size: 0.92rem; color: var(--text-secondary); margin-top: 0.75rem;">\n    If beginning this collection again with today's knowledge, I would capture raw M-Pesa transaction UUIDs directly rather than rely on daily aggregate till reconciliations.\n  </p>\n</section>\n\n`
        );
        break;
      case 'chart':
        insertTextAtCursor(
          `\n\n:::chart\ntype: bar\ntitle: Income Trajectory Across Cohort (KES)\ndata:\nGraduation,26000\nMonth 12,34000\nMonth 24,52000\nMonth 36,88500\n:::\n\n`
        );
        break;
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const orderNum = order || 1;
      const path = `/assets/images/chapter-${orderNum}/${cleanName}`;

      await saveUploadedAsset({
        path,
        dataUrl,
        name: cleanName,
        createdAt: Date.now()
      });

      insertTextAtCursor(`\n\n![${cleanName}](${path})\n*Figure: Caption describing key empirical finding.*\n\n`);
      setFeedbackNotice(`Image saved to ${path}`);
      setTimeout(() => setFeedbackNotice(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  // Import .ipynb or .md
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = reader.result as string;
        let parsed: Partial<StudioEntry>;

        if (file.name.endsWith('.ipynb')) {
          parsed = parseJupyterNotebook(file.name, text);
        } else {
          parsed = parseMarkdownFile(file.name, text);
        }

        const newEntry: StudioEntry = {
          id: `${activeTab}_${Date.now()}`,
          type: activeTab,
          title: parsed.title || file.name,
          order: parsed.order || (activeTab === 'chapter' ? entries.length + 1 : undefined),
          summary: parsed.summary || 'Imported from external file',
          tags: parsed.tags || ['imported'],
          primary_lens: parsed.primary_lens || 'Science',
          dataset: parsed.dataset,
          status: parsed.status || 'draft',
          content: parsed.content || '',
          repo_url: parsed.repo_url,
          notebook_url: parsed.notebook_url,
          date_pulled: parsed.date_pulled,
          python_version: parsed.python_version,
          og_image: parsed.og_image,
          updatedAt: Date.now()
        };

        await saveStudioEntry(newEntry, true);
        setEntries((prev) => [newEntry, ...prev]);
        selectEntry(newEntry);
        setFeedbackNotice(`Successfully imported ${file.name}`);
        setTimeout(() => setFeedbackNotice(null), 4000);
      } catch (err: any) {
        alert(err.message || 'Error parsing file.');
      }
    };
    reader.readAsText(file);
  };

  // Export Jekyll .zip package
  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      const blob = await exportStudioZip();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ndl-numbers-dont-lie-jekyll-studio.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setFeedbackNotice('Jekyll package exported successfully.');
      setTimeout(() => setFeedbackNotice(null), 4000);
    } catch (e: any) {
      alert(`Export failed: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Import Jekyll .zip package
  const handleImportZip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const result = await importStudioZip(file);
      const reloaded = await getAllStudioEntries();
      setEntries(reloaded);
      if (reloaded.length > 0) selectEntry(reloaded[0]);
      setFeedbackNotice(
        `Imported ${result.chaptersCount} chapters and ${result.postsCount} posts from ZIP.`
      );
      setTimeout(() => setFeedbackNotice(null), 5000);
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  // Simple, fast Markdown-to-HTML parser for live preview
  const renderedPreview = useMemo(() => {
    if (!debouncedContent) return null;

    // Separate chart blocks
    const parts = debouncedContent.split(/(:::chart[\s\S]*?:::)/g);

    return parts.map((part, index) => {
      if (part.startsWith(':::chart') && part.endsWith(':::')) {
        const blockText = part.replace(/^:::chart\s*/, '').replace(/\s*:::$/, '');
        return <InteractiveChartRenderer key={index} blockText={blockText} />;
      }

      // Convert simple Markdown paragraphs, headings, code, and lists to styled HTML
      let html = part
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/```python\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
        .replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/gim, '</p><p>');

      return (
        <div
          key={index}
          className="chapter-content drop-cap-p"
          dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
        />
      );
    });
  }, [debouncedContent]);

  const activeEntries = entries.filter((e) => e.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#071610] text-[#f5f2ea] overflow-hidden">
      {/* Top Banner Warning & Author Studio Header */}
      <div className="bg-[#040d09] border-b border-[#d4af37]/30 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <BookOpen className="w-4 h-4" />
            <span className="font-serif font-bold text-sm tracking-wide">
              NDL Writing Studio
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#d4af37]/25 text-xs text-[#c9c3b4]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[11px] text-amber-200">
              Drafts live in this browser. Export regularly to back up.
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Autosave Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-[#092016] border border-[#d4af37]/20 rounded-sm text-[11px] text-[#c9c3b4]">
            {saveStatus === 'saving' && <span className="text-amber-400 animate-pulse">Saving...</span>}
            {saveStatus === 'saved' && (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Saved ({lastSavedAt})</span>
              </span>
            )}
            {saveStatus === 'dirty' && <span className="text-[#879287]">Unsaved changes</span>}
          </div>

          {/* Versions History Button */}
          <button
            onClick={handleOpenVersions}
            disabled={!selectedEntryId}
            className="px-2.5 py-1 bg-[#0d221a] hover:bg-[#132e23] border border-[#d4af37]/30 rounded-sm text-[#f5f2ea] inline-flex items-center gap-1 cursor-pointer transition-colors"
            title="View last 10 version snapshots"
          >
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden md:inline">Versions</span>
          </button>

          {/* Import / Export Controls */}
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="px-2.5 py-1 bg-[#d4af37] hover:bg-[#e6c86e] text-[#071610] font-semibold rounded-sm inline-flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
            title="Download full Jekyll project with drafts as .zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Archiving...' : 'Export Jekyll .zip'}</span>
          </button>

          <button
            onClick={() => zipInputRef.current?.click()}
            disabled={isImporting}
            className="px-2.5 py-1 bg-[#0d221a] hover:bg-[#132e23] border border-[#d4af37]/30 rounded-sm text-[#c9c3b4] inline-flex items-center gap-1 cursor-pointer transition-colors"
            title="Restore from previous Jekyll .zip export"
          >
            <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden md:inline">{isImporting ? 'Restoring...' : 'Import .zip'}</span>
          </button>

          {/* Close Studio */}
          <button
            onClick={onClose}
            className="px-2 py-1 text-[#879287] hover:text-[#f5f2ea] cursor-pointer transition-colors ml-2"
            title="Return to Public View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".ipynb,.md,.markdown"
        className="hidden"
      />
      <input
        type="file"
        ref={zipInputRef}
        onChange={handleImportZip}
        accept=".zip"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Feedback Notice Toast */}
      {feedbackNotice && (
        <div className="bg-[#0d261b] border-b border-emerald-500/40 px-4 py-1.5 text-xs text-emerald-200 flex items-center justify-between">
          <span>{feedbackNotice}</span>
          {deletedBackup && (
            <button
              onClick={handleUndoDelete}
              className="text-[#e6c86e] hover:underline font-mono inline-flex items-center gap-1 cursor-pointer"
            >
              <Undo2 className="w-3 h-3" />
              <span>Undo Delete</span>
            </button>
          )}
        </div>
      )}

      {/* Main Studio Body: 3-column / Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Chapters & Posts Lists */}
        <aside className="w-64 bg-[#05110c] border-r border-[#d4af37]/20 flex flex-col shrink-0">
          {/* Tab Selector */}
          <div className="flex border-b border-[#d4af37]/20">
            <button
              onClick={() => setActiveTab('chapter')}
              className={`flex-1 py-2 text-xs font-serif font-semibold tracking-wider text-center cursor-pointer transition-colors ${
                activeTab === 'chapter'
                  ? 'bg-[#092016] text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#879287] hover:text-[#f5f2ea]'
              }`}
            >
              Chapters ({entries.filter((e) => e.type === 'chapter').length})
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`flex-1 py-2 text-xs font-serif font-semibold tracking-wider text-center cursor-pointer transition-colors ${
                activeTab === 'post'
                  ? 'bg-[#092016] text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#879287] hover:text-[#f5f2ea]'
              }`}
            >
              Trail ({entries.filter((e) => e.type === 'post').length})
            </button>
          </div>

          {/* New Entry & Import Actions */}
          <div className="p-2 border-b border-[#d4af37]/15 flex items-center gap-1.5 bg-[#071610]">
            <button
              onClick={() => handleCreateNew(activeTab)}
              className="flex-1 py-1 px-2 bg-[#0d221a] hover:bg-[#132e23] border border-[#d4af37]/35 rounded text-xs text-[#f5f2ea] inline-flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>New {activeTab === 'chapter' ? 'Chapter' : 'Trail Post'}</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-1 px-2 bg-[#0d221a] hover:bg-[#132e23] border border-[#d4af37]/25 rounded text-xs text-[#c9c3b4] inline-flex items-center gap-1 cursor-pointer"
              title="Import .ipynb notebook or .md file"
            >
              <Upload className="w-3 h-3 text-[#d4af37]" />
              <span>Import</span>
            </button>
          </div>

          {/* Entries List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => selectEntry(entry)}
                className={`p-2.5 rounded-sm cursor-pointer border transition-all text-xs ${
                  selectedEntryId === entry.id
                    ? 'bg-[#0d261b] border-[#d4af37] text-[#f5f2ea]'
                    : 'bg-[#071911] border-transparent hover:border-[#d4af37]/30 text-[#c9c3b4]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-[#d4af37]">
                    {entry.type === 'chapter' ? `Ch. ${entry.order || 1}` : 'Trail'}
                  </span>
                  <span
                    className={`font-mono text-[9px] px-1 rounded uppercase ${
                      entry.status === 'published'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : entry.status === 'coming-soon'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
                <h4 className="font-serif font-bold line-clamp-1 text-sm text-[#f5f2ea]">
                  {entry.title}
                </h4>
                <p className="text-[11px] text-[#879287] line-clamp-1 mt-0.5">
                  {entry.summary || 'No summary'}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#d4af37]/10 text-[10px] text-[#879287]">
                  <span>{new Date(entry.updatedAt).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCandidate(entry);
                    }}
                    className="text-red-400/80 hover:text-red-300 p-0.5 cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Split Screen Editor and Live Book-Typography Preview */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#071610]">
          {/* Editor Action Toolbar */}
          <div className="bg-[#05140e] border-b border-[#d4af37]/20 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
            {/* Markdown shortcuts */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => insertTextAtCursor('## ')}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Heading 2"
              >
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertTextAtCursor('**', '**', 'bold text')}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertTextAtCursor('*', '*', 'italic text')}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertTextAtCursor('> ')}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertTextAtCursor('- ')}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Bullet list"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertTextAtCursor('1. ')}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Numbered list"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => insertTextAtCursor('```python\n', '\n```', '# code')}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Code block"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  insertTextAtCursor(
                    '\n| Metric | Baseline | Adjusted |\n|:---|:---:|:---:|\n| Sample | 1,420 | 1,290 |\n'
                  )
                }
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer"
                title="Markdown Table"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => imageInputRef.current?.click()}
                className="p-1.5 hover:bg-[#0d221a] rounded text-[#c9c3b4] hover:text-[#d4af37] cursor-pointer inline-flex items-center gap-1"
                title="Upload and embed image"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="text-[10px]">Image</span>
              </button>
            </div>

            {/* Custom Site Blocks */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] text-[#879287] mr-1 hidden lg:inline">Blocks:</span>
              <button
                onClick={() => insertCustomBlock('verdict')}
                className="px-2 py-1 bg-[#092016] hover:bg-[#0f2c20] border border-[#d4af37]/30 text-[#e6c86e] rounded text-[11px] cursor-pointer font-serif"
                title="Insert Verdict Box"
              >
                + Verdict
              </button>
              <button
                onClick={() => insertCustomBlock('limitations')}
                className="px-2 py-1 bg-[#092016] hover:bg-[#0f2c20] border border-[#d4af37]/30 text-[#e6c86e] rounded text-[11px] cursor-pointer font-serif"
                title="Insert Limitations Box"
              >
                + Limitations
              </button>
              <button
                onClick={() => insertCustomBlock('how-i-redo')}
                className="px-2 py-1 bg-[#092016] hover:bg-[#0f2c20] border border-[#d4af37]/30 text-[#e6c86e] rounded text-[11px] cursor-pointer font-serif"
                title="Insert 'How I'd Redo This'"
              >
                + Redo
              </button>
              <button
                onClick={() => insertCustomBlock('chart')}
                className="px-2 py-1 bg-[#092016] hover:bg-[#0f2c20] border border-[#d4af37]/30 text-[#e6c86e] rounded text-[11px] cursor-pointer inline-flex items-center gap-1"
                title="Insert Interactive SVG Chart block"
              >
                <BarChart2 className="w-3 h-3 text-[#d4af37]" />
                <span>+ Chart</span>
              </button>
            </div>

            {/* View Mode (Split, Write, Preview) */}
            <div className="flex items-center gap-1 bg-[#092016] border border-[#d4af37]/20 p-0.5 rounded text-xs">
              <button
                onClick={() => setEditorMode('write')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  editorMode === 'write' ? 'bg-[#d4af37] text-[#071610] font-semibold' : 'text-[#879287]'
                }`}
              >
                Write
              </button>
              <button
                onClick={() => setEditorMode('split')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  editorMode === 'split' ? 'bg-[#d4af37] text-[#071610] font-semibold' : 'text-[#879287]'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setEditorMode('preview')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  editorMode === 'preview' ? 'bg-[#d4af37] text-[#071610] font-semibold' : 'text-[#879287]'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Split Writing Workspace */}
          <div className="flex-1 flex overflow-hidden">
            {/* Writing Pane */}
            {(editorMode === 'split' || editorMode === 'write') && (
              <div
                className={`flex flex-col border-r border-[#d4af37]/20 bg-[#071610] ${
                  editorMode === 'split' ? 'w-1/2' : 'w-full'
                }`}
              >
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write in Markdown. Use the toolbar above or insert custom verdict, limitations, and chart blocks..."
                  className="flex-1 w-full p-4 bg-transparent text-[#f5f2ea] font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-[#879287]/40"
                  spellCheck="false"
                />
              </div>
            )}

            {/* Live Book-Styled Preview Pane */}
            {(editorMode === 'split' || editorMode === 'preview') && (
              <div
                className={`overflow-y-auto p-6 md:p-8 bg-[#06140e] ${
                  editorMode === 'split' ? 'w-1/2' : 'w-full'
                }`}
              >
                <div className="reading-container max-w-2xl mx-auto">
                  <header className="chapter-header">
                    <span className="chapter-numeral-kicker">
                      {activeTab === 'chapter' ? `Chapter ${order}` : 'Field Dispatch'}
                    </span>
                    <h1 className="chapter-title-question">{title || 'Untitled Document'}</h1>
                    {summary && (
                      <p className="text-base text-[#e6c86e] font-serif italic mb-3">
                        {summary}
                      </p>
                    )}
                    <div className="chapter-meta-line text-xs">
                      {primaryLens && (
                        <span className="font-mono text-[10px] text-[#e6c86e] tracking-wider uppercase px-1.5 py-0.5 border border-[#d4af37]/35 rounded-sm">
                          {primaryLens}
                        </span>
                      )}
                      <span>Status: {status}</span>
                      {dataset && <span>Dataset: {dataset}</span>}
                    </div>
                  </header>

                  {/* Rendered content */}
                  <div>{renderedPreview}</div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar: Front Matter & Metadata Form */}
        <aside
          className={`w-72 bg-[#05110c] border-l border-[#d4af37]/20 flex flex-col shrink-0 overflow-y-auto p-4 space-y-4 ${
            isSidebarOpen ? '' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/20">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#d4af37]">
              Front Matter Metadata
            </h3>
            <span className="font-mono text-[10px] text-[#879287]">YAML Header</span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Status (draft / coming-soon / published) */}
          <div>
            <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">
              Status (Public Visibility)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EntryStatus)}
              className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="draft">Draft (Private - Author Only)</option>
              <option value="coming-soon">Coming Soon (Visible to Visitors)</option>
              <option value="published">Published (Visible to Visitors)</option>
            </select>
            <span className="text-[10px] text-[#879287] mt-1 block">
              Only "published" and "coming-soon" entries appear on the public site.
            </span>
          </div>

          {/* Area / Primary Lens */}
          <div>
            <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">
              Primary Lens / Area
            </label>
            <select
              value={primaryLens}
              onChange={(e) => setPrimaryLens(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
            >
              <option value="Analysis">Analysis</option>
              <option value="Engineering">Engineering</option>
              <option value="Science">Science</option>
              <option value="Science & Analysis">Science &amp; Analysis</option>
              <option value="Engineering & Analysis">Engineering &amp; Analysis</option>
              <option value="Engineering & Science">Engineering &amp; Science</option>
              <option value="Mix">Mix</option>
            </select>
          </div>

          {/* Order (Chapters only) */}
          {activeTab === 'chapter' && (
            <div>
              <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">Chapter Order</label>
              <input
                type="number"
                min="1"
                max="50"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          {/* Summary */}
          <div>
            <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">
              Plain-English Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One sentence summary for table of contents..."
              className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          {/* Dataset (Chapters only) */}
          {activeTab === 'chapter' && (
            <div>
              <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">Dataset Name</label>
              <input
                type="text"
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                placeholder="e.g. Kenya University Student Outcomes"
                className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="kuso, kenya, python"
              className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Notebook URL */}
          <div>
            <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">Jupyter Notebook URL</label>
            <input
              type="text"
              value={notebookUrl}
              onChange={(e) => setNotebookUrl(e.target.value)}
              placeholder="https://github.com/.../notebook.ipynb"
              className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Repo URL */}
          <div>
            <label className="block text-[11px] font-mono text-[#c9c3b4] mb-1">GitHub Repo URL</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-2.5 py-1.5 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Date Pulled & Python Version */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-[#c9c3b4] mb-1">Date Pulled</label>
              <input
                type="text"
                value={datePulled}
                onChange={(e) => setDatePulled(e.target.value)}
                placeholder="2026-02-14"
                className="w-full px-2 py-1 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[#c9c3b4] mb-1">Python Ver.</label>
              <input
                type="text"
                value={pythonVersion}
                onChange={(e) => setPythonVersion(e.target.value)}
                placeholder="3.11.8"
                className="w-full px-2 py-1 bg-[#092016] border border-[#d4af37]/30 rounded text-xs text-[#f5f2ea]"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-md bg-[#071610] border border-red-500/40 rounded p-6 text-[#f5f2ea] space-y-4">
            <h3 className="font-serif font-bold text-lg text-red-200">
              Confirm Delete: "{deleteCandidate.title}"
            </h3>
            <p className="text-xs text-[#c9c3b4] leading-relaxed">
              Are you sure you want to delete this {deleteCandidate.type}? You will have a temporary option to undo, but exporting regular backups is recommended.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-3 py-1.5 bg-transparent text-xs text-[#879287] hover:text-[#f5f2ea] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 bg-red-800 hover:bg-red-700 text-xs text-white rounded font-medium cursor-pointer"
              >
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {isVersionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-lg bg-[#071610] border border-[#d4af37]/40 rounded p-6 text-[#f5f2ea] space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-serif font-bold text-base text-[#f5f2ea]">
                  Version History (Last 10 Saves)
                </h3>
              </div>
              <button
                onClick={() => setIsVersionsOpen(false)}
                className="text-[#879287] hover:text-[#f5f2ea]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {versionsList.length === 0 ? (
                <p className="text-xs text-[#879287] italic p-4 text-center">
                  No previous snapshots stored for this entry yet.
                </p>
              ) : (
                versionsList.map((ver, idx) => (
                  <div
                    key={ver.versionId}
                    className="p-3 bg-[#092016] border border-[#d4af37]/20 rounded flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono text-[#d4af37] text-[11px]">
                        Save #{versionsList.length - idx} · {new Date(ver.timestamp).toLocaleString()}
                      </div>
                      <div className="font-serif font-semibold text-sm text-[#f5f2ea] mt-0.5">
                        {ver.entrySnapshot.title}
                      </div>
                      <div className="text-[10px] text-[#879287]">
                        {ver.entrySnapshot.content?.length || 0} characters · Status: {ver.entrySnapshot.status}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestoreVersion(ver)}
                      className="px-3 py-1 bg-[#0d261b] hover:bg-[#133827] border border-[#d4af37]/40 text-[#e6c86e] rounded text-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[#d4af37]/20 flex justify-end">
              <button
                onClick={() => setIsVersionsOpen(false)}
                className="px-4 py-1.5 bg-[#0d221a] text-xs text-[#c9c3b4] rounded hover:text-[#f5f2ea]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingStudio;
