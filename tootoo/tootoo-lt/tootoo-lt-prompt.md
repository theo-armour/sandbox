# TooToo LT — Single-Repo Browser Prompt

## What This Is

TooToo LT is a stripped-down, single-file HTML GitHub browser that displays the file tree and file contents for **one repository on its default branch**. It omits the full TooToo features (repo list, orgs, gists, stats, discover) to stay minimal and fast.

Output: a single `tootoo-lt.html` file (~700–800 lines of HTML/CSS/JS).

It runs on GitHub Pages at `theo-armour.github.io/sandbox/tootoo/tootoo-lt/`.

## How to Use This Prompt

**For a full build**: Feed this entire file to the LLM:
> "Using the following spec, create a single `tootoo-lt.html` file: [paste this file]"

**For a targeted fix**: Feed this prompt plus the current `tootoo-lt.html`:
> "Here is my current app [paste tootoo-lt.html]. Using this spec [paste this file], fix the markdown rendering."

## Relationship to Full TooToo

TooToo LT is a subset of the full TooToo GitHub browser (`tootoo/index.html`). The tree rendering, file viewer, keyboard navigation, CSS theming, and resizable sidebar are the same — LT simply removes the multi-repo browsing layer.

- **Full TooToo source**: `tootoo/index.html` (~1500 lines)
- **Full TooToo prompts**: `tootoo/prompt/prompt-*.md` (architecture, API, file viewer, navigation, discover)

**Tip**: For best results, attach the full `tootoo/index.html` alongside this prompt so the LLM can extract the tree, file viewer, and CSS code directly rather than reimplementing from spec.

## What Is Omitted (vs full TooToo)

These features from the full TooToo `index.html` are **not included** in LT:

- Repository list / paginated repo fetching / `fetchList()`
- Organization fetching
- Gist fetching and gist file viewing
- User and repo statistics
- Discover page (random user, curated lists, top followed)
- Repo list filtering and sorting (filter input, sort dropdown)
- Recent users datalist / localStorage history
- Language color dots
- "Get Repos", "Get Orgs", "Get Gists", "Stats", "Discover" buttons
- "← Back to Repos" navigation
- `repoListContainer` sidebar panel
- `isGist` state and all gist-related logic
- Branch selector dropdown (LT always uses the default branch)

## Hard Constraints

- **Single file**: Everything in one `tootoo-lt.html` — HTML, CSS, JS inline
- **Vanilla JS only**: No frameworks, no jQuery, no build tools, no Node.js
- **ES2020+ features**: `const`/`let` (no `var`), arrow functions, template literals, async/await, optional chaining
- **Functional style**: No classes, no `this` keyword
- **Static hosting**: Must work on GitHub Pages and by opening the file locally
- **External deps allowed**: `marked.js` (CDN) for markdown, `highlight.js` (CDN) for syntax highlighting, `DOMPurify` (CDN) for HTML sanitization, `SheetJS/xlsx` (CDN) for spreadsheet rendering
- **Security**: All user-supplied strings escaped via `escapeHTML()` / `escapeAttribute()` before insertion into DOM
- **Beginner-readable**: If a student can't follow it, simplify

---

## CONFIG

```js
const CONFIG = {
  owner: 'theo-armour',
  repo: 'work',
  branch: '',       // empty string = auto-detect default branch from API
};
```

- CONFIG values are used directly by `loadRepo()` — there are no input fields
- If `CONFIG.branch` is empty, the app fetches the repo metadata to discover the default branch
- If `CONFIG.branch` is set, it is used directly (skips the repo metadata fetch)
- The repo may be private — a GitHub token (stored in `localStorage`) is required for private repo access

---

## Architecture & Layout

### Application State

A single `state` object tracks everything:

```js
const state = {
  owner: '',           // current GitHub user/org
  repo: '',            // current repo name
  branch: '',          // current branch (resolved from API or CONFIG)
  tree: [],            // array of tree items from API
  currentFilePath: '', // path of file shown in content area
};
```

- GitHub token stored in `localStorage` under key `githubToken`
- A single `AbortController` (`mainAbortController`) cancels in-flight fetches when a new action starts

### HTML Structure

