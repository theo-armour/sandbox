# TooToo Lab — Graduation / Parity Audit

**Question:** can the assembled component build replace canonical `index.html`?
**Answer (2026-06-21):** 🟥 blockers **and** 🟧 important items are now CLOSED (see
below). What remains is minor 🟨 polish + a manual verification pass (the
click/keyboard features can't be verified headlessly). Graduation is realistic once
that pass confirms behavior.

Graduation is not a file swap; it's: **(1) reach parity → (2) verify (self-test +
manual) → (3) swap via the pipeline.** We're at step 1.

## ✅ Blockers — CLOSED 2026-06-21

- **`detectRepo` — GitHub Pages auto-detection (§9). DONE.** Now: params →
  localStorage cache → `<owner>.github.io/<repo>/` hostname → CONFIG (incl. local
  `.git/config` seed) → manual entry form. ⚠️ The `.github.io` path can't be tested
  from `file://`; logic is a faithful port + the CONFIG path is regression-verified.
- **Markdown relative-image resolution (§33). DONE.** `resolveRepoPath` +
  `resolveMediaUrl` resolve relative image `src` (and in-repo links) against the
  current file's directory. ⚠️ Not visually exercised (the test repo's README uses
  absolute image URLs); code-complete.
- **New Tab / Download routing (`getNewTabUrl`, §31). DONE (simplified).** Opens
  the local file (drop-in) or the raw GitHub URL — text/images view inline,
  binaries download. Not the full Pages-vs-raw routing, but correct for the cases.
- **Blob URL revocation (§5). DONE.** `createBlobUrl` tracks every URL;
  `selectFile` calls `revokeAllBlobUrls()` on each navigate. No more leak.

Also fixed: the breadcrumb folder links (previously dead) open + scroll the folder (§29).

## 🟧 Important

✅ **DONE 2026-06-21:**
- **About panel (§12c) + repo stats (§17)** + About/Token toggle-return behavior.
- **Self-test (§12b)** — simplified: fetch-checks every visible text file (media/sheets skipped).
- **Branch switcher** — wired: chip shows the branch, dropdown lists branches, switch-in-place. Verified (chip renders).
- **Dark code theme (`setHljsTheme`, §10)** — highlight.js theme follows dark mode (+ dark-mode persistence/restore).
- **Global error handlers (§39)** + **breadcrumb folder scroll (§29).**

✅ **DONE 2026-06-21 (batch 2):**
- **Responsive + print + reduced-motion CSS** — `@media` blocks ported (responsive verified at 600px; print adds `#printTitle`).
- **Token error flows** — `fetchTree` auto-opens the token panel on 403/404; token panel gained a "Reset all data" button.

✅ **DONE 2026-06-21 (batch 3):**
- **Keyboard navigation + shortcuts (§27, §13)** — Ctrl/⌘ B (toggle sidebar), `/`
  (focus filter), `\` (focus tree), ↑↓ Home End PgUp PgDn (move + load), Enter/Space
  (open/toggle), →/← (open/close/step folder), Esc (clear filter). ⚠️ **Not
  headless-verifiable** — needs real key events; manual test required.

✅ **DONE 2026-06-21 (batch 4):**
- **Full self-test (§12b)** — renders each visible file off-screen by type (markdown
  parse, SVG/image decode, spreadsheet read, media reachability, text load) with a
  pass/fail/skip table + concurrency. Replaces the earlier fetch-only check.

**All 🟧 important items are now closed.**

## 🟨 Minor

- Oversized-repo panel richness (§21b), per-pathname storage scoping (§4),
  rate-badge low/critical styling, `headingFont`/`faviconLetters` theming knobs.

## Verification log

- ✅ **2026-06-21 — Panels + print** user-verified: About (+ Run self-test), Token
  (+ Reset all), dark mode + code theme, branch dropdown, print preview. All OK.
- 🟡 **Keyboard nav** — keys confirmed working; added a fix so `\` exits the filter
  (so `/` ⇄ `\` toggles filter↔tree). Awaiting re-confirm of that toggle.
- ✅ **2026-06-21 — Markdown relative images** user-verified OK.
- ✅ **2026-06-21 — Local `file://` drop-in** verified: dropped the assembled file at
  the `theo-armour-sandbox` checkout root → it detected `theo-armour/sandbox` from
  `.git/config` and loaded it. (Bug fixed: the static CONFIG default repo had been
  overriding `.git/config`; local detection now wins.)

## Recommended path

1. Close 🟥 blockers first (esp. Pages detection + Markdown images — these break
   deployed forks and common READMEs).
2. Close 🟧 important items (About/self-test, keyboard, branch switcher, responsive/print).
3. Verify: run the self-test once it exists, plus manual passes (a big repo, a
   README with images, mobile width, print, a binary New-Tab).
4. **Then** graduate: diff assembled vs canonical, and fold `assemble` into the
   pipeline ahead of `promote`.

Until then the lab stays a sandbox; canonical `index.html` remains the source.
