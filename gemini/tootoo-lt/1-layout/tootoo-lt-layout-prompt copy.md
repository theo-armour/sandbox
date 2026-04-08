# TooToo LT Layout — HTML/CSS Shell Prompt


## Hard Constraints

- **Single file**: One `.html` file — HTML, CSS, JS inline
- **Vanilla JS only**: No frameworks, no jQuery, no build tools, no Node.js
- **ES2020+**: `const`/`let` (no `var`), arrow functions, template literals
- **Functional style**: No classes, no `this` keyword
- **Every button must have a `title` attribute** with a descriptive tooltip
- **Beginner-readable**: If a student can't follow it, simplify

---

## What to Build

A three-panel layout (header bar + sidebar + content area) that fills the viewport. This is the static shell — no file tree rendering and no file content loading. It includes the CONFIG object, repo auto-detection, and header controls so the layout file is testable on its own.

### HTML Head

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="revised" content="YYYY-MM-DD HH:MM">
<title>TooToo LT</title>
```

Set the `revised` content to the current date/time when generating the file.
The `<title>` is updated dynamically by `updateHeaderFromConfig()` after repo detection.

---

## Layout Structure

```text
<body>  (flex column, 100vh, no overflow)

  <header>  (flex row, wraps, top bar)
    [GitHub SVG icon]  — leftmost, id="headerGitHub", links to "#" (updated dynamically), 18×18, currentColor, use this path:
                         <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z">
    [Title text]       — id="headerTitle", bold, 1.1rem, initial text "TooToo LT" (updated dynamically to "owner / repo"), clickable (reloads page), cursor pointer, title="Reload"
    [Dark mode button] — right-aligned (margin-left: auto), toggles 🌙/☀️
    [A− button]        — decreases font size by 2px (min 10px)
    [A+ button]        — increases font size by 2px (max 28px)
    [Token button]     — "⚙️ Token", opens prompt() for GitHub PAT
    [Rate limit badge] — hidden by default, shows "API remaining/limit"
                         Style: font-size 0.8rem, padding 0.2rem 0.45rem, 1px border,
                         border-radius 999px (pill shape), --primary-bg background,
                         opacity 0.85, white-space nowrap, aria-live="polite"
  </header>

  <main>  (flex row, fills remaining height)

    <div class="sidebar">  (flex column, fixed width via --sidebar-width)
      <div class="panel-header">  (shared header class, same as content header)
        <h3>Files</h3>  — tooltip shows "Last updated: ..." from meta[name=revised]
        <button>Expand All</button>  — right-aligned, hidden initially
      </div>
      <input type="text" placeholder="Filter files…">
        Style: width 100%, box-sizing border-box, padding 0.3rem 0.5rem,
        font-size 0.85rem, 1px --border-color border, border-radius 4px,
        white background, --text-color color, outline none;
        on focus: border-color changes to --highlight-color
      <div id="treeList">  — scrollable area, flex: 1, overflow-y: auto
        (empty — placeholder for future tree content)
      </div>
    </div>

    <div class="resizer">  (8px wide, draggable column separator)
    </div>

    <div class="content-area">  (flex: 1, scrollable)
      <div class="panel-header file-header">  (shared header class + sticky positioning)
        <h3>Content</h3>
      </div>
      <div id="contentBody">
        <p>Select a file from the sidebar.</p>
      </div>
    </div>

    <button class="back-to-top">↑</button>  — position fixed, bottom 1.5rem, right 1.5rem,
      z-index 20, --highlight-color background, white text, border-radius 50% (circular),
      width 2.5rem, height 2.5rem, font-size 1.2rem, display none initially,
      box-shadow 0 2px 6px rgba(0,0,0,0.25), aria-label="Back to top"

  </main>
</body>
```

---

## CSS Requirements

### Theming via Custom Properties

Define on `:root`:
- `--primary-bg` (light gray background)
- `--secondary-bg` (white in light mode — the content reading surface)
- `--text-color` (dark text)
- `--border-color` (subtle gray borders)
- `--highlight-color` (blue accent)
- `--hover-bg` (light hover state)
- `--font-family` (system font stack)
- `--sidebar-width` (default 300px)
- `--font-size` (default 16px)

### Dark Mode

- `body.dark-mode` overrides all custom properties with dark values
- Toggle button switches between 🌙 and ☀️
- Persist choice to `localStorage` key `darkMode`

### Layout Rules

- `body`: flex column, 100vh, margin 0, overflow-x hidden, font-size uses `var(--font-size, 16px)`
- `header`: flex row, wraps, gap 0.5rem, background `--primary-bg`, subtle bottom border and shadow, z-index 10
- `main`: flex row, flex: 1, overflow hidden
- `.sidebar`: width `var(--sidebar-width)`, flex-shrink 0, flex column, background `--primary-bg`, padding `0` (no side padding — headers span full width), overflow hidden
- `.resizer`: 8px wide, `--highlight-color` background at 0.7 opacity, cursor col-resize, touch-action none; full opacity on hover and while dragging
- `.content-area`: flex 1, min-width 0, padding `0` (no padding — headers span full width), overflow-y auto, background `--secondary-bg`
- `#contentBody`: padding `0 1rem 1rem 1rem`, background `var(--secondary-bg)` (white reading surface; automatically dark in dark mode via the CSS variable)