```
<body>
  <header>
    Fixed title ("Theo Armour / Work", clickable to reload page)
    GitHub logo link (opens repo on GitHub)
    Token button (right-aligned, "⚙️ Token")
  </header>

  <main>  (flex row, fills viewport below header)
    <div class="sidebar">
      <div id="navTree">
        <div>  (flex row)
          <h3>Files</h3>
          Expand/Collapse All button (right-aligned, hidden until tree loads)
        </div>
        <div id="treeTruncatedWarning">  (hidden by default)
        <div id="treeList">
      </div>
    </div>

    <div class="resizer" id="dragMe">  (draggable column separator)
    </div>

    <div class="content-area" id="mainContent">
      (dynamic content — file viewer or welcome message)
    </div>
  </main>
</body>
```

Key differences from full TooToo:
- **No `repoListContainer`** — the sidebar only contains `navTree`
- **No input fields or Load button** — owner/repo are fixed in CONFIG
- **Fixed branded title** in header instead of input fields
- **Expand All button** is in the sidebar Files header, not the top header
- **No action buttons** except Expand/Collapse All and Token

### CSS Architecture

- CSS custom properties for theming: `--primary-bg`, `--secondary-bg`, `--text-color`, `--border-color`, `--highlight-color`, `--hover-bg`, `--font-family`
- `body` is a flex column filling `100vh`
- `main` is a flex row filling remaining space
- Sidebar has a CSS variable `--sidebar-width` (default 200px), updated by the drag resizer
- Content area has `min-width: 0` to allow flex shrinking
- Both sidebar and content area scroll independently (`overflow-y: auto`)

### Resizable Sidebar

- A `.resizer` div (8px wide) sits between sidebar and content
- Pointer events (pointerdown/pointermove/pointerup) handle drag resizing
- Uses `setPointerCapture` for reliable cross-element dragging
- Applies `user-select: none` and `cursor: col-resize` during drag
- Visual feedback: resizer highlights blue on hover and during resize

### Event Delegation

- `treeList` uses event delegation for `data-action="select-file"` clicks
- Global `keydown` listener handles tree keyboard navigation

### Error Handling

- All fetch operations wrapped in try/catch
- AbortError silently ignored (expected when canceling)
- 403 errors append rate-limit hint
- Global `window.error` and `unhandledrejection` handlers show a styled error panel with reload button
- HTML escaping via `escapeHTML()` and `escapeAttribute()` prevents XSS

---

## GitHub API Interactions

### Authentication

- Optional GitHub Personal Access Token for higher rate limits and private repo access
- Stored in `localStorage` under `githubToken`
- Sent as `Authorization: token <value>` header on all API requests
- Token UI: "⚙️ Token" button opens a `prompt()` dialog; blank clears the token; page reloads after change

### Loading the Repository Tree

Triggered automatically on page load (or by hash change):

1. Read `owner` and `repo` from CONFIG
2. If `state.branch` is empty (no CONFIG override):
   - Fetch `GET /repos/{owner}/{repo}` to get `default_branch`
   - Set `state.branch` to the response's `default_branch`
3. Fetch tree: `GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`
4. If `treeData.truncated` is true, show the yellow warning banner
5. Store `treeData.tree` in `state.tree`
6. Render the tree in the sidebar
7. Auto-open `README.md` (case-insensitive, also matches `readme.txt`) in the content area

No branch selector dropdown — LT always uses the default branch (or the branch from CONFIG).

### Fetching File Content

- **With token** (private repos): `https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}` with `Accept: application/vnd.github.raw+json` header
- **Without token** (public repos): `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`
- The full fetch options (including `Authorization` header and abort signal) are passed to `loadFileContent()`
- Large files (>1MB): show a `window.confirm()` dialog before loading
- Approved large files tracked in an in-memory `Set` (per session)
- File size read from tree API response (`item.size`)
- Files over 500KB skip syntax highlighting to avoid freezing the browser

### Rate Limiting

- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour
- 403 errors include a hint to add a token
- All fetches share a single `AbortController` — starting a new action cancels any in-flight request

---

## File Content Viewer

### Content Area Structure

When a file is selected, the content area shows:

```
<div class="file-header">  (sticky, stays at top while scrolling)
  <h3 class="file-title">
    repo-name / path / filename
    GitHub icon link (opens source on GitHub)
  </h3>
  <div class="file-actions">
    "New Tab" button (opens GitHub Pages URL)
    Rendered/Raw toggle (for markdown, HTML, SVG)
  </div>
</div>
<div id="viewRendered">  (rendered content)
<div id="viewRaw">  (raw source, hidden by default)
```

### File Type Handling

