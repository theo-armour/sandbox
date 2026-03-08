# Newww-tab Prompt

Browser home page / new tab page for quick access to ~100 frequently used URLs. Two versions exist in this folder.

---

Stores all data in JSON. Fully interactive — add, edit, delete, drag-and-drop links without touching GitHub. Can import from and export to markdown files

### Data model

* Primary storage:  JSON
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
  * Reorder links within a section or move them between sections/columns
  * Reorder sections within a column or move them between columns
  * Reorder columns via drag handle on the column header
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

### Sync

* Sync button opens a modal: configure repo (`theo-armour/sandbox`) and data file path (`cookbook/newww-tab/newww-tab-data.json`)
* All data stored as a single JSON file on GitHub — same structure as localStorage
* **Pull**: one GET to the GitHub Contents API, decodes the JSON, replaces localStorage, re-renders (1 API call)
* **Push**: one PUT to the GitHub Contents API with the full JSON (1 API call, requires token)
* No directory traversal, no markdown parsing, no manifest file
* Editing the JSON file directly on GitHub works — pull brings those changes down
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

Edit directly in the browser: click "+ Add link" in any section, or click the pencil icon on an existing link. Drag links to reorder or move between sections. All changes are saved to localStorage immediately. Click Sync → Push to commit changes to GitHub as a single JSON file.