### Color Scheme Summary

- **`--primary-bg`** (gray): header, sidebar, both panel headers
- **`--secondary-bg`** (white): content body, header utility buttons
- Header utility buttons use `--secondary-bg` background to stand out from the gray header

### Panel Headers

Both sidebar and content area use a shared `.panel-header` class:
- display flex, justify-content space-between, align-items center
- padding `0.5rem 0.5rem`, border-bottom 1px solid `--border-color`
- background `--primary-bg` (gray, matching header and sidebar)
- Full width within their parent container (no side padding on parent)
- h3 inside: margin 0, font-size 0.95rem

The content area header adds `.file-header` for sticky behavior:
- position sticky, top 0, z-index 5, padding `0.5rem 1rem`, background `--primary-bg` (same as sidebar header)

### Sidebar Internal Padding

- Filter input: margin `0.4rem 0.5rem 0 0.5rem`, width `calc(100% - 1rem)`
- `#treeList`: padding `0 0.5rem`
- These give the sidebar body content side padding while keeping the `.panel-header` full-width

### Buttons

- Default style: padding 0.4rem 0.75rem, `--highlight-color` background, white text, rounded 6px, no border
- Header utility buttons (dark mode, font size, token): `--secondary-bg` background, `--text-color` color, 1px `--border-color` border
- Hover: opacity 0.88, slight translateY lift
- Active: translateY returns to 0

### Responsive (max-width: 768px)

- Sidebar shrinks to 25% width
- Resizer narrows to 4px
- File header stacks vertically

---

## JavaScript

### Utility

```js
const escapeHTML = ( str ) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String( str ).replace( /[&<>"']/g, ( c ) => map[ c ] );
};
```

### CONFIG & Application State

```js
const CONFIG = {
  owner: '',   // empty = auto-detect
  repo: '',    // empty = auto-detect
  branch: '',  // empty = fetch default branch from API later
};

const state = {
  owner: '',
  repo: '',
  branch: '',
  tree: null,
  currentFilePath: '',
};
```

### Storage Key Helper

```js
const storageKey = ( suffix ) => `tootoo-lt:${ location.pathname }:${ suffix }`;
```

All per-instance localStorage keys use this to namespace by pathname.

### `updateHeaderFromConfig()`

Called after repo is detected. Dynamically sets:
- `document.title` → `"owner / repo"`
- `#headerTitle` text → `"owner / repo"`
- `#headerGitHub` href → `https://github.com/owner/repo`

### `detectRepo()` Cascade

Returns a Promise. Runs this cascade when `CONFIG.owner` or `CONFIG.repo` are empty:

1. **URL query parameters** → `?owner=X&repo=Y&branch=Z` merged into CONFIG
2. **CONFIG already filled** → use directly, call `updateHeaderFromConfig()`
3. **localStorage cache** → read `storageKey('repo')` JSON (`{owner, repo}`) — checked before `.git/config` to avoid noisy 404 console errors
4. **Fetch `.git/config`** → try paths `''`, `'../'`, `'../../'`, `'../../../'`, `'../../../../'`; parse `github.com[:/]owner/repo` from remote URL; cache result to localStorage
5. **Show inline form** → render a simple owner + repo form in the content area; on submit, save to localStorage and resolve

After detection, copy `CONFIG.owner` / `CONFIG.repo` / `CONFIG.branch` into `state`.

### Dark Mode Toggle
- `body.dark-mode` class toggle
- Persist to `localStorage`
- Update button emoji

### Font Size Adjustment
- Read current size from `document.documentElement` computed style
- Clamp between 10px and 28px, step 2px
- Set `fontSize` directly on `document.documentElement.style` (the `<html>` element) so all `rem` units scale proportionally
- Persist to `localStorage` key `fontSize`

### Resizable Sidebar
- Pointer events (pointerdown/pointermove/pointerup) on `.resizer`
- Use `setPointerCapture` for reliable dragging
- Update `--sidebar-width` on sidebar element
- Set `user-select: none` and `cursor: col-resize` on body during drag
- Persist width to `localStorage` key `sidebarWidth`

### Token Prompt
- `prompt()` dialog for GitHub PAT
- Store in `localStorage` key `githubToken`
- Reload page after change

### Back-to-Top Button
- Show when `.content-area` scrolls past 400px
- Smooth-scroll content area to top on click

### Init (on page load)
1. Restore sidebar width from localStorage
2. Restore dark mode from localStorage
3. Restore font size from localStorage
4. Run `detectRepo()` → cascade resolves CONFIG
5. Copy CONFIG into `state`
6. Show "Ready — repo detected" or similar confirmation in the content area (placeholder for future tree loading)

---

## What NOT to Include

- No GitHub API calls beyond `.git/config` fetch for auto-detect
- No file tree rendering
- No file content loading
- No markdown rendering libraries
- No hash routing
