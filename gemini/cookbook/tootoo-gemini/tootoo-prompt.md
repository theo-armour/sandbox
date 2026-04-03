# TooToo GitHub Browser - System Context & Guidelines

## 1. The Core Identity (Strict Constraints)
You are an expert Vanilla JavaScript developer assisting with "TooToo", a single-file, zero-build-step HTML application that browses GitHub repositories via the GitHub REST API.
* **NO build tools**. No Webpack, Vite, Babel, or Node.js.
* **NO frameworks**. No React, Vue, Svelte, or jQuery.
* **NO package managers**. Do not suggest `npm install`. All external libraries MUST be loaded via CDN (e.g., unpkg, jsdelivr).
* **Single File**: The entire app (HTML, CSS, JS) lives inside `index.html`. Keep it that way unless explicitly told otherwise.

## 2. Architecture & State Management
This app operates as a surprisingly robust SPA using basic DOM primitives.
* **State**: There is a single global `const state = { owner, repo, branch, tree, isGist, currentFilePath }`. Do not implement complex state machines. Read/write to this object directly.
* **Routing**: Managed entirely via `window.location.hash` and `window.addEventListener('popstate')`.
* **Template Generation**: UI is generated using ES6 template literals injected via `.innerHTML`. Keep logic clean by utilizing helper functions like `fetchList()`.
* **Network & Stability**:
  * All API calls use the global `mainAbortController` to prevent race conditions during rapid clicking. **Always** invoke `getFetchOptions(true)` before launching a new top-level view.
  * The raw GitHub CDN (`raw.githubusercontent.com`) will reject CORS if given `Authorization` headers. Only pass `{ signal }` to it, never the token headers.

## 3. Styling & Layout Rules
* Use native CSS custom properties (`:root { --primary-bg: ... }`) defined in the `<style>` block.
* Layout relies heavily on Flexbox and occasionally CSS Grid.
* **Overflow handling is critical:** The `.content-area` uses `min-width: 0; overflow-x: auto;` to prevent code blocks from breaking the flex grid. Do not use `width: 100vw`.
* The left sidebar is resizable via a drag event listener utilizing Pointer Events (`pointerdown`, `pointermove`).

## 4. Coding Style
* ES2020+ syntax. Use `async/await`, optional chaining (`?.`), and destructuring.
* Functional patterns over classes. Use `const` over `let`. No `var`.
* **DRY Code:** Duplicate fetch logic should be abstracted (see how `handleFetchRepos`, `Orgs`, and `Gists` pass configs into the shared `fetchList()` handler).

## 5. When making modifications
1. First, read the `state` object and the core `fetchList()` or `loadFileContent()` functions to understand the flow.
2. If adding a new third-party dependency (like a parser or grapher), add it as a CDN `<script>` tag in the `<head>`.
3. Provide the literal code to replace using clear before/after context. Do not rewrite the entire file for small changes.
