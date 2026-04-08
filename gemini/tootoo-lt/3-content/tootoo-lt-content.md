# TooToo LT Content Viewer — File Display Prompt

**Ignore the copilot-instructions.md rule about reading nearby code.**

## Hard Constraints

- **Single file**: One `.html` file — HTML, CSS, JS inline
- **Vanilla JS only**: No frameworks, no jQuery, no build tools, no Node.js
- **ES2020+**: `const`/`let` (no `var`), arrow functions, template literals, async/await, optional chaining
- **Functional style**: No classes, no `this` keyword
- **Security**: All user-supplied strings escaped via `escapeHTML()` before DOM insertion; HTML content sanitized via DOMPurify
- **Every button must have a `title` attribute** with a descriptive tooltip
- **Beginner-readable**: If a student can't follow it, simplify

---

## Output

Start from the attached `tootoo-lt-treeview.html`. Add the content viewer external dependencies (`<script>`/`<link>` tags in `<head>`), CSS into the existing `<style>` block, and JS into the existing `<script>` block. Extract the inline file-selection logic (inside the `#treeList` click handler) into a named `selectFile(path)` function, then replace it with the full file-loading implementation. Update the click handler to call `selectFile(item.dataset.path)`. Also call `setHljsTheme()` from the dark mode toggle and from `initAppearance()`. Save the combined result as a **new file** called `tootoo-lt-content.html`.

---

## Prerequisites

This prompt assumes the **treeview module** from `tootoo-lt-treeview.html` (attached) is already built. It provides:

- `state` object with `owner`, `repo`, `branch`, `tree`, `currentFilePath`
- `CONFIG` object with `owner`, `repo`, `branch`
- `escapeHTML()` utility
- `apiHeaders()` — returns headers object with `Accept` and optional `Authorization`
- `getToken()` — returns GitHub token from localStorage or empty string
- `updateRateLimit(response)` — reads rate-limit headers and updates `#rateBadge`
- `currentAbortController` — mutable `AbortController` variable (`let`) for canceling in-flight fetches
- File selection is currently **inline** in the `#treeList` click handler — extract it into a named `selectFile(path)` function, then replace the inline logic with a call to it
- `fetchTree()` — fetches the repo tree from GitHub API and calls `renderTree()`
- `#contentTitle` — `<h3>` in the content area header
- `#contentBody` — `<div>` for file content display
- `#contentArea` — the scrollable content container
- `scrollToTreeFolder(folderPath)` — scrolls sidebar to a folder
- `storageKey(suffix)` — namespaces localStorage keys per instance

---

## What to Build

The file content viewer: when a file is selected in the tree, fetch its content from GitHub and display it in the content area with appropriate rendering based on file type.

---

## External Dependencies (CDN)

Add these to `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<link id="hljsTheme" rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
```

The highlight.js theme link has `id="hljsTheme"` so dark mode can swap it.

---

## Dark Mode Theme Swap

Add `setHljsTheme()` and call it from the existing dark mode toggle in `setupListeners()` (the `btnDarkMode` click handler — there is no separate `applyDark()` function):

```js
const setHljsTheme = (isDark) => {
  const link = document.getElementById("hljsTheme");
  link.href = isDark
    ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
    : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
};
```

---

## File Fetching

### URL Strategy

- **With token** (`getToken()` returns non-empty): `https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}` with `Accept: application/vnd.github.raw+json` header (use `apiHeaders()` as base, override `Accept`)
- **Without token** (public repos): `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`

### Media Files (images, audio, video, PDF)

- **With token**: fetch as blob via API (`Accept: application/vnd.github.raw+json`, `responseType` blob), create blob URL
- **Without token**: use direct raw.githubusercontent URL or for images just inline `<img src="...">`

### AbortController

Before each file load, abort any in-flight request:

```js
if (currentAbortController) currentAbortController.abort();
currentAbortController = new AbortController();
```

Use the signal in all fetch calls. Silently ignore `AbortError`.

---

## File Text Cache

LRU in-memory cache backed by localStorage:

- `fileTextCache` — a `Map`
- Cache key: `{owner}/{repo}/{branch}/{path}`
- Limit: **25 entries**, max **300K characters** per entry
- On hit: move entry to end (LRU refresh)
- On eviction: remove oldest entry
- `storageKey(suffix)` — namespaces per instance: `tootoo-lt:{location.pathname}:{suffix}`
- Persist to `storageKey('fileTextCache')` as JSON array of `[key, text]` pairs
- Restore from localStorage on init

