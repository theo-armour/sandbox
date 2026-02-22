# Newww-tab Prompt

Create or edit `newww-tab.html` in this folder. It serves as a browser home page / new tab page for quick access to ~100 frequently used URLs.

## Data

* Each column is a subfolder under `data/` (e.g., `data/theo/`, `data/reads/`, etc.)
* Files within each subfolder are auto-discovered at runtime via the GitHub Contents API — no file lists in the HTML
* Links use markdown syntax: `[title](url)`
* Each `<details>/<summary>` section from the original data has been extracted into its own file — no `<details>` tags remain in the markdown files
* Files may contain `<textarea>` elements and inline HTML

## Layout

* Single self-contained HTML file — no build step
* Side-by-side scrollable columns (flex-wrap), one per data file
* Column order: theo, reads, news, ai, apps, groups, orgs
* `.md` files in each subfolder are discovered automatically via the GitHub Contents API at page load
* Only the column folder names are listed in the HTML (`COLUMNS` array)
* Each column has a clickable title that collapses/expands the column; state saved to localStorage
* Column titles include an indicator of open/closed state: "▼" for open, "▶" for closed
* Single-file columns: pencil icon (✏️) on the column title opens the markdown file on GitHub for editing
* Multi-file columns: each file renders in its own `<details>/<summary>` section with a pencil icon on the summary; no duplicate of the column title


## Style

* Monospace font, green links (200% font-size), dark mode via `prefers-color-scheme`
* Columns: `flex: 0 1 22ch`, full viewport height, thin green scrollbars
* Embedded `<textarea>` and `<details>/<summary>` elements styled to match the theme
* Vestigial `.tooltip` divs from data files hidden via `display: none`

## Rendering

* GitHub Contents API discovers `.md` files in each `data/{column}/` subfolder
* File content fetched via `download_url` (raw.githubusercontent.com — no API rate cost)
* Showdown.js (CDN) converts markdown to HTML
* Showdown config: `simpleLineBreaks`, `simplifiedAutoLink`, `openLinksInNewWindow`
* All links open in new tabs

## GitHub Access Token

* A 🔑 icon in the bottom-right corner opens a settings panel to enter a GitHub Personal Access Token
* Token is stored in localStorage (`newww-tab-gat`) and sent as `Authorization: token {gat}` on API calls
* Without a token: 60 API requests/hour; with a token: 5,000/hour
* If rate-limited, columns show a message prompting the user to add a token

## To add or edit URLs

Edit or move markdown files in the column subfolders under `data/`. The page discovers them automatically on each load — no HTML changes needed. To add a new column, create a subfolder and add its name to the `COLUMNS` array.
