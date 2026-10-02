/**
 * IndexedDB storage and utilities for NDL Author Writing Studio.
 * Handles autosave drafts, version history (last 10 saves), image assets, and zip import/export.
 */

import { CHAPTERS_DATA, POSTS_DATA } from '../jekyllData';
import JSZip from 'jszip';

export type EntryType = 'chapter' | 'post';
export type EntryStatus = 'draft' | 'coming-soon' | 'published';
export type PrimaryLens = 'Analysis' | 'Engineering' | 'Science' | 'Mix';

export interface StudioEntry {
  id: string;
  type: EntryType;
  title: string;
  order?: number;
  summary: string;
  tags: string[];
  primary_lens?: string;
  dataset?: string;
  status: EntryStatus;
  content: string;
  repo_url?: string;
  notebook_url?: string;
  date_pulled?: string;
  python_version?: string;
  og_image?: string;
  postDate?: string;
  readTime?: string;
  updatedAt: number;
}

export interface EntryVersion {
  versionId: string;
  entryId: string;
  timestamp: number;
  entrySnapshot: StudioEntry;
}

export interface StudioAsset {
  path: string;
  dataUrl: string;
  name: string;
  createdAt: number;
}

const DB_NAME = 'ndl_writing_studio_db';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('entries')) {
        const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
        entryStore.createIndex('type', 'type', { unique: false });
        entryStore.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains('versions')) {
        const versionStore = db.createObjectStore('versions', { keyPath: 'versionId' });
        versionStore.createIndex('entryId', 'entryId', { unique: false });
        versionStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains('assets')) {
        db.createObjectStore('assets', { keyPath: 'path' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Initializes default chapters and posts if IndexedDB is currently empty
 */
export async function initStudioDataIfEmpty(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('entries', 'readonly');
  const store = tx.objectStore('entries');
  const countReq = store.count();

  return new Promise((resolve, reject) => {
    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        // Seed default chapters
        for (const chap of CHAPTERS_DATA) {
          const entry: StudioEntry = {
            id: chap.id,
            type: 'chapter',
            title: chap.title,
            order: chap.order,
            summary: chap.summary,
            tags: chap.tags,
            primary_lens: chap.primary_lens || 'Science & Analysis',
            dataset: chap.dataset,
            status: chap.status,
            content: `# ${chap.title}\n\n${chap.summary}\n\n## I. Initial Inquiry\n\nEnter chapter writing here...`,
            repo_url: chap.repo_url,
            notebook_url: chap.notebook_url,
            date_pulled: chap.date_pulled,
            python_version: chap.python_version,
            og_image: chap.og_image,
            readTime: chap.readTime,
            updatedAt: Date.now()
          };
          await saveStudioEntry(entry, false);
        }

        // Seed default posts
        for (const post of POSTS_DATA) {
          const entry: StudioEntry = {
            id: post.id,
            type: 'post',
            title: post.title,
            summary: post.excerpt,
            tags: post.tags,
            status: 'published',
            content: post.content,
            postDate: post.rawDate,
            readTime: post.readTime,
            updatedAt: Date.now()
          };
          await saveStudioEntry(entry, false);
        }
      }
      resolve();
    };
    countReq.onerror = () => reject(countReq.error);
  });
}

/**
 * Fetch all studio entries, optionally filtered by type
 */
export async function getAllStudioEntries(type?: EntryType): Promise<StudioEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readonly');
    const store = tx.objectStore('entries');
    const req = store.getAll();

    req.onsuccess = () => {
      let results: StudioEntry[] = req.result || [];
      if (type) {
        results = results.filter((e) => e.type === type);
      }
      // Sort chapters by order, posts by updatedAt desc
      results.sort((a, b) => {
        if (a.type === 'chapter' && b.type === 'chapter') {
          return (a.order || 99) - (b.order || 99);
        }
        return b.updatedAt - a.updatedAt;
      });
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Saves or updates a studio entry. Also keeps a rolling version history (last 10).
 */
export async function saveStudioEntry(
  entry: StudioEntry,
  recordVersion = true
): Promise<void> {
  const db = await openDB();
  const updatedEntry = { ...entry, updatedAt: Date.now() };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(['entries', 'versions'], 'readwrite');
    const entryStore = tx.objectStore('entries');
    entryStore.put(updatedEntry);

    if (recordVersion) {
      const versionStore = tx.objectStore('versions');
      const versionId = `${entry.id}_${Date.now()}`;
      const versionItem: EntryVersion = {
        versionId,
        entryId: entry.id,
        timestamp: Date.now(),
        entrySnapshot: JSON.parse(JSON.stringify(updatedEntry))
      };
      versionStore.put(versionItem);

      // Prune to last 10 versions for this entry
      const index = versionStore.index('entryId');
      const getVersionsReq = index.getAll(entry.id);
      getVersionsReq.onsuccess = () => {
        const versions: EntryVersion[] = getVersionsReq.result || [];
        if (versions.length > 10) {
          versions.sort((a, b) => a.timestamp - b.timestamp);
          const toDelete = versions.slice(0, versions.length - 10);
          for (const v of toDelete) {
            versionStore.delete(v.versionId);
          }
        }
      };
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Deletes a studio entry
 */
export async function deleteStudioEntry(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['entries', 'versions'], 'readwrite');
    tx.objectStore('entries').delete(id);

    // Also delete version snapshots
    const vStore = tx.objectStore('versions');
    const index = vStore.index('entryId');
    const getVersionsReq = index.getAll(id);
    getVersionsReq.onsuccess = () => {
      const versions: EntryVersion[] = getVersionsReq.result || [];
      for (const v of versions) {
        vStore.delete(v.versionId);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Retrieves the version history (up to 10) for an entry
 */
export async function getEntryVersions(entryId: string): Promise<EntryVersion[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('versions', 'readonly');
    const index = tx.objectStore('versions').index('entryId');
    const req = index.getAll(entryId);

    req.onsuccess = () => {
      const versions: EntryVersion[] = req.result || [];
      versions.sort((a, b) => b.timestamp - a.timestamp);
      resolve(versions);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Saves an uploaded image asset
 */
export async function saveUploadedAsset(asset: StudioAsset): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('assets', 'readwrite');
    tx.objectStore('assets').put(asset);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Retrieves all stored assets
 */
export async function getAllAssets(): Promise<StudioAsset[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('assets', 'readonly');
    const req = tx.objectStore('assets').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Converts a StudioEntry to a Jekyll Markdown file string with valid YAML front matter
 */
export function entryToJekyllMarkdown(entry: StudioEntry): string {
  const lines: string[] = ['---'];
  lines.push(`title: "${entry.title.replace(/"/g, '\\"')}"`);
  if (entry.order !== undefined) lines.push(`order: ${entry.order}`);
  if (entry.dataset) lines.push(`dataset: "${entry.dataset.replace(/"/g, '\\"')}"`);
  if (entry.summary) lines.push(`summary: "${entry.summary.replace(/"/g, '\\"')}"`);
  if (entry.primary_lens) lines.push(`primary_lens: "${entry.primary_lens}"`);
  lines.push(`status: "${entry.status}"`);
  if (entry.date_pulled) lines.push(`date_pulled: "${entry.date_pulled}"`);
  if (entry.python_version) lines.push(`python_version: "${entry.python_version}"`);
  if (entry.og_image) lines.push(`og_image: "${entry.og_image}"`);
  if (entry.repo_url) lines.push(`repo_url: "${entry.repo_url}"`);
  if (entry.notebook_url) lines.push(`notebook_url: "${entry.notebook_url}"`);
  if (entry.postDate) lines.push(`date: "${entry.postDate} 10:00:00 +0300"`);
  if (entry.readTime) lines.push(`read_time: "${entry.readTime}"`);

  if (entry.tags && entry.tags.length > 0) {
    lines.push(`tags: [${entry.tags.join(', ')}]`);
  }
  lines.push('---');
  lines.push('');
  lines.push(entry.content || '');

  return lines.join('\n');
}

/**
 * Parses an uploaded .md file with front matter into a StudioEntry
 */
export function parseMarkdownFile(filename: string, text: string): Partial<StudioEntry> {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      title: filename.replace(/\.md$/, ''),
      content: text,
      status: 'draft',
      summary: ''
    };
  }

  const rawYaml = match[1];
  const content = match[2].trim();
  const metadata: any = {};

  const lines = rawYaml.split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      // Clean quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      // Handle tags array
      if (val.startsWith('[') && val.endsWith(']')) {
        metadata[key] = val
          .slice(1, -1)
          .split(',')
          .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      } else {
        metadata[key] = val;
      }
    }
  }

  return {
    title: metadata.title || filename.replace(/\.md$/, ''),
    order: metadata.order ? parseInt(metadata.order, 10) : undefined,
    dataset: metadata.dataset,
    summary: metadata.summary || '',
    primary_lens: metadata.primary_lens || 'Analysis',
    status: (metadata.status as EntryStatus) || 'draft',
    date_pulled: metadata.date_pulled,
    python_version: metadata.python_version,
    og_image: metadata.og_image,
    repo_url: metadata.repo_url,
    notebook_url: metadata.notebook_url,
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    content
  };
}

/**
 * Parses an uploaded Jupyter Notebook (.ipynb JSON) into Markdown content and title
 */
export function parseJupyterNotebook(filename: string, jsonString: string): Partial<StudioEntry> {
  try {
    const nb = JSON.parse(jsonString);
    const cells = nb.cells || [];
    let mdOutput = '';
    let extractedTitle = filename.replace(/\.ipynb$/, '');

    for (const cell of cells) {
      const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';

      if (cell.cell_type === 'markdown') {
        if (!extractedTitle && source.startsWith('# ')) {
          const firstLine = source.split('\n')[0];
          extractedTitle = firstLine.replace(/^#\s*/, '').trim();
        }
        mdOutput += source + '\n\n';
      } else if (cell.cell_type === 'code') {
        mdOutput += '```python\n' + source + '\n```\n\n';
      }
    }

    return {
      title: extractedTitle,
      summary: `Exported from Jupyter Notebook: ${filename}`,
      status: 'draft',
      primary_lens: 'Science',
      tags: ['python', 'jupyter', 'investigation'],
      content: mdOutput.trim()
    };
  } catch (err) {
    throw new Error('Invalid Jupyter Notebook format. Please upload a valid .ipynb file.');
  }
}

/**
 * Exports complete Jekyll project package (.zip) containing all drafts/chapters/posts + images
 */
export async function exportStudioZip(): Promise<Blob> {
  const zip = new JSZip();
  const entries = await getAllStudioEntries();
  const assets = await getAllAssets();

  // Root site configs & layouts
  const { JEKYLL_FILES } = await import('../jekyllData');
  for (const f of JEKYLL_FILES) {
    // Avoid double writing chapters or posts that we generate dynamically from Studio
    if (!f.path.startsWith('_chapters/') && !f.path.startsWith('_posts/')) {
      zip.file(f.path, f.content);
    }
  }

  // Add Chapters from Studio
  const chapters = entries.filter((e) => e.type === 'chapter');
  for (const chap of chapters) {
    const orderStr = String(chap.order || 1).padStart(2, '0');
    const slug = chap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `_chapters/${orderStr}-${slug}.md`;
    zip.file(filename, entryToJekyllMarkdown(chap));
  }

  // Add Posts from Studio
  const posts = entries.filter((e) => e.type === 'post');
  for (const post of posts) {
    const dateStr = post.postDate || new Date(post.updatedAt).toISOString().split('T')[0];
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `_posts/${dateStr}-${slug}.md`;
    zip.file(filename, entryToJekyllMarkdown(post));
  }

  // Add uploaded images
  for (const asset of assets) {
    const base64Data = asset.dataUrl.split(',')[1];
    if (base64Data) {
      zip.file(asset.path.replace(/^\//, ''), base64Data, { base64: true });
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Imports a previously exported Jekyll .zip file and restores chapters, posts, and assets into IndexedDB
 */
export async function importStudioZip(zipFile: File): Promise<{ chaptersCount: number; postsCount: number }> {
  const zip = new JSZip();
  const loaded = await zip.loadAsync(zipFile);
  let chaptersCount = 0;
  let postsCount = 0;

  for (const [relativePath, zipEntry] of Object.entries(loaded.files)) {
    if (zipEntry.dir) continue;

    // Check chapters
    if (relativePath.startsWith('_chapters/') && relativePath.endsWith('.md')) {
      const text = await zipEntry.async('text');
      const filename = relativePath.split('/').pop() || 'chapter.md';
      const parsed = parseMarkdownFile(filename, text);

      const entry: StudioEntry = {
        id: `imported_chap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'chapter',
        title: parsed.title || filename,
        order: parsed.order || ++chaptersCount,
        summary: parsed.summary || '',
        tags: parsed.tags || [],
        primary_lens: parsed.primary_lens || 'Analysis',
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
      await saveStudioEntry(entry, true);
      chaptersCount++;
    }

    // Check posts
    if (relativePath.startsWith('_posts/') && relativePath.endsWith('.md')) {
      const text = await zipEntry.async('text');
      const filename = relativePath.split('/').pop() || 'post.md';
      const parsed = parseMarkdownFile(filename, text);

      const entry: StudioEntry = {
        id: `imported_post_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'post',
        title: parsed.title || filename,
        summary: parsed.summary || '',
        tags: parsed.tags || [],
        status: parsed.status || 'published',
        content: parsed.content || '',
        postDate: filename.slice(0, 10),
        updatedAt: Date.now()
      };
      await saveStudioEntry(entry, true);
      postsCount++;
    }

    // Check assets
    if (relativePath.startsWith('assets/images/')) {
      const base64 = await zipEntry.async('base64');
      const ext = relativePath.split('.').pop()?.toLowerCase();
      const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : 'image/png';
      const dataUrl = `data:${mime};base64,${base64}`;
      await saveUploadedAsset({
        path: '/' + relativePath,
        name: relativePath.split('/').pop() || 'asset',
        dataUrl,
        createdAt: Date.now()
      });
    }
  }

  return { chaptersCount, postsCount };
}