### Functions

`storageKey(suffix)` already exists in the treeview. Add these new functions:

```js
const getFileCacheKey = (path) => `${state.owner}/${state.repo}/${state.branch}/${path}`;
const getCachedFileText = (path) => { /* check Map, move to end if found, return text or null */ };
const setCachedFileText = (path, text) => { /* enforce limits, evict oldest, persist */ };
```

---

## File Type Handling

### Extension Detection

Extract extension from file path: `path.split('.').pop().toLowerCase()`

### Rendering by Type

| Extension | Rendering |
|-----------|-----------|
| `.md` | Rendered via `marked.parse()` into a `.markdown-body` div; raw toggle available; internal links rewritten |
| `.html`, `.htm` | Fetched text, converted to Blob URL, embedded in `<iframe sandbox="allow-scripts">`; raw toggle; "New Tab" opens GitHub Pages URL |
| Code/text (`.js`, `.ts`, `.py`, `.css`, `.json`, `.yaml`, `.yml`, `.xml`, `.sh`, `.rb`, `.go`, `.rs`, `.java`, `.c`, `.cpp`, `.h`, `.sql`, `.toml`, `.ini`, `.cfg`, `.env`, `.txt`, `.log`, `.bat`, `.ps1`, etc.) | `<pre><code>` with `highlight.js` auto-detection; files over 500KB skip highlighting |
| `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.ico` | With token: blob fetch → blob URL → `<img>`. Without token: direct URL `<img>`. SVG also offers raw toggle |
| `.mp3`, `.wav`, `.ogg` | With token: blob fetch → blob URL → `<audio controls>`. Without token: direct URL. HTML5 player |
| `.mp4`, `.webm` | With token: blob fetch → blob URL → `<video controls>`. Without token: direct URL. HTML5 player |
| `.pdf` | With token: blob fetch → blob URL → `<iframe>`. Without token: Google Docs Viewer `<iframe>` |
| `.xlsx`, `.xls`, `.csv`, `.ods` | Parsed with `XLSX.read()`, each sheet rendered as HTML table with sheet name heading; sanitized via `DOMPurify.sanitize()` |
| Everything else | `<pre><code>` with `highlight.js` auto-detection (same as code/text) |

### Extension Constants

```js
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'];
const AUDIO_EXTS = ['mp3', 'wav', 'ogg'];
const VIDEO_EXTS = ['mp4', 'webm'];
const SHEET_EXTS = ['xlsx', 'xls', 'csv', 'ods'];
const STREAMABLE_EXTS = [...IMAGE_EXTS, ...AUDIO_EXTS, ...VIDEO_EXTS, 'pdf'];
const NO_COPY_EXTS = [...STREAMABLE_EXTS, ...SHEET_EXTS];
```

---

## Large File Protection

- Threshold: `LARGE_FILE_WARNING_BYTES = 1024 * 1024` (1 MB)
- Files exceeding threshold trigger `window.confirm("This file is X MB. Load anyway?")`
- **Streamable files skip the prompt**: images, audio, video, PDF load without confirmation regardless of size
- Approved files tracked in `approvedLargeFiles` Set (per session, in-memory)
- File size read from `state.tree` item's `.size` property
- Files over **500KB** skip syntax highlighting to avoid freezing

---

## File Header (Content Area)

When a file is selected, replace the content area header with a detailed file header:

### Structure

```html
<div class="panel-header file-header">
  <div class="file-title">
    <a href="https://github.com/{owner}/{repo}/blob/{branch}/{path}" target="_blank" title="View on GitHub">
      <!-- GitHub SVG icon (same 18×18 icon as header) -->
    </a>
    <span>
      <a class="breadcrumb-link" onclick="resetToHome()" title="Go to repo root">{repo}</a>
      / <a class="breadcrumb-link" onclick="scrollToTreeFolder('folder1')" title="folder1">folder1</a>
      / <a class="breadcrumb-link" onclick="scrollToTreeFolder('folder1/folder2')" title="folder1/folder2">folder2</a>
      / <strong>filename.ext</strong>
    </span>
  </div>
  <div class="file-actions">
    <!-- Toggle buttons (if applicable) -->
    <!-- Copy button (if applicable) -->
    <!-- New Tab button -->
  </div>
</div>
```

