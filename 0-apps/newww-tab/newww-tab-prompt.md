# NewwwTab — Build Prompt

Build a single-file browser home page / new-tab page for managing ~100 frequently used links.

**Constraints**: One self-contained `.html` file. No frameworks, no build tools, no backend. Vanilla HTML5 + CSS3 + ES6+ JavaScript. No external dependencies.

---


read newwwtab-data-default.md

Use the data in newwwtab-data-default.md to populate the page with links.

The data is organized into categories and subcategories, which should be reflected in the UI.

Header 2: categories displayed as columns

header 3: displayed as sections within each column

Header 3 titles become the summary for an HTML display.

list items are the links, with the format: `- name url`. The name is the text to display for the link, and the url is the href for the link.

Some list items may contain two links.In this case, the first link is to the Google source code.The second link is to the GitHub pages url

Example:
- [g](https://github.com/pushme-pullyou/) PshPll https://pushme-pullyou.github.io/.

The links are displayed as clickable items within each section.

## Section open/closed state

H3 titles may begin with a sign to indicate the default state of the `<details>` section:

- `### + Title` — section is rendered **open**
- `### - Title` — section is rendered **collapsed**
- `### Title` (no sign) — defaults to open

The sign is stripped from the rendered summary; it only controls the initial `open` attribute.

## Layout

- Columns are laid out horizontally as a flex row; fixed column width `--col-width: 8rem`.
- Root font size `html { font-size: 135% }` so the whole page scales with user preference.
- H2 column headers are **hidden** (columns are distinguished by position/content only).
- Sections use native `<details>`/`<summary>` with a custom `▾` disclosure marker (1.4rem).

## Header

The page `<h1>` contains two links, in this order:

1. A GitHub mark (inline SVG) linking to the app's source folder on GitHub — opens in a new tab.
2. The title "NewwwTab" as a self-link (`href=""`) that reloads the app when clicked.

