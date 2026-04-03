# TooToo SPA Prompt

Write a single-file Vanilla JavaScript SPA (HTML/CSS/JS in one `index.html` file) that serves as a fast, flexible GitHub Repository, Gist, and Organization browser.

## Hard Constraints
- **NO build tools, frameworks, or package managers**. Write strictly in Vanilla JS (ES2020+), HTML5, and CSS3.
- All styles must be in a single `<style>` block using CSS custom properties (`:root`).
- All external dependencies must be loaded via CDN (`marked.js` for Markdown, `highlight.js` for syntax highlighting).
- The app must be fully responsive (flex-wrapping header, locally scrolling content areas). Do NOT use `width: 100vw` or global overflow that causes horizontal scrollbar bugs.

## Layout & Styling
- **Header:** Contains an app title (clicking it reloads the page), an input for "owner/org" name, buttons for "Get Repos", "Get Orgs", "Get Gists", "Stats", "🌍 Discover", a hidden "Expand All" tree toggle, and a "⚙️ Token" button to set a localStorage Personal Access Token for higher rate limits.
- **Main Layout:** A Flexbox container with a left `sidebar` (for lists/trees), a draggable `resizer` divider (min-width constraint 40px), and a right `content-area` (min-width: 0 to naturally compress).

## Core Functionality
- **API Fetching & Abort Controllers:** Use `fetch` for all GitHub API calls. Implement a global `AbortController` (`mainAbortController`) that cancels pending fetches whenever a new top-level view or file is selected to prevent race conditions. Note: Never send the `Authorization` header to `raw.githubusercontent.com` to avoid CORS preflight blocks.
- **State Management:** Use a simple global state object to track: `owner`, `repo`, `branch`, `tree`, `isGist`, and `currentFilePath`.
- **Routing:** Use `window.location.hash` and `popstate` events to handle routing. (e.g. `#owner/repo/path/to/file.md` or `#gist/gistId/filename`).

## Left Sidebar Views
1. **Repo/Org/Gist Lists:** Display dynamically fetched lists based on the owner input. Include pagination (`per_page=100`) and a "Load More" button button if necessary. Provide a sticky "Filter items..." input box that actively filters the visible list items using a `250ms` debounced `setTimeout`.
2. **Repository Tree View:** When a repo is clicked, fetch the `/git/trees/{branch}?recursive=1` endpoint. Display a truncated warning banner if the `truncated` flag is true. Render the tree using semantic HTML `<details>` and `<summary>` tags for folders. Auto-open `README.md` if present.
3. **Keyboard Navigation:** The Tree View must support full arrow-key (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) and `Enter` / `Space` navigation across visible nodes.

## Content Area Viewer
- **Breadcrumb Header:** Show a sticky file header with the clickable repository name (routing back to the tree root without a file), the file path, the file name, and a "View Source on GitHub" icon linking to the official GitHub URL. Include a "New Tab" button and toggle buttons for "Rendered" vs "Raw" views.
- **File Rendering (Abstracted):** Parse file extensions and render appropriately:
  - `.md`: Use `marked.parse()`. Intercept internal markdown links to natively route to other files in the repo via hash changes instead of standard HTTP navigation.
  - Image/Video/Audio: Native HTML tags.
  - `.pdf`: Embed via Google Docs Viewer iframe.
  - `.html`: Load using a generated `Blob` URL inside a sandboxed iframe.
  - Everything else: Raw text inside `<pre><code class="language-{ext}">` tags. Automatically trigger `hljs.highlightAll()` on load.

## Advanced Features
- **Stats View:** Fetch and display rich API data containing repo sizes, stars, forks, languages, and user follower counts in a clean CSS grid layout.
- **Discover Page:** Render a curated landing page featuring hardcoded massive Orgs/Devs, a "Random User" dice roll button, and an API ping to fetch the top global followed users.
- **Global Error Handling:** Attach `window.addEventListener('error')` and `unhandledrejection` to catch and loudly print JavaScript crashes directly into the `content-area` instead of dying silently in the console. Handle `AbortError` gracefully by ignoring it.