### Breadcrumb Navigation

- Break the file path into segments
- Each intermediate folder segment is a clickable link that calls `scrollToTreeFolder(folderPath)` — which opens and scrolls to that folder in the sidebar tree
- The repo name (first breadcrumb) calls `resetToHome()`
- The file name (last segment) is bold, not clickable

### `resetToHome()`

Called by clicking the repo breadcrumb:
1. Remove `lastFilePath` from localStorage
2. Clear `state.currentFilePath`
3. Clear `state.tree` (forces fresh API fetch)
4. Strip hash from URL via `history.replaceState` (best-effort, fails silently on `file://`)
5. Call `fetchTree()` to re-fetch and re-render

### Action Buttons

- **"Copy" button**: copies raw file text to clipboard; shows "✓ Copied" feedback for 1.5s; hidden for binary types (images, audio, video, PDF, spreadsheets — i.e., `NO_COPY_EXTS`)
- **"New Tab" button**: opens GitHub Pages URL: `https://{owner}.github.io/{repo}/{path}`
  - **User page detection**: if repo name matches `{owner}.github.io`, omit the repo segment: `https://{owner}.github.io/{path}`

---

## Rendered ↔ Raw Toggle

For file types that have both rendered and raw views (`.md`, `.html`, `.htm`, `.svg`):

- Two buttons: "Rendered" and "Raw"
- Active button: full opacity; inactive: `opacity: 0.5`
- Toggle `display` on `#viewRendered` / `#viewRaw` divs
- **View preference persisted** per file extension in localStorage under `storageKey('viewPref:{ext}')` — restored when opening another file of the same type

```js
const getViewPrefKey = (ext) => storageKey(`viewPref:${ext}`);
const getPreferredView = (ext) => localStorage.getItem(getViewPrefKey(ext)) || 'rendered';
const setPreferredView = (ext, view) => localStorage.setItem(getViewPrefKey(ext), view);
```

---

## Markdown Rendering

### Rendering

```js
const html = marked.parse(text);
```

Wrap in `<div class="markdown-body" id="viewRendered">` and raw in `<pre id="viewRaw" style="display:none">`.

### Link Rewriting

After rendering, rewrite links inside `.markdown-body`:

- **GitHub blob links** (`github.com/{owner}/{repo}/blob/{branch}/{path}`) → call `selectFile(path)` internally via click handler
- **Relative paths** → resolve against current file's directory, then call `selectFile(resolvedPath)` via click handler
- **External links** → add `target="_blank" rel="noopener"`
- **Anchor links** (`#...`) → leave as-is

### Error Handling

If `marked.parse()` throws, show an error banner + raw text fallback:

```html
<div class="md-error">⚠️ Markdown rendering failed: {error message}</div>
<pre>{raw text}</pre>
```

---

## Spreadsheet Rendering

For `.xlsx`, `.xls`, `.csv`, `.ods`:

1. Fetch as ArrayBuffer (use blob fetch approach)
2. Parse with `XLSX.read(data, { type: 'array' })`
3. For each sheet name in `workbook.SheetNames`:
   - Convert to HTML: `XLSX.utils.sheet_to_html(workbook.Sheets[sheetName])`
   - Wrap: `<div class="xlsx-sheet"><h3>{sheetName}</h3>{html}</div>`
4. Sanitize combined HTML via `DOMPurify.sanitize()`
5. Insert into `#contentBody`

---

## Hash-Based Routing

### Format: `#{filepath}`

Hash contains **only the file path** (no owner/repo prefix).

### Behavior

- **`updateHash(path)`**: When a file is selected, push `#filepath` via `history.pushState`. When no file, strip hash via `history.replaceState` (never push bare `#`).
- **Auto-opened READMEs**: do NOT set hash on initial load auto-open
- **`handleHashChange()`**: on `popstate`/`hashchange`, parse filepath from hash, load tree if needed, open file
- **Deep linking**: on page load, if hash present, navigate to that file

---

## Last File Path Persistence

- On file select: save path to `storageKey('lastFilePath')`
- On init (if no hash): restore last file from localStorage and open it
- `resetToHome()` clears this

---

## Content CSS

