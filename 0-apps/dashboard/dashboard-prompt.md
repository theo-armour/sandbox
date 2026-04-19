# Dashboard ~ Personal Info Panel

A single-file HTML personal dashboard designed to run inside an iframe. Sibling iframes handle activity timing (Teodoro), calendar, and similar tools. This panel focuses on at-a-glance personal info.

## Iframe Context
* Runs as one pane in a multi-iframe layout — must not set page title or interfere with parent
* No fixed width/height — fill 100% of the iframe, scroll internally if needed
* Communicate with sibling iframes only via `postMessage` if needed in the future (not required initially)

## Content Sections
* **Clock** — current time (HH:MM), updating every minute, with date below (e.g. "Friday, April 18, 2026")
* **Weather** — placeholder section with a location label ("San Francisco") and space for future API integration
* **Quick Links** — a configurable list of bookmarks rendered from a `const LINKS = [...]` array at the top of the script
* **Notes** — a small editable text area that persists content to `localStorage`

## Appearance
* Minimalist, flat, system-native design — match Teodoro's style (system fonts, monochrome palette, no heavy shadows)
* Respect OS light/dark color scheme via `prefers-color-scheme`
* CSS Custom Properties for all colors — same variable names as Teodoro (`--bg`, `--fg`, `--btn-bg`, `--btn-hover`)
* Compact vertical layout — sections stack top to bottom with minimal gaps
* Readable at small sizes — use `clamp()` for font sizes

## Constraints
* Single self-contained HTML file — no build tools, no frameworks, no Node.js
* Vanilla JavaScript, ES2020+ — `const`/`let`, arrow functions, no classes, no `this`, no `var`
* Must work via `file://` and GitHub Pages
* No external dependencies except optional future API calls
