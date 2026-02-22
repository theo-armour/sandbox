# Newww-tab Prompt

Browser home page / new tab page for quick access to ~100 frequently used URLs. Two versions exist in this folder.

---

## Version 1: `newww-tab.html` (static, read-only)

Fetches link data from GitHub on every page load. Read-only — editing is done by modifying markdown files on GitHub.

### Data

* Each column is a subfolder under `data/` (e.g., `data/theo/`, `data/reads/`, etc.)
* Files within each subfolder are auto-discovered at runtime via the GitHub Contents API — no file lists in the HTML
* Links use markdown syntax: `[title](url)`
* Each `<details>/<summary>` section from the original data has been extracted into its own file — no `<details>` tags remain in the markdown files
* Files may contain `<textarea>` elements and inline HTML

### Layout

* Single self-contained HTML file — no build step
* Side-by-side scrollable columns (flex-wrap), one per data file
* Column order: theo, reads, news, ai, apps, groups, orgs
* `.md` files in each subfolder are discovered automatically via the GitHub Contents API at page load
* Only the column folder names are listed in the HTML (`COLUMNS` array)
* Each column has a clickable title that collapses/expands the column; state saved to localStorage
* Column titles include an indicator of open/closed state: "▼" for open, "▶" for closed
* Single-file columns: pencil icon on the column title opens the markdown file on GitHub for editing
* Multi-file columns: each file renders in its own `<details>/<summary>` section with a pencil icon on the summary

### Style

* Monospace font, green links (200% font-size), dark mode via `prefers-color-scheme`
* Columns: `flex: 0 1 22ch`, full viewport height, thin green scrollbars
* Embedded `<textarea>` and `<details>/<summary>` elements styled to match the theme

### Rendering

* GitHub Contents API discovers `.md` files in each `data/{column}/` subfolder
* File content fetched via `download_url` (raw.githubusercontent.com — no API rate cost)
* Showdown.js (CDN) converts markdown to HTML
* Showdown config: `simpleLineBreaks`, `simplifiedAutoLink`, `openLinksInNewWindow`
* All links open in new tabs

### GitHub Access Token

* A key icon in the bottom-right corner opens a settings panel to enter a GitHub Personal Access Token
* Token is stored in localStorage (`newww-tab-gat`) and sent as `Authorization: token {gat}` on API calls
* Without a token: 60 API requests/hour; with a token: 5,000/hour
* If rate-limited, columns show a message prompting the user to add a token

### To add or edit URLs

Edit or move markdown files in the column subfolders under `data/`. The page discovers them automatically on each load — no HTML changes needed. To add a new column, create a subfolder and add its name to the `COLUMNS` array.

---

## Version 2: `newww-tab-interactive.html` (local-first, editable)

Stores all data in localStorage as JSON. Fully interactive — add, edit, delete, drag-and-drop links without touching GitHub. Can import from and export to the same markdown files used by version 1.

### Data model

* Primary storage: `localStorage` key `newww-tab-data` containing JSON
* Structure: `{ columns: [{ id, title, color, collapsed, sections: [{ id, title, collapsed, links: [{ id, title, url, secondaryTitle, secondaryUrl }] }] }] }`
* Paired links: a single link item can have both a primary URL (the site) and a secondary URL (e.g., the GitHub repo), displayed inline as `[g] [title]`
* Link titles are truncated to 10 characters in the display; full title shown on hover tooltip
* No data is fetched from GitHub at page load — the page works entirely offline from localStorage

### Layout

* Single self-contained HTML file — no build step
* Compact toolbar at top: search input, + Column, Import, Export, Settings buttons
* Side-by-side scrollable columns (`flex: 0 1 24ch`, flex-wrap), all 7 columns visible on screen
* Columns contain sections (equivalent to the `.md` files in version 1)
* Sections contain links
* Collapsible columns and sections with "▼"/"▶" indicators; state saved to localStorage

### Interactivity

* **Drag-and-drop** (SortableJS from CDN):
  - Reorder links within a section or move them between sections/columns
  - Reorder sections within a column or move them between columns
  - Reorder columns via drag handle on the column header
* **Move columns**: "◀" / "▶" arrow buttons on each column header (shown on hover)
* **Inline editing**: click the pencil icon on any column, section, or link to rename it; Enter saves, Escape cancels
* **Link editing**: pencil icon opens a form with Title, URL, Secondary Label, Secondary URL fields
* **Add/delete**: "+" buttons for columns (toolbar), sections (column header), and links (bottom of each section); "✕" buttons to delete (with confirmation for non-empty items)
* **URL drop**: drag a URL from the browser address bar onto any section to create a new link (hostname used as default title, edit form opens immediately)
* **Search**: Ctrl+F focuses the filter bar; filters across all columns by title and URL; highlights matches; Escape clears

### Style

* Monospace font (`SF Mono`, `Cascadia Code`, `Fira Code`, `Consolas`), green links at 200% font-size
* Dark mode via `prefers-color-scheme` (light: white/#fff, dark: #222)
* Thin green scrollbars matching version 1
* Drag handles, edit/delete buttons appear on hover to keep the UI clean
* Compact and dense layout — minimal padding, tight line-height (1.15)

### Import

* Import button opens a modal: configure repo (`theo-armour/sandbox`), data path (`cookbook/newww-tab/data`), and optional GitHub token
* Fetches directory listing via GitHub Contents API, then each `.md` file via `download_url`
* Parses `[title](url)` markdown links; detects paired links (two links on one line: first becomes secondary, second becomes primary)
* Creates columns from folder names, sections from file names
* Can replace or merge with existing data
* Token stored in localStorage (`newww-tab-gat`) for reuse

### Export

* Export button opens a modal with JSON or Markdown download
* JSON: full data structure, suitable for backup/restore
* Markdown: `# Column` / `## Section` / `[title](url)` format, compatible with the `data/` folder structure
* Copy to clipboard button included

### Dependencies

* SortableJS 1.15.3 (CDN) — only external dependency
* No Showdown.js (no markdown rendering at runtime)

### To add or edit URLs

Edit directly in the browser: click "+ Add link" in any section, or click the pencil icon on an existing link. Drag links to reorder or move between sections. All changes are saved to localStorage immediately.
