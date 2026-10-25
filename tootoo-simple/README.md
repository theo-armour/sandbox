# TooToo Simple

A single-user TooToo: one GitHub repo browser dedicated to **theo-armour**, showing every repository the owner has, with `theo-armour.github.io` opened first.

## How it differs from canonical TooToo

- **Single owner, baked in.** No `tootoo.config.js`, no unknown owners or repositories. The identity lives in a small inline config block in `index.html`.
- **Repo shelf.** The sidebar starts with a 📚 shelf listing all of the owner's repositories (from `ta-data.js` — zero API calls to draw the list). Clicking a repo points the whole app at it; its file tree loads below via the normal TooToo machinery.
- **🏛️ organizations.** A pinned shelf row renders `organizations.md` — descriptions plus site + GitHub links for all 35 organizations, generated from the GitHub API and then hand-editable.
- **Monospace** body font, per Theo's standing preference.

## Files

- `index.html` — the app. Started as a copy of canonical `pushme-pullyou-tootoo/index.html` (2026-10-24) and modified; it is a **sandbox fork**, not synced by the TooToo pipeline.
- `ta-data.js` — the data, from the GitHub API: `repos` (yours, private ones by name only) and `orgs` (each with its `repoList`). Hand-edit `pick` and `note`; refreshes keep them.
- `ta-data-refresh.html` — rebuilds `ta-data.js` in the browser: Fetch, then Save.
- `organizations.md` — generated from `ta-data.js`, then hand-editable.

## Changelog

### 2026-10-25

- `ta-data.js` splits into separate `repos` and `orgs` lists
- Add `ta-data-refresh.html`; retire `update-ta-data.ps1`
- ⭐ favorites, 🔒 private repos, maroon theme, hidden plumbing/backup files, named-README picker, shelf arrow keys

### 2026-10-24

- Draggable divider under the repo shelf: drag to resize, double-click to reset; height remembered per browser
- First build: canonical TooToo copy + repo shelf, baked identity, organizations.md, monospace font
