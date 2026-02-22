# Newww-tab Prompt

Create or edit `newww-tab.html` in this folder. It serves as a browser home page / new tab page for quick access to ~100 frequently used URLs.

## Data

* URLs live in separate markdown files under `data/`: theo.md, vscode.md,reads.md, news.md, ai.md, apps.md, groups.md, orgs.md
* The title of the markdown file indicates the name of the category the links in the file belong to.
* Links use markdown syntax: `[title](url)`
* Files may contain `<details>` sections for collapsible groups, `<textarea>` elements, and inline HTML

## Layout

* Single self-contained HTML file — no build step
* Side-by-side scrollable columns (flex-wrap), one per data file
* Column order: theo, vscode,reads, news, ai, apps, groups, orgs
* Each column has a clickable title that collapses/expands the column; state saved to localStorage
* Column titles include an indicator of open/closed state: "▼" for open, "▶" for closed
* Column titles include a pencil icon (✏️) that opens the corresponding markdown file on GitHub for editing


## Style

* Monospace font, green links (200% font-size), dark mode via `prefers-color-scheme`
* Columns: `flex: 0 1 22ch`, full viewport height, thin green scrollbars
* Embedded `<textarea>` and `<details>/<summary>` elements styled to match the theme
* Vestigial `.tooltip` divs from data files hidden via `display: none`

## Rendering

* Showdown.js (CDN) converts markdown to HTML
* Showdown config: `simpleLineBreaks`, `simplifiedAutoLink`, `openLinksInNewWindow`
* All links open in new tabs

## To add or edit URLs

Edit the markdown files in `data/`. The page fetches them on each load — no code changes needed.
