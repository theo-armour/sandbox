# NewwwTab — Build Prompt

Build a single-file browser home page / new-tab page for managing ~100 frequently used links.

**Constraints**: One self-contained `.html` file. No frameworks, no build tools, no backend. Vanilla HTML5 + CSS3 + ES6+ JavaScript. Only external dependency: SortableJS 1.15.3 via CDN.

---

## File structure

```
newww-tab/
├── index.html          # redirect → newww-tab.html
├── newww-tab.html       # the app (single file, all CSS + JS inline)
└── links.json           # user data (sibling file, fetched on load)
```

---

## Data model

Primary storage is `links.json` (fetched via `fetch('./links.json')`).
No localStorage for link data — only the GitHub personal access token is stored there.

### JSON schema

```json
{
  "columns": [{
    "title": "string",
    "sections": [{
      "title": "string (optional, can be empty)",
      "links": [{
        "title": "string",
        "url": "string",
        "g": "github-url (optional — shorthand for GitHub secondary link)",
        "secondary": "label (optional — custom secondary badge text)",
        "secondaryUrl": "string (optional — custom secondary link URL)"
      }]
    }]
  }]
}
```

**Rules**:
- `"g"` is a shorthand: if present, renders as a `[g]` badge linking to the GitHub URL. Mutually exclusive with `secondary` + `secondaryUrl`.
- File must be clean, human-readable JSON — no runtime IDs, no UI state.

### Runtime normalization

On load, `normalize()` decorates every column, section, and link with a unique runtime `id` (for drag-and-drop tracking) and default values. On save, `serialize()` strips IDs and transient state, producing clean JSON matching the schema above.

### Dirty tracking

Any data mutation sets a dirty flag → shows `● unsaved` indicator in the toolbar and turns the Save button border orange. Saving clears the flag.

**Important**: Toggling section collapse is a UI-only action — do NOT mark dirty when collapsing/expanding, since collapse state is not persisted.

---

## Layout

### Toolbar (sticky, top)

A single-row sticky toolbar with:
- App title: **NewwwTab** (bold, 14px)
- Live clock: `HH:MM · Weekday, Month Day, Year` (updates every 60s)
- Search input: placeholder `🔍 Filter Links...` (160px wide)
- Unsaved indicator: `● unsaved` (hidden when clean)
- Buttons: **Toggle All**, **+ Column**, **⬆ Save**, **Export**, **Settings**

### Columns

- 8 equal-width columns side by side using `display: flex; flex-wrap: wrap` with `flex: 1 1 0; min-width: 0` on each column
- Each column has a minimal 26px drag-handle bar at top containing:
  - A braille-dot drag grip (`⠿⠿`)
  - Action buttons: ◀ (move left), ▶ (move right), +sec (add section), ✕col (delete column)

### Sections

- Separated by a `border-top`
- Header row: collapse toggle (▼/▶), section title, and hover-revealed action buttons (+, ✎, ✕)
- Body: a list of links, collapsible

### Links

- Each link row: hover-revealed drag grip (⠿), optional secondary badge `[g]` or `[label]`, primary link text
- Hover-revealed edit (✎) and delete (✕) buttons on the right
- Primary links: green (`--link` color), no underline, underline on hover
- Secondary badges: blue (`--link2`), small bordered pill

### Typography & theming