| Extension | Rendering |
|-----------|-----------|
| `.md` | Rendered via `marked.js` into `.markdown-body` div; raw toggle available; internal links rewritten |
| `.html`, `.htm` | Fetched, converted to Blob URL, embedded in `<iframe sandbox="allow-scripts">`; raw toggle; "New Tab" opens GitHub Pages URL |
| Code/text | `<pre><code>` with `highlight.js` syntax highlighting |
| `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.ico` | Inline `<img>` with `max-width: 100%`; SVG also offers raw toggle |
| `.mp3`, `.wav`, `.ogg` | HTML5 `<audio>` player |
| `.mp4`, `.webm` | HTML5 `<video>` player |
| `.pdf` | With token: fetched as blob via API, displayed in iframe with blob URL. Without token: Google Docs Viewer in iframe |
| `.xlsx`, `.xls`, `.csv`, `.ods` | Parsed with SheetJS (`XLSX.read`), each sheet rendered as an HTML table with sheet name heading |
| Other | `<pre>` block (plain text) |

### Markdown Link Rewriting

- GitHub blob links → navigate within the app
- Relative paths → resolved against current file's directory
- External links → `target="_blank" rel="noopener"`
- If `marked.parse()` throws, show error banner + raw fallback

### Large File Protection

- Threshold: `LARGE_FILE_WARNING_BYTES = 1024 * 1024` (1 MB)
- Files exceeding threshold trigger a `window.confirm()` dialog
- Approved files tracked in `approvedLargeFiles` Set (per session)
- File size read from tree API response (`item.size`)

### File Header Details

- Repo name is a clickable link that navigates back to the repo tree root
- Path segments shown with `/` separators
- GitHub icon links to the file on GitHub
- "New Tab" button opens GitHub Pages URL: `https://{owner}.github.io/{repo}/{path}`

### Rendered ↔ Raw Toggle

- Two-button toggle: "Rendered" and "Raw"
- Active button full opacity, inactive 0.5 opacity
- Toggles `display` on `#viewRendered` / `#viewRaw`
- Only shown for file types with both views (markdown, HTML, SVG)

---

## Navigation & Tree

### Hash-Based Routing

Simplified format: `#{owner}/{repo}/{filepath}`

Examples:
- `#theo-armour/sandbox` → load sandbox repo, show tree + README
- `#theo-armour/sandbox/tootoo/index.html` → load repo and open specific file

### Hash Behavior
- `updateHash()` uses `history.pushState` for forward navigation (creates history entries)
- `history.replaceState` used only for reload (no history entry)
- Hash **not** set for auto-displayed READMEs on initial load
- `popstate` and `hashchange` events trigger `handleHashChange()`
- Deep linking: on page load, if hash present, parse owner/repo/file from it and navigate

### Simplified Rules
- Hash always has at least `owner/repo` (both are required)
- No `#owner`-only hashes (no repo list to show)
- No `#gist/` prefix (gists are omitted)

### Tree Rendering

- `renderTree()` builds a nested object from flat tree paths, then generates HTML
- Folders rendered as `<details><summary>` elements (native collapsible)
- Files rendered as `<div class="tree-item">` with `data-action="select-file"` and `data-path`
- Folders sorted before files, then alphabetically within each group
- File sizes shown right-aligned in a `.tree-item-size` span
- Monospace font for tree items

### Expand All / Collapse All

- Toggle button next to "Files" heading in sidebar (right-aligned)
- Sets/removes `open` attribute on all `<details>` elements
- Button text switches between "Expand All" and "Collapse All"

### Auto-Open README

- When the repo tree loads, auto-open `README.md` (case-insensitive, also matches `readme.txt`)
- Uses `state.tree.find()` on the flat tree array

---

## Keyboard Navigation

Global `keydown` listener on `document`, active only when focus is on a `.tree-folder` or `.tree-item`:

| Key | Action |
|-----|--------|
| Arrow Down | Focus next visible tree item |
| Arrow Up | Focus previous visible tree item |
| Enter / Space | Activate focused item (click file, toggle folder) |
| Arrow Right | Expand focused folder (if collapsed); move into first child (if expanded) |
| Arrow Left | Collapse focused folder (if expanded); move to parent folder (if collapsed or file) |

- "Visible items" = all `.tree-folder` and `.tree-item` elements that are not inside a closed `<details>`
- Items have `tabindex="0"` for focusability
- `e.preventDefault()` applied to prevent page scroll

---

## Init Sequence

```
1. Read CONFIG → set state (owner, repo, branch)
2. Read localStorage for token → build headers object
3. If URL hash present → parse owner/repo/filepath from hash
4. Call loadRepo() → fetches default branch (if needed), tree, renders sidebar
5. If filepath from hash → open that file
6. Else → auto-open README.md
```

