# NewwwTab Prompt

Browser home page / new tab page for quick access to ~100 frequently used URLs.

Single self-contained `index.html` — no build step, no framework, no backend.

---

## Data model

* **Primary storage**: `links.json` (sibling file, fetched at load)
* **No localStorage for data** — only the GitHub token is stored in localStorage (`newwwtab-gat`)
* **JSON structure** (human-readable, no IDs, no UI state):

```json
{ "columns": [{ "title": "string", "sections": [{ "title": "string?",
  "links": [{ "title": "string", "url": "string",
    "g": "github-url",
    "secondary": "label", "secondaryUrl": "string"
  }]
}]}]}
```

* `"g"` key: shorthand for a GitHub secondary URL — renders as `[g]` badge inline
* `"secondary"` + `"secondaryUrl"`: non-GitHub secondary link with custom label
* **Runtime state**: IDs are added by `normalize()` on load; stripped by `serialize()` on save
* **Dirty tracking**: `● unsaved` indicator + orange Save button when changes are pending

---

## Layout

* Compact sticky toolbar: title, clock, search input, unsaved indicator, Toggle All, + Column, Save, Export, Settings
* **8 equal-width columns** side by side (`flex: 1 1 0; min-width: 0`), filling full viewport width
* **Columns have no visible name** — only a minimal 26px drag handle bar at top
* Columns contain sections; sections contain links
* Sections are collapsible with ▼/▶; state is in-memory only (not persisted)
* Monospace font: SF Mono → Cascadia Code → Fira Code → Consolas, 18px
* Green links (`#007700` light / `#55cc55` dark)
* Dark mode via `prefers-color-scheme` CSS variables
* Thin green scrollbars; dense layout (padding minimal, line-height 1.15)

---

## Interactivity

* **Drag-and-drop** via SortableJS 1.15.3 (CDN):
  * Columns: drag by the top handle bar
  * Sections: drag by the section title bar
  * Links: drag by the ⠿ grip (appears on hover)
  * Sections and links can be moved between columns/sections
* **Move columns**: ◀ / ▶ buttons on the column handle (visible always)
* **Inline rename**: pencil ✎ icon on section header → edits title in place; Enter saves, Escape cancels
* **Link editing**: ✎ icon on a link → modal with Title, URL, GitHub URL, secondary label/URL fields
* **Add link**: **`+` button on the section header bar** (appears on hover alongside ✎ and ✕)
* **URL drop**: drag a URL from the browser address bar onto any section body → link created with hostname as title, edit modal opens immediately
* **Delete**: ✕ on section header (with confirmation if non-empty); ✕ on each link
* **Add section**: `+sec` button on column handle
* **Add column**: `+ Column` toolbar button
* **Search**: Ctrl+F focuses filter bar; filters by title and URL across all columns; highlights matches; Escape clears

---

## Save / persistence

Routing is automatic based on `window.location.hostname`:

| Environment | Save behaviour |
|---|---|
| `localhost` / `127.0.0.1` / `file://` | **File System Access API** writes `links.json` directly to disk. File picker appears on first save; handle cached in IndexedDB for silent subsequent saves. Fallback: JSON download (Firefox). |
| Any other hostname (GitHub Pages) | **GitHub Contents API modal**: enter repo (`theo-armour/sandbox`), file path (`cookbook/newwtab/links.json`), and a personal access token. One GET for SHA, one PUT to commit. Token stored in localStorage. |

---

## Export

* Export button opens modal with JSON and Markdown views
* **JSON**: clean serialized data (no IDs, no UI state) — suitable for backup or editing
* **Markdown**: `# Column` / `## Section` / `[title](url) [g](github-url)` format
* Copy to clipboard and Download buttons included

---

## Dependencies

* **SortableJS 1.15.3** from CDN — only external dependency
* Everything else is vanilla HTML5 / CSS3 / ES6+ JavaScript

---

## Editing URLs

In the browser:
* Hover a section header → click **+** to add a link
* Click **✎** on any link to edit its title, URL, or secondary URL
* Drag links to reorder or move between sections
* Drop a URL from the address bar onto a section body

Changes show `● unsaved` — click **Save** to persist (writes `links.json` locally or pushes to GitHub).