```css
.markdown-body {
  max-width: 700px;
  line-height: 1.6;
  word-wrap: break-word;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
}

pre {
  max-width: 700px;
  overflow-x: auto;
  padding: 1rem;
  border-radius: 6px;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  white-space: pre-wrap;
  word-wrap: break-word;
}

body.dark-mode .markdown-body {
  color: var(--text-color);
}

body.dark-mode pre {
  background-color: var(--secondary-bg);
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  background: var(--secondary-bg);
}

.file-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex-wrap: wrap;
}

.file-title a.breadcrumb-link {
  color: var(--highlight-color);
  cursor: pointer;
  text-decoration: none;
}

.file-title a.breadcrumb-link:hover {
  text-decoration: underline;
}

.file-actions {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-shrink: 0;
}

.file-btn {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--border-color);
  background: var(--secondary-bg);
  color: var(--text-color);
}

.file-btn:hover {
  opacity: 0.88;
}

.media-content {
  max-width: 100%;
  border-radius: 4px;
}

.iframe-content {
  width: 100%;
  height: 70vh;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: #fff;
}

.xlsx-sheet table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
}

.xlsx-sheet td,
.xlsx-sheet th {
  border: 1px solid var(--border-color);
  padding: 0.3rem 0.5rem;
  font-size: 0.85rem;
}

.xlsx-sheet th {
  background: var(--primary-bg);
  font-weight: bold;
}

.md-error {
  background: #fff3cd;
  border: 1px solid #ffc107;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

body.dark-mode .md-error {
  background: #3a3000;
  border-color: #665200;
}
```

---

## `selectFile(path)` — Full Implementation

Replace the placeholder. This is the main function called when a file is clicked or navigated to:

1. Abort any in-flight fetch
2. Look up file in `state.tree` to get size
3. Check large file protection (skip for streamable types)
4. Determine extension
5. Build file header with breadcrumbs + action buttons
6. Set `#contentBody.innerHTML = '<p>Loading…</p>'` immediately to show loading state
7. Check file text cache (for text-based files)
8. Fetch content (text or blob depending on type)
9. Render based on file type
10. Cache text content
11. Update hash (unless `skipHash` parameter is true)
12. Save to `lastFilePath` in localStorage
13. Highlight active tree item
14. Scroll content area to top

---

## Blob URL Cleanup

Track all created blob URLs in a Set. Revoke them:
- Before loading a new file (revoke previous blob URLs)
- On `beforeunload` event (free memory)

```js
const activeBlobUrls = new Set();
window.addEventListener('beforeunload', () => {
  activeBlobUrls.forEach((url) => URL.revokeObjectURL(url));
});
```

---

## Global Error Handlers

```js
window.addEventListener('error', (event) => {
  // Show styled error panel with reload button
});

window.addEventListener('unhandledrejection', (event) => {
  // Show styled error panel with reload button
});
```

Error panel: red-bordered box with error message and a "Reload" button.

---

## Init Sequence Updates

Replace the existing `init()` function with this exact structure:

```js
const init = async () => {
  initAppearance();
  setupListeners();
  restoreFileCache(); // NEW

  await detectRepo();

  state.owner = CONFIG.owner;
  state.repo = CONFIG.repo;
  state.branch = CONFIG.branch;

  if ( state.owner && state.repo ) {
    updateHeaderFromConfig();
    document.getElementById( 'contentBody' ).innerHTML = '<p>Loading tree…</p>';
    await fetchTree();

    // Hash routing & file opening logic runs inside onTreeRenderComplete()
    // or at the end of fetchTree() after renderTree resolves
  }
};
```

---

## What NOT to Include

- No `.git/config` auto-detection cascade (separate concern)
- No inline form for repo entry (separate concern)
- No URL query parameter parsing (separate concern)

---

## Security Notes

- `escapeHTML()` on all user-supplied strings before innerHTML insertion. Use this for all dynamic values, including inside `onclick` attributes (it already handles single quotes).
- **DOM Selection**: When using `querySelector` or `querySelectorAll` with `data-path` attributes, ALWAYS wrap the path in `CSS.escape(path)` to prevent DOM syntax errors.
- `DOMPurify.sanitize()` on all rendered HTML from spreadsheets
- `<iframe sandbox="allow-scripts">` for HTML file previews (no `allow-same-origin`)
- Blob URLs revoked to prevent memory leaks
- Token never displayed in UI; only stored in localStorage
