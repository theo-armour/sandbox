# NewwwTab — Build Prompt

Build a single-file browser home page / new-tab page for managing ~100 frequently used links.

**Constraints**: One self-contained `.html` file. No frameworks, no build tools, no backend. Vanilla HTML5 + CSS3 + ES6+ JavaScript. Only external dependency: SortableJS 1.15.3 via CDN.

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