- Monospace font stack: SF Mono → Cascadia Code → Fira Code → Consolas, 18px, line-height 1.15
- Full light/dark mode via CSS custom properties and `@media (prefers-color-scheme: dark)`
- Light: white background, green links (#007700), blue secondary (#005599)
- Dark: #222 background, bright green links (#55cc55), bright blue secondary (#55aaff)
- Thin 4px green scrollbars
- Dense layout — minimal padding throughout

---

## Interactivity

### Drag-and-drop (SortableJS)

Three levels of SortableJS instances:

| Level | Container | Handle | Group | Cross-container? |
|-------|-----------|--------|-------|------------------|
| Columns | `#columns` | `.col-handle` | — | No |
| Sections | `.col-secs` | `.sec-hd` | `'secs'` | Yes (between columns) |
| Links | `.links-list` | `.lk-drag` | `'links'` | Yes (between sections) |

Each `onEnd` callback reconciles DOM order back into the `state` arrays by splicing, then marks dirty.

**Cleanup**: Destroy and recreate the column-level SortableJS instance on every render to prevent stacking. Section and link instances are garbage-collected with their DOM nodes.

### CRUD operations

| Action | Trigger | Behavior |
|--------|---------|----------|
| Add column | Toolbar `+ Column` button | Modal → title input → appends column with one empty section |
| Delete column | `✕col` on handle | Confirm if any section has links, then remove |
| Move column | ◀ / ▶ on handle | Swap with adjacent column in state array |
| Add section | `+sec` on column handle | Modal → title input → appends to column |
| Delete section | `✕` on section header (hover) | Confirm if section has links, then remove |
| Rename section | `✎` on section header (hover) | Inline edit: replaces `<span>` with `<input>`, Enter saves, Escape reverts |
| Add link | `+` on section header (hover) | Modal: URL (required), Title (auto-generated from hostname if blank), GitHub URL |
| Edit link | `✎` on link row (hover) | Modal: Title, URL, GitHub URL, other secondary label, other secondary URL |
| Delete link | `✕` on link row (hover) | Immediate removal, no confirmation |

### URL drop

Drag a URL from the browser address bar onto any section body → creates a new link using the hostname as title → opens the edit modal immediately for refinement.

### Search

- `Ctrl+F` intercepts browser find and focuses the search input
- Filters by link title + URL across all columns (80ms debounce)
- Non-matching links get `display: none`; matching links get a green highlight background
- `Escape` clears the filter and blurs the input

### Toggle All

Click toggles all sections collapsed or expanded. If any section is expanded, collapse all; if all are collapsed, expand all.

---

## Keyboard shortcuts

| Key | Context | Action |
|-----|---------|--------|
| `Ctrl+F` / `Cmd+F` | Anywhere | Focus search input |
| `Escape` | Search focused | Clear filter, blur |
| `Enter` | Inline edit | Save and close |
| `Escape` | Inline edit | Cancel and revert |

---

## Save / persistence

Routing is automatic based on `window.location`:

### Local (localhost / 127.0.0.1 / file://)

1. Use the **File System Access API** (`showSaveFilePicker` / `createWritable`)
2. On first save: show file picker so user selects their `links.json`
3. Cache the file handle in **IndexedDB** (`newwwtab-fs` database, `fs` object store)
4. On subsequent saves: reuse cached handle (re-verify permission, re-prompt if lapsed)
5. **Fallback** (browsers without FSA, e.g., Firefox): trigger a download of `links.json`

### Remote (GitHub Pages or any other host)

1. Show a modal: Repository (default: `theo-armour/sandbox`), File path (default: `cookbook/newwtab/links.json`), GitHub personal access token
2. **GET** `https://api.github.com/repos/{repo}/contents/{path}` to fetch current SHA
3. **PUT** same endpoint with Base64-encoded JSON content and the SHA to commit
4. Token stored in localStorage key `newwwtab-gat`

---

## Export

Export button opens a modal with:
- **JSON** view: clean serialized data (no IDs, no transient state)
- **Markdown** view: `# Column` / `## Section` / `[title](url) [g](github-url)` per link
- **Copy** button (clipboard)
- **Download** button (saves as `links.json` or `links.md`)

---

## Settings

Settings modal contains:
- Checkbox: **Reload data from links.json** (re-fetches and re-normalizes; discards unsaved changes)

---

## URL rewriting

On web servers (not `file://`), run `history.replaceState(null, '', './')` at startup to normalize the URL so that relative `fetch('./links.json')` works regardless of trailing slashes.

---

## Security

- All user-supplied strings must be HTML-escaped via `esc()` before interpolation into `innerHTML`. This includes link titles, URLs, section titles, and any modal inputs.
- GitHub token: stored in localStorage only; transmitted only to `api.github.com` over HTTPS.
- All external links open with `target="_blank" rel="noopener"`.

---

## Default data

On first use, `links.json` should contain a representative set of bookmark columns. See the companion file `newwwtab-data-default.md` for the default link set in Markdown format and `links.json` for the JSON version.


